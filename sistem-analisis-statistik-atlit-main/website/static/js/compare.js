/* ===== NAVBAR: hamburger toggle ===== */
(function(){
const btn = document.querySelector('.hamburger');
const menu = document.getElementById('main-menu');
if(!btn || !menu) return;
btn.addEventListener('click', () => {
const open = menu.classList.toggle('active');
btn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
})();

/* ===== Concentric radar bands (sunset→green) ===== */
const radarBands = {
id: "radarBands",
beforeDatasetsDraw(chart) {
const r = chart.scales?.r; if (!r) return;
const ctx = chart.ctx;
const steps = 5;
const colors = [
    "rgba(239,68,68,0.25)",
    "rgba(245,158,11,0.25)",
    "rgba(234,179,8,0.25)",
    "rgba(132,204,22,0.25)",
    "rgba(34,197,94,0.25)"
];
const n = chart.data.labels?.length ?? 0;
const min = r.min ?? 0, max = r.max ?? 100;
const stepVal = (max - min) / steps;

for (let s = steps; s >= 1; s--) {
    const v = min + stepVal * s;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
    const pt = r.getPointPositionForValue(i, v);
    i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.fillStyle = colors[s - 1];
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
}
}
};

/* ===== Soft glow ===== */
const radarGlow = {
id: "radarGlow",
beforeDatasetDraw(chart, args, opts) {
const ctx = chart.ctx;
ctx.save();
ctx.shadowColor = opts?.color ?? "rgba(34,197,94,0.9)";
ctx.shadowBlur  = opts?.blur  ?? 18;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
},
afterDatasetDraw(chart){ chart.ctx.restore(); }
};

/* helpers */
function n(v){ const x = Number(v); return Number.isFinite(x) ? x : 0; }
function avg(nums){
const arr = nums.map(n).filter(x=>Number.isFinite(x));
return arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
}
function physicalAggregate(p){
if (p && Number.isFinite(Number(p.Physical))) return n(p.Physical);
return avg([
p?.Acceleration, p?.Agility, p?.Balance, p?.JumpingReach, p?.NaturalFitness,
p?.Pace, p?.Stamina, p?.Strength
]);
}

/* ===== Radar chart center ===== */
(function makeRadar(){
const c = document.getElementById('compareRadar');
if (!c || typeof Chart === 'undefined') return;

const p1 = window.PLAYER1 || null;
const p2 = window.PLAYER2 || null;
if (!p1 && !p2) return;

const labels = ['Speed','Vision','Attacking','Technical','Aerial','Defending','Mental','Physical'];
const ds = [];
if (p1) ds.push({
label: p1.Name,
data: [n(p1.Speed),n(p1.Vision),n(p1.Attacking),n(p1.Technical),n(p1.Aerial),n(p1.Defending),n(p1.Mental),physicalAggregate(p1)],
backgroundColor: 'rgba(34,197,94,0.22)',
borderColor: '#22c55e',
borderWidth: 2,
pointBackgroundColor: '#22c55e',
pointBorderColor: 'transparent',
pointRadius: 3
});
if (p2) ds.push({
label: p2.Name,
data: [n(p2.Speed),n(p2.Vision),n(p2.Attacking),n(p2.Technical),n(p2.Aerial),n(p2.Defending),n(p2.Mental),physicalAggregate(p2)],
backgroundColor: 'rgba(96,165,250,0.22)',
borderColor: '#60a5fa',
borderWidth: 2,
pointBackgroundColor: '#60a5fa',
pointBorderColor: 'transparent',
pointRadius: 3
});

new Chart(c.getContext('2d'),{
type:'radar',
plugins:[radarBands, radarGlow],
data:{ labels, datasets: ds },
options:{
    responsive:true, maintainAspectRatio:false,
    plugins:{
    legend:{ labels:{ color:'#ffffff', font:{ size:13, weight:'bold' } } },
    tooltip:{ enabled:true },
    radarGlow:{ color:'#22c55e', blur:20 }
    },
    scales:{ r:{
    min:0, max:100,
    ticks:{ display:false, backdropColor:'transparent' },
    grid:{ color:'rgba(148,163,184,0.10)' },
    angleLines:{ color:'rgba(148,163,184,0.10)' },
    pointLabels:{ color:'#e5e7eb', font:{ size:13, weight:'600' }, padding:6 }
    }}
}
});
})();

/* ===== Compare submit ===== */
(function setupCompareForm(){
const p1 = document.getElementById('player1');
const p2 = document.getElementById('player2');
const btn = document.getElementById('compare-submit');
const b1  = document.getElementById('compare-button');
const b2  = document.getElementById('compare-button-2');

function goto() {
const v1 = (p1?.value || '').trim();
const v2 = (p2?.value || '').trim();
if (!v1 || !v2) { alert('Please enter both player names.'); return; }
window.location.href = `/compare?player1=${encodeURIComponent(v1)}&player2=${encodeURIComponent(v2)}`;
}
btn?.addEventListener('click', goto);
b1?.addEventListener('click', goto);
b2?.addEventListener('click', goto);
[p1,p2].forEach(el=>el?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); goto(); }}));
})();
