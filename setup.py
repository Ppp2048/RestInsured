#!/usr/bin/env python3
"""
RestInsured Setup Script
Automates project setup and running
"""

import os
import sys
import subprocess
import platform

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required. Current version:", f"{version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing dependencies...")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    
    success, stdout, stderr = run_command("pip install -r requirements.txt", cwd=backend_dir)
    if success:
        print("✅ Dependencies installed successfully")
        return True
    else:
        print(f"❌ Failed to install dependencies: {stderr}")
        return False

def train_model():
    """Train the ML model"""
    print("\n🤖 Training ML model...")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    
    success, stdout, stderr = run_command("python ml/training/train_model.py", cwd=backend_dir)
    if success:
        print("✅ ML model trained successfully")
        return True
    else:
        print(f"❌ Failed to train model: {stderr}")
        return False

def setup_environment():
    """Setup environment variables"""
    print("\n⚙️ Setting up environment...")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    env_file = os.path.join(backend_dir, ".env")
    
    if not os.path.exists(env_file):
        print("📝 Creating .env file...")
        env_content = """# Anthropic Claude API Key
ANTHROPIC_API_KEY=your_secret_key_here

# Database Configuration (for future use)
# DATABASE_URL=postgresql://user:password@localhost/restinsured

# Other Configuration
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:5500"]
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️  Please edit backend/.env and add your ANTHROPIC_API_KEY")
    else:
        print("✅ .env file already exists")
    
    return True

def start_backend():
    """Start the backend server"""
    print("\n🚀 Starting backend server...")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    
    if platform.system() == "Windows":
        command = "start cmd /k python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
    else:
        command = "python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
    
    print("🌐 Backend will be available at: http://127.0.0.1:8000")
    print("📚 API Documentation: http://127.0.0.1:8000/docs")
    print("\n⚠️  Keep this terminal open to run the server")
    print("📱 Open frontend/index.html in your browser to use the application")
    
    success, stdout, stderr = run_command(command, cwd=backend_dir)
    if not success:
        print(f"❌ Failed to start backend: {stderr}")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🎯 RestInsured Setup Script")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Train ML model
    if not train_model():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Edit backend/.env and add your ANTHROPIC_API_KEY")
    print("2. Run 'python setup.py --start' to start the backend")
    print("3. Open frontend/index.html in your browser")
    print("4. Visit http://127.0.0.1:8000/docs for API documentation")
    
    # Check if --start flag is provided
    if len(sys.argv) > 1 and sys.argv[1] == "--start":
        start_backend()

if __name__ == "__main__":
    main()
