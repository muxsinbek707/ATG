// ---- data ----
const tests = [
  {ic:'📘', bg:'var(--blue-soft)', c:'var(--blue)', title:'Ingliz tili - Grammar', meta:'20 savol • 12 May 2024', score:85},
  {ic:'⚛️', bg:'var(--orange-soft)', c:'var(--orange)', title:'Fizika - Mexanika', meta:'15 savol • 10 May 2024', score:78},
  {ic:'🧬', bg:'var(--green-soft)', c:'var(--green)', title:'Biologiya - Hujayra', meta:'25 savol • 8 May 2024', score:92},
  {ic:'📐', bg:'var(--purple-soft)', c:'var(--purple)', title:'Matematika - Algebra', meta:'20 savol • 6 May 2024', score:70},
];
const testsListHTML = tests.map(t=>`
  <div class="test-row">
    <div class="test-ic" style="background:${t.bg};color:${t.c};">${t.ic}</div>
    <div class="test-info">
      <div class="t">${t.title}</div>
      <div class="s">${t.meta}</div>
    </div>
    <div class="score-pill">${t.score}%</div>
    <div class="dots">⋮</div>
  </div>
`).join('');
document.getElementById('testsList').innerHTML = testsListHTML;
const testsListFullEl = document.getElementById('testsListFull');
if (testsListFullEl) testsListFullEl.innerHTML = testsListHTML;

const subjects = [
  {name:'Ingliz tili', count:8, score:87},
  {name:'Matematika', count:6, score:82},
  {name:'Fizika', count:5, score:78},
  {name:'Biologiya', count:4, score:92},
];
document.getElementById('subjBody').innerHTML = subjects.map(s=>`
  <tr>
    <td>${s.name}</td>
    <td>${s.count}</td>
    <td style="text-align:right;">
      <span style="color:var(--green);font-weight:700;">${s.score}%</span>
      <span class="barwrap"><span class="barfill" style="width:${s.score}%;"></span></span>
    </td>
  </tr>
`).join('');

// ---- mobile hamburger menu ----
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar(){
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar(){
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ---- view routing ----
function showView(name){
  document.querySelectorAll('.view').forEach(v=>{
    v.hidden = (v.id !== 'view-' + name);
  });
  document.querySelectorAll('.nav-item').forEach(i=>{
    i.classList.toggle('active', i.dataset.view === name);
  });
  if (name === 'statistika') initCharts();
  window.scrollTo({top:0, behavior:'smooth'});
}

document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    showView(item.dataset.view);
    closeSidebar();
  });
});

// shortcuts from dashboard cards / links that jump straight into a view
document.querySelectorAll('[data-goto]').forEach(el=>{
  el.addEventListener('click', ()=> showView(el.dataset.goto));
});

showView('dashboard');

// ---- source tabs ----
document.querySelectorAll('.src-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.src-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ---- difficulty segment ----
document.querySelectorAll('#diffSeg button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#diffSeg button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---- question count stepper ----
let qCount = 20;
const qCountEl = document.getElementById('qCount');
document.getElementById('plusBtn').addEventListener('click', ()=>{
  qCount = Math.min(100, qCount+1);
  qCountEl.textContent = qCount;
});
document.getElementById('minusBtn').addEventListener('click', ()=>{
  qCount = Math.max(1, qCount-1);
  qCountEl.textContent = qCount;
});

// ---- textarea char count ----
const txt = document.getElementById('txtInput');
const cc = document.getElementById('cc');
txt.addEventListener('input', ()=>{ cc.textContent = txt.value.length; });

// ---- submit ----
document.getElementById('submitBtn').addEventListener('click', ()=>{
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'AI test yaratmoqda...';
  btn.disabled = true;
  setTimeout(()=>{
    btn.textContent = 'Test tayyor! ✅';
    setTimeout(()=>{ btn.textContent = "AI ga topshirish ✨"; btn.disabled=false; }, 1800);
  }, 1600);
});

// ---- charts (created lazily, first time the Statistika view is opened —
// Chart.js can't measure a canvas that's inside a display:none section) ----
let chartsReady = false;
function initCharts(){
  if (chartsReady) return;
  chartsReady = true;

  const actCtx = document.getElementById('activityChart');
  new Chart(actCtx, {
    type:'line',
    data:{
      labels:['15 Apr','22 Apr','29 Apr','6 May','13 May'],
      datasets:[{
        data:[35,55,42,48,38,70,60,95],
        borderColor:'#5b5bf0',
        backgroundColor:'rgba(91,91,240,0.08)',
        fill:true,
        tension:.4,
        pointRadius:0,
        borderWidth:2.5,
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{
        y:{ min:0, max:100, ticks:{callback:v=>v+'%', color:'#9ca0b4', font:{size:10}}, grid:{color:'#eef0f5'} },
        x:{ ticks:{color:'#9ca0b4', font:{size:10}}, grid:{display:false} }
      }
    }
  });

  const donutCtx = document.getElementById('donutChart');
  new Chart(donutCtx, {
    type:'doughnut',
    data:{
      labels:['Test (variantli)','To\'g\'ri/Noto\'g\'ri','Qisqa javob','Moslashtirish'],
      datasets:[{
        data:[70,15,10,5],
        backgroundColor:['#5b5bf0','#3b82f6','#a855f7','#22c55e'],
        borderWidth:0,
      }]
    },
    options:{
      cutout:'70%',
      plugins:{legend:{display:false}}
    }
  });
}
