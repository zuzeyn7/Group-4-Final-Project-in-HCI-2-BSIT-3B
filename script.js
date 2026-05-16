// ═══════════════════════════════════════
//  HCI2 Web Reporting Site — script.js
// ═══════════════════════════════════════

/* ── Navbar: scroll effect + active link ── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

function onScroll() {
  // shrink/shadow navbar
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // scroll-to-top button
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 300);

  // active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// close menu on link click
navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navList.classList.remove('open'));
});

/* ── Scroll to top ── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Reveal on scroll (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Gallery lightbox (simple) ── */
document.querySelectorAll('.gal-item:not(.ph)').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,.88);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;
    `;
    const image = document.createElement('img');
    image.src = img.src;
    image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 0 60px rgba(0,0,0,.8);';
    overlay.appendChild(image);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});


/* ── DATA (from revised Excel, n=22, cols 5-14 for Q1-Q10) ── */
const Q_LABELS = ["Use frequently","Unnecessarily complex","Easy to use","Need tech support","Well integrated","Too inconsistent","Learn quickly","Cumbersome","Felt confident","Must learn a lot"];
const Q_AVGS   = [4.1818, 2.4545, 4.0455, 2.8182, 4.0455, 2.7727, 4.3636, 2.5909, 4.3636, 3.0000];
const Q_IS_POS = [true,false,true,false,true,false,true,false,true,false];
const Q_PCTS   = [83.64, 49.09, 80.91, 56.36, 80.91, 55.45, 87.27, 51.82, 87.27, 60.00];

const LIKES = [
  "Helps people book appointments without hassle, even in emergencies.",
  "Very convenient to use — just book an appointment and done.",
  "Convenient for citizens seeking healthcare and professional help more efficiently and easily.",
  "Easy to use — not confused when navigating; booking a doctor is fast and convenient.",
  "Organized and easy to use; enables faster communication between patients and healthcare providers.",
  "Keeps records in one place — easy to track medical history and monitor health progress.",
  "Easy access for patients.",
  "Patient data is easy to access.",
  "User-friendly and systematized — simplifies health information management.",
  "Convenient to use for submitting medical documents with just a few clicks.",
  "Makes accessing medical records faster and reduces waiting time.",
  "Saves time — no need to visit the facility personally for appointments.",
  "You can view your results and know what kind of improvement you need.",
  "Helps us be more conscious about our health.",
  "Convenient to use, easy to navigate, and has a beautiful user interface design.",
  "Convenient to use.",
  "Easy to find medical professionals.",
  "Convenient to use and easy to navigate with a beautiful interface design."
];

const IMPROVEMENTS = [
  "Add a chatbox so patients can message the doctor or staff after booking to ask questions.",
  "Add online payment functionality to the website.",
  "Make the system more user-friendly for non-tech-savvy users by adding clearer instructions or tutorials.",
  "Improve speed, reduce technical errors or downtime; add appointment reminders and mobile app accessibility.",
  "Improve loading speed — especially on slow internet.",
  "Optimize mobile interface further to make navigation easier and allow real-time updates.",
  "Ensure the system loads quickly even on slow internet; add appointment reminder features.",
  "Make the system compatible and accessible on mobile devices.",
  "Make the system compatible and accessible on mobile devices (duplicate from second respondent)."
];

/* ── TABS ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
}

/* ── QUOTES ── */
function filterQuotes(type, btn) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const list = document.getElementById('quote-list');
  list.innerHTML = '';
  const items =
    type === 'like'    ? LIKES.map(v=>({t:'like',v})) :
    type === 'improve' ? IMPROVEMENTS.map(v=>({t:'improve',v})) :
    [...LIKES.map(v=>({t:'like',v})), ...IMPROVEMENTS.map(v=>({t:'improve',v}))];
  items.forEach(item => {
    const d = document.createElement('div');
    d.className = 'quote-item' + (item.t === 'improve' ? ' improve' : '');
    const clr  = item.t === 'like' ? '#5DCAA5' : '#D85A30';
    const lbl  = item.t === 'like' ? 'Liked' : 'Suggestion';
    d.innerHTML = `<div class="quote-tag" style="color:${clr};">${lbl}</div>${item.v}`;
    list.appendChild(d);
  });
}
filterQuotes('all', document.querySelector('.chip'));

/* ── Q LIST ── */
const qList = document.getElementById('q-list');
Q_LABELS.forEach((label, i) => {
  const pct   = (Q_AVGS[i] / 5) * 100;
  const color = Q_IS_POS[i] ? '#1D9E75' : '#D85A30';
  const row   = document.createElement('div');
  row.className = 'q-row';
  row.innerHTML = `
    <div class="q-dot" style="background:${color};"></div>
    <div class="q-label">Q${i+1}. ${label}</div>
    <div class="q-bar-wrap"><div class="q-bar" style="width:${pct.toFixed(1)}%;background:${color};"></div></div>
    <div class="q-val">${Q_AVGS[i].toFixed(2)}</div>
    <div class="q-pct">${Q_PCTS[i].toFixed(2)}%</div>
  `;
  qList.appendChild(row);
});

/* ── SUS FILL ── */
setTimeout(() => {
  const el = document.getElementById('sus-fill');
  if (el) el.style.width = '68.41%';
}, 300);

/* ── CHART DEFAULTS ── */
const gC = 'rgba(255,255,255,0.06)';
Chart.defaults.color = '#6b7280';
Chart.defaults.font.family = "'DM Sans', sans-serif";

/* Distribution */
new Chart(document.getElementById('distChart'), {
  type: 'bar',
  data: {
    labels: ['< 50','50–62','62–75','75–87','88–100'],
    datasets: [{ data:[2,9,1,4,6], backgroundColor:['#F09595','#FAC775','#9FE1CB','#1D9E75','#0F6E56'], borderRadius:4, borderSkipped:false }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false} },
    scales:{
      x:{ ticks:{font:{size:10}}, grid:{color:gC} },
      y:{ ticks:{stepSize:1,font:{size:10}}, grid:{color:gC}, beginAtZero:true }
    }
  }
});

/* Pos vs Neg */
new Chart(document.getElementById('posNegChart'), {
  type: 'bar',
  data: {
    labels: ['Positive items avg','Negative items avg'],
    datasets: [{ data:[4.20,2.73], backgroundColor:['#1D9E75','#D85A30'], borderRadius:4, borderSkipped:false, barThickness:50 }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.parsed.y.toFixed(2)} / 5`}} },
    scales:{
      x:{ ticks:{font:{size:11}}, grid:{color:gC} },
      y:{ min:0, max:5, ticks:{font:{size:10}}, grid:{color:gC} }
    }
  }
});

/* Radar */
new Chart(document.getElementById('radarChart'), {
  type: 'radar',
  data: {
    labels: Q_LABELS.map(l => l.length > 16 ? l.slice(0,16)+'…' : l),
    datasets: [{
      label: 'Avg score', data: Q_AVGS,
      backgroundColor:'rgba(29,158,117,0.12)', borderColor:'#1D9E75',
      pointBackgroundColor:'#1D9E75', pointRadius:4, borderWidth:2
    }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false} },
    scales:{ r:{ min:0, max:5, ticks:{stepSize:1,font:{size:9},backdropColor:'transparent'}, grid:{color:gC}, pointLabels:{font:{size:10}}, angleLines:{color:gC} } }
  }
});

/* Q horizontal bar */
new Chart(document.getElementById('qBarChart'), {
  type: 'bar',
  data: {
    labels: Q_LABELS.map((l,i) => `Q${i+1}. ${l}`),
    datasets: [{ label:'Avg', data:Q_AVGS, backgroundColor:Q_IS_POS.map(p=>p?'#1D9E75':'#D85A30'), borderRadius:3, borderSkipped:false }]
  },
  options: {
    indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.parsed.x.toFixed(2)} / 5  (${Q_PCTS[ctx.dataIndex].toFixed(2)}%)`}} },
    scales:{
      x:{ min:0, max:5, ticks:{font:{size:10}}, grid:{color:gC} },
      y:{ ticks:{font:{size:10}}, grid:{color:gC} }
    }
  }
});

/* Gender donut */
new Chart(document.getElementById('genderChart'), {
  type: 'doughnut',
  data: { labels:['Female','Male'], datasets:[{ data:[18,4], backgroundColor:['#1D9E75','#378ADD'], borderWidth:0 }] },
  options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, cutout:'65%' }
});

/* Experience donut */
new Chart(document.getElementById('expChart'), {
  type: 'doughnut',
  data: { labels:['Yes','No'], datasets:[{ data:[16,6], backgroundColor:['#1D9E75','#555c6e'], borderWidth:0 }] },
  options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, cutout:'65%' }
});

/* Frequency */
new Chart(document.getElementById('freqChart'), {
  type: 'bar',
  data: {
    labels: ['Daily','Weekly','Never'],
    datasets: [{ data:[13,4,5], backgroundColor:['#1D9E75','#5DCAA5','#9FE1CB'], borderRadius:4, borderSkipped:false }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false} },
    scales:{ x:{ticks:{font:{size:11}},grid:{color:gC}}, y:{ticks:{stepSize:1,font:{size:10}},grid:{color:gC},beginAtZero:true} }
  }
});

/* Age */
new Chart(document.getElementById('ageChart'), {
  type: 'bar',
  data: {
    labels: ['18','19','20','21','22','24','25','30'],
    datasets: [{ data:[5,9,3,1,1,1,1,1], backgroundColor:'#378ADD', borderRadius:4, borderSkipped:false }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false} },
    scales:{ x:{ticks:{font:{size:11}},grid:{color:gC}}, y:{ticks:{stepSize:1,font:{size:10}},grid:{color:gC},beginAtZero:true} }
  }
});

/* SUS by gender */
new Chart(document.getElementById('genderSusChart'), {
  type: 'bar',
  data: {
    labels: ['Female (n=18)','Male (n=4)'],
    datasets: [{ data:[72.22,51.25], backgroundColor:['#1D9E75','#378ADD'], borderRadius:4, borderSkipped:false, barThickness:55 }]
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>` SUS: ${ctx.parsed.y.toFixed(2)}`}} },
    scales:{ x:{ticks:{font:{size:12}},grid:{color:gC}}, y:{min:0,max:100,ticks:{font:{size:10}},grid:{color:gC}} }
  }
});
