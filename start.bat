@echo off
title RestInsured - AI Insurance Platform
echo ========================================
echo    RestInsured - AI Insurance Platform
echo ========================================
echo.

echo [1] Setup Project (First time only)
echo [2] Start Backend Server
echo [3] Test Backend
echo [4] Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto start
if "%choice%"=="3" goto test
if "%choice%"=="4" goto end

echo Invalid choice. Please try again.
pause
goto start

:setup
echo.
echo Setting up RestInsured project...
echo.
cd /d "%~dp0backend"
pip install -r requirements.txt
python ml/training/train_model.py
echo.
echo Setup completed! 
echo Please edit backend\.env file and add your ANTHROPIC_API_KEY
echo.
pause
goto start

:start
echo.
echo Starting backend server...
echo Backend will be available at: http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0backend"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
goto end

:test
echo.
echo Testing backend...
echo.
cd /d "%~dp0"
python test_backend.py
echo.
pause
goto start

:end
echo.
echo Thank you for using RestInsured!
pause
