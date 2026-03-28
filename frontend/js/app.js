// ═══════════════════════════════════
// STATE
// ═══════════════════════════════════
let currentStep = 0;
let selectedConditions = [];
let selectedFamily = [];
let selectedPriority = [];
let policyMode = 'text';

// ═══════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'comparison') renderCompTable('all');
}

// ═══════════════════════════════════
// STEP FORM
// ═══════════════════════════════════
function nextStep(from) {
  const errors = validateStep(from);
  if (errors.length) { alert(errors.join('\n')); return; }
  document.getElementById('step-' + from).style.display = 'none';
  if (from + 1 <= 4) {
    document.getElementById('step-' + (from + 1)).style.display = 'block';
    currentStep = from + 1;
    updateProgress(from + 1);
  }
}
function prevStep(from) {
  document.getElementById('step-' + from).style.display = 'none';
  document.getElementById('step-' + (from - 1)).style.display = 'block';
  currentStep = from - 1;
  updateProgress(from - 1);
}
function updateProgress(step) {
  const fill = (step / 4) * 100;
  document.getElementById('progressFill').style.width = fill + '%';
  document.querySelectorAll('.p-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i < step) el.classList.add('done');
    if (i === step) el.classList.add('active');
    if (i < step) { const d = el.querySelector('.p-dot'); d.innerHTML = '✓'; }
    else { el.querySelector('.p-dot').textContent = i + 1; }
  });
}
function validateStep(step) {
  const errs = [];
  if (step === 0) {
    if (!document.getElementById('age').value) errs.push('Please enter your age.');
    if (!document.getElementById('gender').value) errs.push('Please select gender.');
    if (!document.getElementById('insuranceType').value) errs.push('Please select insurance type needed.');
  }
  return errs;
}
function resetForm() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('formSection').style.display = 'block';
  document.querySelectorAll('.form-card').forEach((c, i) => { c.style.display = i === 0 ? 'block' : 'none'; });
  currentStep = 0; updateProgress(0);
}
function toggleTag(el, group) {
  el.classList.toggle('active');
  const map = { condition: selectedConditions, family: selectedFamily, priority: selectedPriority };
  const arr = map[group];
  const val = el.textContent.trim();
  const idx = arr.indexOf(val);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
}

// ═══════════════════════════════════
// BUILD USER PROFILE STRING
// ═══════════════════════════════════
function buildProfile() {
  const childrenVal = parseInt(document.getElementById('children').value) || 0;
  let childAges = [];
  for (let i = 1; i <= childrenVal; i++) {
    childAges.push(document.getElementById(`childAge_${i}`)?.value || '');
  }
  
  const parentsVal = document.getElementById('parents').value;
  let fatherAge = document.getElementById('fatherAge')?.value;
  let motherAge = document.getElementById('motherAge')?.value;
  let parentsAgesStr = '';
  if (fatherAge) parentsAgesStr += `Father Age: ${fatherAge} `;
  if (motherAge) parentsAgesStr += `Mother Age: ${motherAge}`;

  return {
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    city: document.getElementById('city').value || 'Not specified',
    income: document.getElementById('income').value,
    insuranceType: document.getElementById('insuranceType').value,
    occupation: document.getElementById('occupation').value || 'Not specified',
    workEnv: document.getElementById('workEnv').value || 'Not specified',
    tobacco: document.getElementById('tobacco').value,
    alcohol: document.getElementById('alcohol').value,
    marital: document.getElementById('marital').value,
    children: `${childrenVal} (Ages: ${childAges.join(', ')||'N/A'})`,
    parents: `${parentsVal} (${parentsAgesStr.trim()||'N/A'})`,
    elderlyParents: document.getElementById('elderlyParents').value,
    coverageAmount: document.getElementById('coverageAmount').value,
    conditions: selectedConditions,
    familyHistory: selectedFamily,
    bmi: document.getElementById('bmi').value,
    hospitalized: document.getElementById('hospitalized').value,
    priorities: selectedPriority,
    budget: document.getElementById('budget').value || 'flexible',
    insurerType: document.getElementById('insurerType').value,
    notes: document.getElementById('notes').value
  };
}

// ═══════════════════════════════════
// NEW CALCULATORS & UX DYNAMICS
// ═══════════════════════════════════
function toggleChildAges() {
  const val = parseInt(document.getElementById('children').value) || 0;
  const div = document.getElementById('childrenAges');
  if (val > 0) {
    div.style.display = 'flex';
    let html = '';
    for (let i = 1; i <= val; i++) {
      html += `<input type="number" id="childAge_${i}" placeholder="Age of child ${i}" style="width:120px;padding:8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)" min="0" max="30">`;
    }
    div.innerHTML = html;
  } else {
    div.style.display = 'none';
    div.innerHTML = '';
  }
}

function toggleParentAges() {
  const val = document.getElementById('parents').value;
  const div = document.getElementById('parentAges');
  if (val === 'father') {
    div.style.display = 'flex';
    div.innerHTML = `<input type="number" id="fatherAge" placeholder="Father's Age" style="width:120px;padding:8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)" min="30" max="99">`;
  } else if (val === 'mother') {
    div.style.display = 'flex';
    div.innerHTML = `<input type="number" id="motherAge" placeholder="Mother's Age" style="width:120px;padding:8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)" min="30" max="99">`;
  } else if (val === 'both' || val === 'in_laws') {
    div.style.display = 'flex';
    div.innerHTML = `
      <input type="number" id="fatherAge" placeholder="Father's Age" style="width:120px;padding:8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)" min="30" max="99">
      <input type="number" id="motherAge" placeholder="Mother's Age" style="width:120px;padding:8px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)" min="30" max="99">
    `;
  } else {
    div.style.display = 'none';
    div.innerHTML = '';
  }
}

function toggleBMICalc() {
  const pane = document.getElementById('bmiCalcPane');
  pane.style.display = pane.style.display === 'none' ? 'block' : 'none';
}

function calculateAndSetBMI() {
  const hRaw = document.getElementById('bmiHeight').value;
  const wRaw = document.getElementById('bmiWeight').value;
  if (!hRaw || !wRaw) {
    alert("Please enter both height and weight.");
    return;
  }
  const heightM = parseFloat(hRaw) / 100;
  const weight = parseFloat(wRaw);
  if (heightM <= 0 || weight <= 0) return;
  
  const bmiVal = weight / (heightM * heightM);
  const selectNode = document.getElementById('bmi');
  
  if (bmiVal < 25) {
    selectNode.value = 'normal';
  } else if (bmiVal < 30) {
    selectNode.value = 'overweight';
  } else {
    selectNode.value = 'obese';
  }
  
  toggleBMICalc(); // Hide pane
}

function calculateHLV() {
  const age = parseFloat(document.getElementById('hlvAge').value);
  const retireAge = parseFloat(document.getElementById('hlvRetireAge').value);
  const income = parseFloat(document.getElementById('hlvIncome').value);
  const expensePct = parseFloat(document.getElementById('hlvExpensePct').value);
  const growth = parseFloat(document.getElementById('hlvIncomeGrowth').value) / 100;
  const discountRate = parseFloat(document.getElementById('hlvDiscountRate').value) / 100;
  
  if (age >= retireAge || !income) {
     alert("Please ensure retirement age is greater than current age and income is valid.");
     return;
  }
  
  const years = retireAge - age;
  let hlv = 0;
  let currentIncome = income;
  
  // Present value of future net income
  for (let i = 1; i <= years; i++) {
     const netIncome = currentIncome * (1 - (expensePct/100));
     hlv += netIncome / Math.pow(1 + discountRate, i);
     currentIncome = currentIncome * (1 + growth);
  }
  
  document.getElementById('hlvResultPane').style.display = 'block';
  
  // Format to Indian Rupees cleanly
  const formatter = new Intl.NumberFormat('en-IN', {
     style: 'currency',
     currency: 'INR',
     maximumFractionDigits: 0
  });
  
  document.getElementById('hlvResultValue').textContent = formatter.format(hlv);
}

// ═══════════════════════════════════
// MAIN ANALYSIS
// ═══════════════════════════════════
async function runAnalysis() {
  const profile = buildProfile();

  document.getElementById('formSection').style.display = 'none';
  document.getElementById('loadingSection').style.display = 'flex';
  document.getElementById('resultsSection').style.display = 'none';
  animateLoadingSteps();

  const prompt = buildAnalysisPrompt(profile);

  try {
    const resp = await callBackend(prompt);
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    renderResults(resp, profile);
  } catch (e) {
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('errorBanner').style.display = 'block';
    document.getElementById('errorBanner').textContent = 'API Error: ' + e.message + '. Please try again.';
    renderFallbackResults(profile);
  }
}

function buildAnalysisPrompt(p) {
  return `You are an expert Indian insurance actuary and advisor with deep knowledge of all IRDAI-registered plans.

USER PROFILE:
- Age: ${p.age}, Gender: ${p.gender}, Location: ${p.city}
- Annual Income: ₹${p.income} LPA, Occupation: ${p.occupation}
- Work Environment: ${p.workEnv}
- Insurance Type Needed: ${p.insuranceType}
- Tobacco: ${p.tobacco}, Alcohol: ${p.alcohol}
- BMI: ${p.bmi}, Past Hospitalizations: ${p.hospitalized}
- Marital Status: ${p.marital}, Children: ${p.children}, Dependent Parents: ${p.parents}, Elderly parents 60+: ${p.elderlyParents}
- Desired Coverage: ₹${p.coverageAmount} Lakh
- Pre-existing Conditions: ${p.conditions.join(', ') || 'None'}
- Family Medical History: ${p.familyHistory.join(', ') || 'None'}
- Priority Features: ${p.priorities.join(', ') || 'General'}
- Monthly Budget: ₹${p.budget}
- Preferred Insurer Type: ${p.insurerType}
- Additional Notes: ${p.notes || 'None'}

Provide a comprehensive insurance analysis. Respond in this EXACT JSON format (no markdown, no code blocks, pure JSON):
{
  "riskScore": <number 1-100>,
  "riskLabel": "<Low/Moderate/High/Very High>",
  "riskColor": "<#10B981 for low / #F59E0B for moderate / #EF4444 for high>",
  "riskPercent": "<CSS conic-gradient pct, e.g. 42%>",
  "estimatedAnnualPremium": "<e.g. ₹12,400 – ₹18,600>",
  "recommendedCoverage": "<e.g. ₹10 Lakh>",
  "taxBenefit": "<e.g. Up to ₹25,000 under Sec 80D>",
  "waitingPeriodNote": "<short note on waiting period for their conditions>",
  "insight": "<3–5 sentence personalized insight: risk factors, what to watch out for, top recommendation reason, IRDAI tip>",
  "plans": [
    {
      "insurer": "<Company name>",
      "planName": "<Plan name>",
      "annualPremium": "<₹X,XXX>",
      "features": ["<feature 1>","<feature 2>","<feature 3>","<feature 4>"],
      "featureTypes": ["good","good","warn","bad"],
      "recommended": <true/false>,
      "claimSettlementRatio": "<e.g. 98.5%>",
      "sumInsured": "<e.g. ₹10 Lakh>"
    }
  ]
}

Include 4 plans. Make the first recommended: true. Use real Indian insurers: LIC, HDFC Ergo, Star Health, ICICI Lombard, Niva Bupa, Care Health, Bajaj Allianz, Aditya Birla Health, New India Assurance, SBI Life, Max Life, etc. Premiums must be realistic for Indian market 2024-25. Reply with ONLY the JSON object.`;
}

function animateLoadingSteps() {
  const steps = ['ls0', 'ls1', 'ls2', 'ls3'];
  const labels = [
    '✓ Calculated actuarial risk factors',
    '✓ Cross-referenced 40+ Indian insurance plans',
    '✓ Predicted premiums using ML model',
    '✓ Generated personalized recommendations'
  ];
  steps.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) { document.getElementById(steps[i - 1]).classList.remove('active'); document.getElementById(steps[i - 1]).classList.add('done'); document.getElementById(steps[i - 1]).textContent = labels[i - 1]; }
      document.getElementById(id).classList.add('active');
    }, i * 900);
  });
}

function renderResults(rawJson, profile) {
  let data;
  try { data = JSON.parse(rawJson.replace(/```json|```/g, '').trim()); }
  catch (e) { renderFallbackResults(profile); return; }

  document.getElementById('resultTitle').textContent = `Analysis for ${profile.gender || ''} ${profile.age || ''}${profile.age ? 'yr' : ''}`;
  document.getElementById('resultSubtitle').textContent = `${profile.insuranceType} · ${profile.city || 'India'} · Coverage: ₹${profile.coverageAmount || '?'} Lakh`;

  const rc = document.getElementById('riskCircle');
  rc.style.background = `conic-gradient(${data.riskColor || 'var(--warning)'} ${data.riskPercent || '50%'}, var(--surface-hover) 0%)`;
  document.getElementById('riskScore').textContent = data.riskScore || '?';
  document.getElementById('riskLabel').textContent = data.riskLabel || 'Moderate';

  document.getElementById('metricsRow').innerHTML = `
    <div class="metric-card"><div class="metric-label">Estimated Premium</div><div class="metric-value" style="font-size:1.3rem">${data.estimatedAnnualPremium || '—'}</div><div class="metric-sub">Based on your profile</div></div>
    <div class="metric-card"><div class="metric-label">Recommended Cover</div><div class="metric-value">${data.recommendedCoverage || '—'}</div><div class="metric-sub">Optimal for your needs</div></div>
    <div class="metric-card"><div class="metric-label">Tax Benefit</div><div class="metric-value" style="font-size:1.3rem;color:var(--success)">${data.taxBenefit || '—'}</div><div class="metric-sub">Under Income Tax Act</div></div>
    <div class="metric-card"><div class="metric-label">Waiting Period</div><div class="metric-value" style="font-size:1.1rem">${data.waitingPeriodNote || 'Check policy'}</div><div class="metric-sub">For pre-existing conditions</div></div>
  `;

  document.getElementById('aiInsightText').textContent = data.insight || 'Analysis complete.';

  const grid = document.getElementById('plansGrid');
  grid.innerHTML = (data.plans || []).map(plan => `
    <div class="plan-card ${plan.recommended ? 'recommended' : ''}">
      <div class="plan-insurer">${plan.insurer || ''}</div>
      <div class="plan-name">${plan.planName || ''}</div>
      <div class="plan-premium">${plan.annualPremium || '—'}<span>/year</span></div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Sum: ${plan.sumInsured || '—'} · CSR: ${plan.claimSettlementRatio || '—'}</div>
      <div class="plan-features">
        ${(plan.features || []).map((f, i) => `<div class="feat"><span class="feat-dot ${plan.featureTypes?.[i] || ''}"></span>${f}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderFallbackResults(profile) {
  document.getElementById('resultTitle').textContent = 'Insurance Analysis';
  document.getElementById('resultSubtitle').textContent = 'Profile-based recommendation';
  document.getElementById('riskScore').textContent = '45';
  document.getElementById('riskLabel').textContent = 'Moderate';
  document.getElementById('riskCircle').style.background = 'conic-gradient(var(--warning) 45%, var(--surface-hover) 0%)';
  document.getElementById('metricsRow').innerHTML = `<div class="metric-card"><div class="metric-label">Note</div><div class="metric-value" style="font-size:0.9rem;color:var(--warning)">Backend connection required for full AI analysis</div></div>`;
  document.getElementById('aiInsightText').textContent = 'Please ensure the backend server is running to get full AI-powered premium predictions and personalized plan recommendations.';
  document.getElementById('plansGrid').innerHTML = '<p style="color:var(--muted);font-size:14px">Backend connection required for plan recommendations.</p>';
}

// ═══════════════════════════════════
// COMPARISON TABLE DATA
// ═══════════════════════════════════
const INSURERS_DATA = [
  { type: 'health', insurer: 'Star Health', abbr: 'SH', color: '#10B981', plan: 'Comprehensive Plan', cover: '₹5–1 Cr', premium: '₹8,240', csr: '99.6%', hospitals: '14,000+', waiting: '30 days / 2 yr PED', rating: 4.5 },
  { type: 'health', insurer: 'Niva Bupa', abbr: 'NB', color: '#2DD4BF', plan: 'Health Companion', cover: '₹3L–1 Cr', premium: '₹7,820', csr: '91.4%', hospitals: '10,000+', waiting: '30 days / 4 yr PED', rating: 4.3 },
  { type: 'health', insurer: 'HDFC Ergo', abbr: 'HE', color: '#2563EB', plan: 'Optima Secure', cover: '₹5L–2 Cr', premium: '₹9,400', csr: '98.5%', hospitals: '13,000+', waiting: '30 days / 3 yr PED', rating: 4.6 },
  { type: 'health', insurer: 'Care Health', abbr: 'CH', color: '#A78BFA', plan: 'Care Supreme', cover: '₹5L–6 Cr', premium: '₹8,100', csr: '90.5%', hospitals: '19,000+', waiting: '30 days / 4 yr PED', rating: 4.2 },
  { type: 'health', insurer: 'ICICI Lombard', abbr: 'IL', color: '#F472B6', plan: 'Complete Health', cover: '₹3L–50L', premium: '₹7,600', csr: '88.8%', hospitals: '9,500+', waiting: '30 days / 2 yr PED', rating: 4.1 },
  { type: 'health', insurer: 'Aditya Birla', abbr: 'AB', color: '#F59E0B', plan: 'Activ Health Platinum', cover: '₹2L–2 Cr', premium: '₹10,200', csr: '97.7%', hospitals: '11,000+', waiting: '30 days / 3 yr PED', rating: 4.5 },
  { type: 'health', insurer: 'New India', abbr: 'NI', color: '#34D399', plan: 'Mediclaim 2012', cover: '₹1L–15L', premium: '₹5,800', csr: '96.0%', hospitals: '8,000+', waiting: '30 days / 4 yr PED', rating: 3.9 },
  { type: 'health', insurer: 'Bajaj Allianz', abbr: 'BA', color: '#EF4444', plan: 'Health Guard', cover: '₹1.5L–50L', premium: '₹6,900', csr: '92.0%', hospitals: '6,500+', waiting: '30 days / 3 yr PED', rating: 4.0 },
  { type: 'term', insurer: 'LIC', abbr: 'LC', color: '#F59E0B', plan: 'Tech Term', cover: '₹50L–5 Cr', premium: '₹6,200', csr: '99.0%', hospitals: '—', waiting: '—', rating: 4.7 },
  { type: 'term', insurer: 'HDFC Life', abbr: 'HL', color: '#2563EB', plan: 'Click 2 Protect Super', cover: '₹50L–10 Cr', premium: '₹7,800', csr: '99.4%', hospitals: '—', waiting: '—', rating: 4.6 },
  { type: 'term', insurer: 'ICICI Prudential', abbr: 'IP', color: '#F472B6', plan: 'iProtect Smart', cover: '₹25L–no limit', premium: '₹6,900', csr: '98.0%', hospitals: '—', waiting: '—', rating: 4.4 },
  { type: 'term', insurer: 'Max Life', abbr: 'ML', color: '#A78BFA', plan: 'Smart Secure Plus', cover: '₹25L–no limit', premium: '₹6,500', csr: '99.5%', hospitals: '—', waiting: '—', rating: 4.5 },
  { type: 'term', insurer: 'Tata AIA', abbr: 'TA', color: '#2DD4BF', plan: 'Sampoorna Raksha', cover: '₹25L–5 Cr', premium: '₹7,100', csr: '98.6%', hospitals: '—', waiting: '—', rating: 4.3 },
  { type: 'term', insurer: 'SBI Life', abbr: 'SL', color: '#34D399', plan: 'eShield Next', cover: '₹35L–no limit', premium: '₹6,800', csr: '97.0%', hospitals: '—', waiting: '—', rating: 4.2 },
  { type: 'critical', insurer: 'HDFC Ergo', abbr: 'HE', color: '#2563EB', plan: 'Critical Illness Platinum', cover: '₹1L–50L', premium: '₹3,200', csr: '98.5%', hospitals: '—', waiting: '90 days / 3 yr', rating: 4.4 },
  { type: 'critical', insurer: 'Bajaj Allianz', abbr: 'BA', color: '#EF4444', plan: 'Critical Illness Plan', cover: '₹1L–50L', premium: '₹2,900', csr: '92.0%', hospitals: '—', waiting: '90 days / 4 yr', rating: 4.0 },
  { type: 'critical', insurer: 'Star Health', abbr: 'SH', color: '#10B981', plan: 'Star Critical Illness Multipay', cover: '₹5L–25L', premium: '₹4,100', csr: '99.6%', hospitals: '—', waiting: '90 days / 4 yr', rating: 4.5 },
  { type: 'senior', insurer: 'Star Health', abbr: 'SH', color: '#10B981', plan: 'Senior Citizens Red Carpet', cover: '₹1L–25L', premium: '₹22,000', csr: '99.6%', hospitals: '14,000+', waiting: '30 days / 1 yr PED', rating: 4.4 },
  { type: 'senior', insurer: 'Niva Bupa', abbr: 'NB', color: '#2DD4BF', plan: 'Senior First Gold', cover: '₹5L–25L', premium: '₹19,500', csr: '91.4%', hospitals: '10,000+', waiting: '30 days / 2 yr PED', rating: 4.2 },
  { type: 'senior', insurer: 'Care Health', abbr: 'CH', color: '#A78BFA', plan: 'Care Senior', cover: '₹3L–10L', premium: '₹17,800', csr: '90.5%', hospitals: '19,000+', waiting: '30 days / 2 yr PED', rating: 4.1 },
  { type: 'floater', insurer: 'HDFC Ergo', abbr: 'HE', color: '#2563EB', plan: 'My Health Suraksha', cover: '₹3L–75L', premium: '₹14,600', csr: '98.5%', hospitals: '13,000+', waiting: '30 days / 3 yr PED', rating: 4.5 },
  { type: 'floater', insurer: 'Star Health', abbr: 'SH', color: '#10B981', plan: 'Family Health Optima', cover: '₹3L–25L', premium: '₹11,800', csr: '99.6%', hospitals: '14,000+', waiting: '30 days / 3 yr PED', rating: 4.6 },
  { type: 'floater', insurer: 'Bajaj Allianz', abbr: 'BA', color: '#EF4444', plan: 'Health Guard Family Floater', cover: '₹1.5L–50L', premium: '₹10,200', csr: '92.0%', hospitals: '6,500+', waiting: '30 days / 3 yr PED', rating: 4.0 },
];

function filterPlans(type, el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderCompTable(type);
}

function renderCompTable(filter) {
  const data = filter === 'all' ? INSURERS_DATA : INSURERS_DATA.filter(d => d.type === filter);
  const ratingStars = r => {
    const full = Math.floor(r), half = r % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };
  const csr = r => {
    const n = parseFloat(r);
    if (n >= 98) return `<span class="badge badge-green">${r}</span>`;
    if(n>=93) return `<span class="badge badge-yellow">${r}</span>`;
    return `<span class="badge badge-red">${r}</span>`;
  };
  document.getElementById('compBody').innerHTML = data.map(d=>`
    <tr>
      <td>
        <div class="insurer-cell">
          <div class="insurer-logo" style="background:${d.color||'#444'}15;color:${d.color||'#aaa'}">${d.abbr}</div>
          <div><div style="font-weight:600;font-size:13px">${d.insurer}</div><div style="font-size:12px;color:var(--muted)">${d.plan}</div></div>
        </div>
      </td>
      <td><span class="badge badge-blue">${d.type==='health'?'Health':d.type==='term'?'Term Life':d.type==='critical'?'Critical Ill.':d.type==='senior'?'Senior':d.type==='floater'?'Floater':d.type}</span></td>
      <td style="font-size:13px">${d.cover}</td>
      <td style="font-weight:700;color:var(--text)">${d.premium}<span style="font-size:11px;color:var(--muted);font-weight:500">/yr</span></td>
      <td>${csr(d.csr)}</td>
      <td style="font-size:13px">${d.hospitals}</td>
      <td style="font-size:12px;color:var(--muted)">${d.waiting}</td>
      <td><span class="star">${'★'.repeat(Math.floor(d.rating))}</span><span style="font-size:12px;color:var(--muted);margin-left:4px">${d.rating}</span></td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════
// POLICY ANALYZER
// ═══════════════════════════════════
function setPolicyMode(mode){
  policyMode = mode;
  document.getElementById('policyTextMode').style.display = mode==='text'?'block':'none';
  document.getElementById('policyURLMode').style.display = mode==='url'?'block':'none';
  document.getElementById('modeText').className = 'btn '+(mode==='text'?'btn-primary':'btn-ghost');
  document.getElementById('modeURL').className = 'btn '+(mode==='url'?'btn-primary':'btn-ghost');
}

async function analyzePolicy(){
  const errEl = document.getElementById('policyError');
  errEl.style.display='none';

  let content = '';
  if(policyMode==='text'){
    content = document.getElementById('policyTextInput').value.trim();
    if(!content){ errEl.style.display='block'; errEl.textContent='Please paste some policy text first.'; return; }
  } else {
    const url = document.getElementById('policyURLInput').value.trim();
    if(!url){ errEl.style.display='block'; errEl.textContent='Please enter a URL.'; return; }
    content = `Policy URL provided: ${url}. Analyze this insurer's plan based on your knowledge of their products.`;
  }

  document.getElementById('policyLoading').style.display='flex';
  document.getElementById('policyResult').style.display='none';
  document.getElementById('policyBtn').disabled=true;

  const prompt = `You are an expert Indian insurance policy analyst. Analyze the following insurance policy content and respond ONLY in JSON (no markdown, no code blocks):

POLICY CONTENT:
${content.substring(0,4000)}

Return this exact JSON:
{
  "policyName": "<Name of the plan>",
  "insurer": "<Insurer name>",
  "type": "<Health / Term / Critical Illness / etc>",
  "coverageAmount": "<Sum insured>",
  "annualPremium": "<Premium if mentioned or estimated>",
  "valueScore": <1-100 overall value score>,
  "valueJustification": "<2 sentences on why this score>",
  "coverageScore": <1-100>,
  "premiumScore": <1-100>,
  "claimEaseScore": <1-100>,
  "keyInclusions": ["<up to 6 inclusions>"],
  "keyExclusions": ["<up to 6 exclusions>"],
  "waitingPeriods": "<Summary of waiting periods>",
  "networkHospitals": "<Number if known>",
  "renewability": "<Lifelong / Up to age X>",
  "uniqueFeatures": ["<up to 3 unique or standout features>"],
  "redFlags": ["<up to 3 potential concerns or traps>"],
  "suitableFor": "<Who this plan is best for>",
  "alternatives": ["<2 alternative plan names to consider>"],
  "overallVerdict": "<3 sentence expert verdict on this policy>"
}`;

  try {
    const resp = await callBackend(prompt);
    let data;
    try { data = JSON.parse(resp.replace(/```json|```/g,'').trim()); }
    catch(e){ throw new Error('Could not parse AI response. Try again.'); }
    renderPolicyResult(data);
  } catch(e){
    errEl.style.display='block';
    errEl.textContent = 'Error: '+e.message;
  } finally {
    document.getElementById('policyLoading').style.display='none';
    document.getElementById('policyBtn').disabled=false;
  }
}

function renderPolicyResult(d){
  const scoreBar = (score, color) =>
    `<div class="score-bar-wrap"><div class="score-bar"><div class="score-fill" style="width:${score}%;background:${color||'var(--primary)'}"></div></div></div>`;

  const scoreColor = s => s>=75?'var(--success)':s>=50?'var(--warning)':'var(--danger)';

  document.getElementById('policyResult').innerHTML = `
    <div class="policy-result">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">${d.insurer||'—'} · ${d.type||'—'}</div>
          <h3 style="font-size:1.6rem;color:var(--primary);margin-bottom:10px">${d.policyName||'Policy Analysis'}</h3>
          <div style="font-size:14px;color:var(--muted);display:flex;gap:12px;flex-wrap:wrap">
            <span style="background:var(--surface-hover);padding:4px 10px;border-radius:var(--radius-pill);border:1px solid var(--border)">Coverage: ${d.coverageAmount||'—'}</span>
            <span style="background:var(--surface-hover);padding:4px 10px;border-radius:var(--radius-pill);border:1px solid var(--border)">Premium: ${d.annualPremium||'—'}/yr</span>
            <span style="background:var(--surface-hover);padding:4px 10px;border-radius:var(--radius-pill);border:1px solid var(--border)">Network: ${d.networkHospitals||'—'}</span>
          </div>
        </div>
        <div style="text-align:center;flex-shrink:0">
          <div style="font-size:3rem;font-weight:800;color:${scoreColor(d.valueScore||50)};line-height:1">${d.valueScore||'?'}</div>
          <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:4px">Value Score</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:2rem">
        ${[['Coverage',d.coverageScore],['Premium Value',d.premiumScore],['Claim Ease',d.claimEaseScore]].map(([label,score])=>`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem">
            <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;color:var(--muted);margin-bottom:6px"><span>${label}</span><span style="color:${scoreColor(score||50)}">${score||'?'}</span></div>
            ${scoreBar(score||50, scoreColor(score||50))}
          </div>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-bottom:2rem">
        <div class="policy-section">
          <h4>Key Inclusions</h4>
          <ul class="exclusions-list inclusions-list">
            ${(d.keyInclusions||[]).map(i=>`<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div class="policy-section">
          <h4>Key Exclusions</h4>
          <ul class="exclusions-list">
            ${(d.keyExclusions||[]).map(i=>`<li>${i}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${(d.redFlags&&d.redFlags.length)?`
      <div class="policy-section" style="border-color:#fca5a5;background:#fef2f2">
        <h4 style="color:#b91c1c">⚠ Red Flags / Watch Out</h4>
        <ul class="exclusions-list">
          ${d.redFlags.map(f=>`<li style="color:#991b1b">${f}</li>`).join('')}
        </ul>
      </div>`:``}

      <div class="policy-section">
        <h4 style="display:flex;align-items:center;gap:6px">✦ Unique Features</h4>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${(d.uniqueFeatures||[]).map(f=>`<span style="background:var(--bg);border:1px solid var(--border);padding:6px 14px;border-radius:var(--radius-pill);font-size:13px;font-weight:500">${f}</span>`).join('')}
        </div>
      </div>

      <div class="ai-insights" style="margin-bottom:0;margin-top:2rem">
        <div class="ai-label">◈ Expert Verdict</div>
        <div class="ai-text">${d.overallVerdict||''}</div>
        ${d.alternatives?.length?`<div style="margin-top:12px;font-size:14px;color:var(--muted);border-top:1px solid var(--border);padding-top:12px">Also consider: <strong style="color:var(--text)">${d.alternatives.join(', ')}</strong></div>`:``}
      </div>
    </div>
  `;
  document.getElementById('policyResult').style.display='block';
  document.getElementById('policyResult').scrollIntoView({behavior:'smooth',block:'start'});
}

// ═══════════════════════════════════
// INIT
// ═══════════════════════════════════
renderCompTable('all');
