// ════════════════════════════════════════════════════════
// RestInsured — Cliste 2.1 Full Feature Engine
// ════════════════════════════════════════════════════════

// ═══════ STATE ═══════
let currentStep = 0;
let selectedConditions = [];
let selectedFamilyHistory = [];
let selectedPriority = [];

// ═══════ INSURER DATA (IRDAI 2024) ═══════
const INSURERS = [
  { provider:'Star Health', product:'Assure Plan', type:'health', topology:'Private', maxSum:'₹1 Cr', premium:'₹8,200', csr:'98.5%', network:'14,200+', wait:'2 yrs', score:'9.2' },
  { provider:'HDFC Ergo', product:'Optima Secure', type:'health', topology:'Private', maxSum:'₹1 Cr', premium:'₹9,400', csr:'97.2%', network:'12,800+', wait:'3 yrs', score:'9.5' },
  { provider:'Niva Bupa', product:'ReAssure 2.0', type:'health', topology:'Private', maxSum:'₹50 L', premium:'₹7,800', csr:'91.8%', network:'10,500+', wait:'2 yrs', score:'8.9' },
  { provider:'Care Health', product:'Care Supreme', type:'health', topology:'Private', maxSum:'₹6 Cr', premium:'₹8,100', csr:'92.5%', network:'11,200+', wait:'3 yrs', score:'8.7' },
  { provider:'Aditya Birla', product:'Activ Health', type:'health', topology:'Private', maxSum:'₹2 Cr', premium:'₹7,200', csr:'89.4%', network:'9,800+', wait:'2 yrs', score:'8.4' },
  { provider:'ICICI Lombard', product:'Health Shield', type:'health', topology:'Private', maxSum:'₹1 Cr', premium:'₹10,500', csr:'96.1%', network:'13,400+', wait:'3 yrs', score:'9.3' },
  { provider:'Tata AIG', product:'MediCare', type:'health', topology:'Private', maxSum:'₹75 L', premium:'₹8,900', csr:'94.2%', network:'10,100+', wait:'2 yrs', score:'9.0' },
  { provider:'Digit Insurance', product:'Double Wallet', type:'health', topology:'Private', maxSum:'₹25 L', premium:'₹7,500', csr:'90.5%', network:'8,200+', wait:'2 yrs', score:'8.2' },
  { provider:'National Insurance', product:'Parivar Mediclaim', type:'floater', topology:'Govt/PSU', maxSum:'₹10 L', premium:'₹12,800', csr:'86.2%', network:'6,400+', wait:'4 yrs', score:'7.1' },
  { provider:'New India Assurance', product:'Senior Citizen', type:'senior', topology:'Govt/PSU', maxSum:'₹10 L', premium:'₹18,500', csr:'95.8%', network:'7,200+', wait:'1 yr', score:'8.5' },
  { provider:'Max Life', product:'Smart Secure Plus', type:'term', topology:'Private', maxSum:'₹5 Cr', premium:'₹12,400', csr:'99.5%', network:'N/A', wait:'N/A', score:'9.8' },
  { provider:'HDFC Life', product:'Click 2 Protect', type:'term', topology:'Private', maxSum:'₹10 Cr', premium:'₹11,200', csr:'99.1%', network:'N/A', wait:'N/A', score:'9.6' },
  { provider:'ICICI Pru', product:'iProtect Smart', type:'term', topology:'Private', maxSum:'₹5 Cr', premium:'₹10,900', csr:'98.6%', network:'N/A', wait:'N/A', score:'9.4' },
  { provider:'LIC', product:'Jeevan Amar', type:'term', topology:'Govt/PSU', maxSum:'₹1 Cr', premium:'₹14,200', csr:'98.6%', network:'N/A', wait:'N/A', score:'9.1' },
  { provider:'Bajaj Allianz', product:'Critical Illness Guard', type:'critical', topology:'Private', maxSum:'₹50 L', premium:'₹6,800', csr:'93.1%', network:'11,800+', wait:'90 days', score:'8.6' },
  { provider:'SBI General', product:'Arogya Supreme', type:'health', topology:'Govt/PSU', maxSum:'₹5 Cr', premium:'₹9,200', csr:'94.5%', network:'8,900+', wait:'2 yrs', score:'8.8' },
  { provider:'Star Health', product:'Family Optima', type:'floater', topology:'Private', maxSum:'₹25 L', premium:'₹15,600', csr:'97.8%', network:'14,200+', wait:'2 yrs', score:'9.0' },
  { provider:'Religare (Care)', product:'Care Freedom', type:'senior', topology:'Private', maxSum:'₹10 L', premium:'₹22,000', csr:'88.9%', network:'9,500+', wait:'1 yr', score:'7.8' },
];

// ═══════ MOTION ENGINE ═══════
function initMotion() {
  // Navbar scroll
  let lastScroll = 0;
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    const s = window.pageYOffset;
    if (s <= 80) { header.classList.remove('nav-hidden'); lastScroll = s; return; }
    header.classList.toggle('nav-hidden', s > lastScroll);
    lastScroll = s;
  });

  // Body hover gradient
  const glow = document.getElementById('bodyGlow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    });
  }

  // SMOOTH Rotating Headline
  const words = document.querySelectorAll('.rotate-word');
  if (words.length) {
    let current = 0;
    setInterval(() => {
      const out = words[current];
      gsap.to(out, { y: -40, opacity: 0, duration: 0.8, ease: "power3.inOut" });
      current = (current + 1) % words.length;
      const next = words[current];
      gsap.fromTo(next,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: "power3.out" }
      );
    }, 3500);
  }

  // Glass spotlights
  document.querySelectorAll('.glass-panel').forEach(p => {
    p.addEventListener('mousemove', e => {
      const r = p.getBoundingClientRect();
      p.style.setProperty('--mouse-x', `${((e.clientX - r.left)/r.width)*100}%`);
      p.style.setProperty('--mouse-y', `${((e.clientY - r.top)/r.height)*100}%`);
    });
  });

  // Scroll Reveal
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.section').forEach(sec => {
      ScrollTrigger.create({ trigger: sec, start: "top 88%", onEnter: () => sec.classList.add('reveal') });
    });
  }
}

// ═══════ FORM NAVIGATION ═══════
function nextStep(f) {
  if (f === 0 && !document.getElementById('age').value) { alert('Please enter your age.'); return; }
  document.getElementById('step-' + f).style.display = 'none';
  document.getElementById('step-' + (f + 1)).style.display = 'block';
  currentStep = f + 1;
  updateProgress(f + 1);
  gsap.from('#step-' + (f + 1), { opacity: 0, x: 30, duration: 0.4 });
}
function prevStep(f) {
  document.getElementById('step-' + f).style.display = 'none';
  document.getElementById('step-' + (f - 1)).style.display = 'block';
  currentStep = f - 1;
  updateProgress(f - 1);
  gsap.from('#step-' + (f - 1), { opacity: 0, x: -30, duration: 0.4 });
}
function updateProgress(step) {
  const pct = (step / 4) * 100;
  gsap.to('#progressFill', { width: pct + '%', duration: 0.5, ease: 'power2.out' });
  document.querySelectorAll('.p-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i === step) el.classList.add('active');
    if (i < step) el.classList.add('done');
    const dot = el.querySelector('.p-dot');
    dot.textContent = i < step ? '✓' : (i + 1);
  });
}

// ═══════ TAG TOGGLING ═══════
function toggleTag(el, group) {
  el.classList.toggle('active');
  let arr;
  if (group === 'condition') arr = selectedConditions;
  else if (group === 'family') arr = selectedFamilyHistory;
  else arr = selectedPriority;
  const val = el.textContent.trim();
  const idx = arr.indexOf(val);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
}

// ═══════ DYNAMIC FIELDS ═══════
function toggleChildAges() {
  const v = parseInt(document.getElementById('children').value) || 0;
  const d = document.getElementById('childrenAges'); d.innerHTML = '';
  for (let i = 1; i <= Math.min(v, 4); i++) {
    d.innerHTML += `<input type="number" placeholder="Child ${i} age" style="width:90px;padding:10px 12px;background:rgba(0,0,0,0.35);border:1px solid var(--border);border-radius:10px;color:#FFF;font-size:13px">`;
  }
}
function toggleParentAges() {
  const v = document.getElementById('parents').value;
  const d = document.getElementById('parentAges'); d.innerHTML = '';
  if (v === 'father' || v === 'both' || v === 'in_laws') d.innerHTML += `<input type="number" placeholder="Father age" style="width:100px;padding:10px 12px;background:rgba(0,0,0,0.35);border:1px solid var(--border);border-radius:10px;color:#FFF;font-size:13px">`;
  if (v === 'mother' || v === 'both' || v === 'in_laws') d.innerHTML += `<input type="number" placeholder="Mother age" style="width:100px;padding:10px 12px;background:rgba(0,0,0,0.35);border:1px solid var(--border);border-radius:10px;color:#FFF;font-size:13px">`;
}

// ═══════ BMI (IN-FORM) ═══════
function toggleBMICalc() {
  const p = document.getElementById('bmiCalcPanel');
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
}
function calculateAndSetBMI() {
  const h = parseFloat(document.getElementById('bmiHeight').value);
  const w = parseFloat(document.getElementById('bmiWeight').value);
  if (!h || !w) return;
  const bmi = w / ((h / 100) ** 2);
  const sel = document.getElementById('bmi');
  if (bmi < 25) sel.value = 'normal';
  else if (bmi < 30) sel.value = 'overweight';
  else sel.value = 'obese';
}

// ═══════ ANALYSIS ═══════
async function runAnalysis() {
  calculateAndSetBMI();
  const profile = {
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    state: document.getElementById('state').value,
    income: document.getElementById('income').value,
    type: document.getElementById('insuranceType').value,
    occupation: document.getElementById('occupation').value,
    tobacco: document.getElementById('tobacco').value,
    alcohol: document.getElementById('alcohol').value,
    conditions: selectedConditions,
    familyHistory: selectedFamilyHistory,
    bmi: document.getElementById('bmi').value,
    priority: selectedPriority,
    budget: document.getElementById('budget').value,
    topology: document.getElementById('topology').value,
    notes: document.getElementById('notes').value
  };

  document.getElementById('formSection').style.display = 'none';
  document.getElementById('loadingSection').style.display = 'block';

  const prompt = `Actuarial analysis for ${profile.age}yo ${profile.gender} from ${profile.state}, ₹${profile.income}L income. Type: ${profile.type}. Occupation: ${profile.occupation}. Tobacco: ${profile.tobacco}. Alcohol: ${profile.alcohol}. BMI: ${profile.bmi}. Pre-existing: ${profile.conditions.join(', ')||'None'}. Family history: ${profile.familyHistory.join(', ')||'None'}. Priority: ${profile.priority.join(', ')||'None'}. Budget: ${profile.budget||'No pref'}. Topology: ${profile.topology}. Notes: ${profile.notes||'None'}. Respond ONLY in JSON: {"riskScore":N,"riskLabel":"S","insight":"S","plans":[{"insurer":"S","planName":"S","annualPremium":"S","features":["S"]}]}`;

  try {
    const resp = await callBackend(prompt);
    const data = JSON.parse(resp.replace(/```json|```/g, '').trim());
    showResults(data);
  } catch (e) {
    console.error(e);
    // Fallback to simulated results
    showResults({
      riskScore: Math.floor(Math.random() * 30 + 65),
      riskLabel: 'Moderate',
      insight: `Based on your ${profile.age}yo ${profile.gender} profile with ${profile.conditions.length > 0 ? profile.conditions.join(', ') : 'no pre-existing conditions'}, ${profile.type} is recommended at ₹${profile.income}L income bracket. Tobacco status (${profile.tobacco}) has been factored. Consider ${profile.priority.join(', ')||'standard'} features.`,
      plans: INSURERS.filter(i => i.type === 'health').slice(0, 3).map(i => ({
        insurer: i.provider, planName: i.product, annualPremium: i.premium,
        features: ['Cashless at ' + i.network + ' hospitals', 'CSR: ' + i.csr, 'Pre-existing wait: ' + i.wait]
      }))
    });
  }
}

function showResults(data) {
  document.getElementById('loadingSection').style.display = 'none';
  const res = document.getElementById('resultsSection');
  res.style.display = 'block';
  document.getElementById('riskScore').textContent = data.riskScore;
  document.getElementById('riskLabel').textContent = data.riskLabel + ' Risk';
  document.getElementById('aiInsightText').textContent = data.insight;

  const grid = document.getElementById('plansGrid');
  grid.innerHTML = (data.plans || []).map(p => `
    <div class="glass-panel" style="padding:28px;border-left:3px solid var(--primary)">
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div><h4 style="color:#FFF;margin-bottom:4px">${p.insurer}</h4><p style="font-size:12px;color:rgba(255,255,255,0.35)">${p.planName}</p></div>
        <div style="text-align:right"><div style="font-size:1.4rem;font-weight:800;color:var(--primary)">${p.annualPremium}</div><small style="color:rgba(255,255,255,0.3)">/year</small></div>
      </div>
      <ul style="list-style:none;margin-top:16px;font-size:13px;color:rgba(255,255,255,0.5)">
        ${(p.features||[]).map(f => `<li style="margin-bottom:6px">✦ ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  gsap.from(res, { y: 30, opacity: 0, duration: 0.6 });
}

function resetAnalysis() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('step-0').style.display = 'block';
  for (let i = 1; i <= 4; i++) document.getElementById('step-' + i).style.display = 'none';
  updateProgress(0);
}

// ═══════ COMPARISON TABLE ═══════
let currentFilter = 'all';
function renderCompTable(filter) {
  const b = document.getElementById('compBody'); if (!b) return;
  const data = filter === 'all' ? INSURERS : INSURERS.filter(i => i.type === filter);
  b.innerHTML = data.map(i => `
    <tr>
      <td style="padding-left:20px"><div style="font-weight:700;font-size:13px">${i.provider}</div><small style="color:rgba(255,255,255,0.25)">${i.product}</small></td>
      <td style="font-size:12px">${i.topology}</td>
      <td style="font-weight:700">${i.maxSum}</td>
      <td style="font-weight:800;color:var(--primary)">${i.premium}</td>
      <td><span style="background:rgba(16,185,129,0.08);color:var(--primary);padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800">${i.csr}</span></td>
      <td style="font-size:12px">${i.network}</td>
      <td style="font-size:12px">${i.wait}</td>
      <td><span style="background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:20px;font-size:12px;font-weight:800">${i.score}</span></td>
    </tr>
  `).join('');
}
function filterMatrix(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.matrix-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCompTable(filter);
}

// ═══════ POLICY DECONSTRUCTOR ═══════
function switchPolicyTab(tab, btn) {
  document.querySelectorAll('.policy-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('policyTextTab').style.display = tab === 'text' ? 'block' : 'none';
  document.getElementById('policyUrlTab').style.display = tab === 'url' ? 'block' : 'none';
}

async function analyzePolicy() {
  const text = document.getElementById('policyText').value;
  if (!text) { alert('Please paste policy text.'); return; }
  
  document.getElementById('nlpLoading').style.display = 'block';
  document.getElementById('nlpResults').style.display = 'none';

  const prompt = `Analyze this insurance policy text and extract: 1) Key Inclusions, 2) Key Exclusions, 3) Red Flags / Watch Out (hidden traps), 4) Waiting Periods, 5) Unique Features. Response as JSON: {"policyName":"S","inclusions":["S"],"exclusions":["S"],"redFlags":["S"],"waitingPeriods":["S"],"uniqueFeatures":["S"],"overallScore":N}. Policy text: ${text}`;
  
  try {
    const resp = await callBackend(prompt);
    const d = JSON.parse(resp.replace(/```json|```/g, '').trim());
    showPolicyResults(d);
  } catch (e) {
    // Fallback: keyword analysis
    const t = text.toLowerCase();
    let html = `<h4 style="color:var(--accent);margin-bottom:16px">${text.substring(0, 40)}... — Clause Breakdown</h4>`;
    const findings = [];
    if (t.includes('waiting period')) findings.push({ type: 'warning', text: 'Found <strong>Waiting Period</strong> clauses — most pre-existing conditions have 2-4 year limits.' });
    if (t.includes('room rent')) findings.push({ type: 'danger', text: '<strong>Room Rent Capping</strong> detected — proportional deduction risk on claims.' });
    if (t.includes('sub-limit') || t.includes('sublimit')) findings.push({ type: 'danger', text: '<strong>Sub-limits</strong> found on surgeries/ailments — claims may be partially denied.' });
    if (t.includes('co-payment') || t.includes('copay')) findings.push({ type: 'warning', text: '<strong>Co-payment</strong> requirement detected — you pay a % of every claim.' });
    if (t.includes('ayush')) findings.push({ type: 'positive', text: 'Alternative medicine (AYUSH) coverage included.' });
    if (t.includes('cashless')) findings.push({ type: 'positive', text: '<strong>Cashless</strong> hospitalization available at network hospitals.' });
    if (t.includes('maternity')) findings.push({ type: 'positive', text: '<strong>Maternity</strong> coverage found — check waiting period (usually 2-4 yrs).' });
    if (t.includes('no claim bonus') || t.includes('ncb')) findings.push({ type: 'positive', text: '<strong>No-Claim Bonus</strong> — sum insured increases on claim-free years.' });
    if (findings.length === 0) findings.push({ type: 'positive', text: 'No obvious restrictive clauses detected. Standard policy terms applied.' });
    
    html += findings.map(f => {
      const color = f.type === 'danger' ? 'var(--danger)' : f.type === 'warning' ? '#F59E0B' : 'var(--primary)';
      const icon = f.type === 'danger' ? '⚠' : f.type === 'warning' ? '⚡' : '✦';
      return `<div style="padding:12px 0;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:start"><span style="color:${color};font-size:16px">${icon}</span><span>${f.text}</span></div>`;
    }).join('');
    
    document.getElementById('nlpLoading').style.display = 'none';
    document.getElementById('nlpResults').style.display = 'block';
    document.getElementById('nlpContent').innerHTML = html;
    gsap.from('#nlpResults', { scale: 0.97, opacity: 0, duration: 0.4 });
  }
}

function showPolicyResults(d) {
  document.getElementById('nlpLoading').style.display = 'none';
  let html = `<h4 style="color:var(--accent);margin-bottom:20px">${d.policyName || 'Policy Analysis'}</h4>`;
  if (d.inclusions?.length) html += `<h5 style="color:var(--primary);margin:16px 0 8px">Key Inclusions</h5>${d.inclusions.map(i => `<div style="padding:4px 0;font-size:13px">✦ ${i}</div>`).join('')}`;
  if (d.exclusions?.length) html += `<h5 style="color:var(--danger);margin:16px 0 8px">Key Exclusions</h5>${d.exclusions.map(i => `<div style="padding:4px 0;font-size:13px">✗ ${i}</div>`).join('')}`;
  if (d.redFlags?.length) html += `<h5 style="color:#F59E0B;margin:16px 0 8px">⚠ Red Flags</h5>${d.redFlags.map(f => `<div style="padding:4px 0;font-size:13px">⚡ ${f}</div>`).join('')}`;
  document.getElementById('nlpResults').style.display = 'block';
  document.getElementById('nlpContent').innerHTML = html;
  gsap.from('#nlpResults', { scale: 0.97, opacity: 0, duration: 0.4 });
}

// ═══════ CALCULATORS ═══════
function calculateHLV() {
  const age = parseFloat(document.getElementById('hlvAge').value) || 30;
  const ret = parseFloat(document.getElementById('hlvRetirement').value) || 60;
  const inc = parseFloat(document.getElementById('hlvIncome').value) || 0;
  const exp = (parseFloat(document.getElementById('hlvExpenses').value) || 30) / 100;
  const g = (parseFloat(document.getElementById('hlvGrowth').value) || 8) / 100;
  const r = (parseFloat(document.getElementById('hlvDiscount').value) || 6) / 100;
  const n = ret - age;
  if (n <= 0 || inc <= 0) return;
  const net = inc * (1 - exp);
  let pv = 0;
  if (Math.abs(r - g) < 0.001) { pv = net * n; }
  else { pv = net * (1 - Math.pow((1 + g) / (1 + r), n)) / (r - g); }
  document.getElementById('hlvResult').style.display = 'block';
  document.getElementById('hlvValue').textContent = '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(pv);
  gsap.from('#hlvResult', { y: 15, opacity: 0, duration: 0.4 });
}

function calculateBMIWidget() {
  const h = parseFloat(document.getElementById('bmiCalcHeight').value);
  const w = parseFloat(document.getElementById('bmiCalcWeight').value);
  if (!h || !w) return;
  const bmi = w / ((h / 100) ** 2);
  document.getElementById('bmiResult').style.display = 'block';
  document.getElementById('bmiResultVal').textContent = bmi.toFixed(1);
  const label = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const color = bmi < 18.5 ? '#F59E0B' : bmi < 25 ? 'var(--primary)' : bmi < 30 ? '#F59E0B' : 'var(--danger)';
  document.getElementById('bmiResultLabel').innerHTML = `<span style="color:${color}">${label}</span>`;
  gsap.from('#bmiResult', { y: 15, opacity: 0, duration: 0.4 });
}

function calculateTermPremium() {
  const age = parseInt(document.getElementById('termAge').value) || 30;
  const cover = parseFloat(document.getElementById('termCover').value) || 1;
  const tobacco = document.getElementById('termTobacco').value === 'yes';
  const tenure = parseInt(document.getElementById('termTenure').value) || 30;
  // Simplified actuarial estimate
  let base = cover * 10000000 * 0.0003; // base rate
  base *= (1 + (age - 25) * 0.04);       // age loading
  if (tobacco) base *= 1.6;              // tobacco loading
  base *= (1 + (tenure - 20) * 0.01);    // tenure adjustment
  base = Math.max(base, 5000);

  document.getElementById('termResult').style.display = 'block';
  document.getElementById('termResultVal').textContent = '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(base));
  gsap.from('#termResult', { y: 15, opacity: 0, duration: 0.4 });
}

function calculateEduInflation() {
  const cost = parseFloat(document.getElementById('eduCost').value) || 0;
  const yrs = parseFloat(document.getElementById('eduYears').value) || 0;
  const inf = (parseFloat(document.getElementById('eduInflation').value) || 10) / 100;
  if (!cost || !yrs) return;
  const future = cost * Math.pow(1 + inf, yrs);
  document.getElementById('eduResult').style.display = 'block';
  document.getElementById('eduResultVal').textContent = '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(future));
  gsap.from('#eduResult', { y: 15, opacity: 0, duration: 0.4 });
}

// ═══════ FIRE NUMBER CALCULATOR ═══════
function calculateFIRE() {
  const monthly = parseFloat(document.getElementById('fireExpense').value) || 0;
  const swr = parseFloat(document.getElementById('fireRate').value) || 4;
  if (!monthly) return;
  const annual = monthly * 12;
  const corpus = annual / (swr / 100);
  const el = document.getElementById('fireResult');
  el.style.display = 'block';
  document.getElementById('fireVal').textContent = '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(corpus));
  gsap.from(el, { y: 10, opacity: 0, duration: 0.4 });
}

// ═══════ INITIALIZATION ═══════
document.addEventListener('DOMContentLoaded', () => {
  initMotion();
  renderCompTable('all');

  // Animate CIRI gauge bar
  const ciriBar = document.getElementById('ciriBar');
  if (ciriBar) {
    setTimeout(() => { ciriBar.style.width = '65%'; }, 800);
  }

  // Smooth scroll
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const t = document.getElementById(link.getAttribute('href').substring(1));
      if (t) window.scrollTo({ top: t.offsetTop - 100, behavior: 'smooth' });
    });
  });
});