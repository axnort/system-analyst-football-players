// ====== Top compare submit (link tetap /compare?player1=&player2=) ======
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
if (btn) btn.addEventListener('click', goto);
if (b1)  b1.addEventListener('click', goto);
if (b2)  b2.addEventListener('click', goto);
})();

// ====== Concentric color bands plugin for radar ======
const radarBands = {
id: "radarBands",
beforeDatasetsDraw(chart, _args, opts) {
const scale = chart.scales?.r; if (!scale) return;
const ctx = chart.ctx;

const steps  = opts?.steps  ?? 6;
const colors = opts?.colors ?? [
    "rgba(239,68,68,0.45)",   // red
    "rgba(245,158,11,0.35)",  // orange
    "rgba(234,179,8,0.28)",   // yellow
    "rgba(163,230,201,0.22)", // teal
    "rgba(34,197,94,0.18)",   // green
    "rgba(17,94,89,0.16)"     // deep teal
];

const count   = chart.data.labels?.length ?? 0;
const min     = scale.min ?? 0;
const max     = scale.max ?? 100;
const stepVal = (max - min) / steps;

for (let s = steps; s >= 1; s--) {
    const value = min + stepVal * s;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
    const pt = scale.getPointPositionForValue(i, value);
    if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.fillStyle = colors[Math.min(colors.length - 1, s - 1)];
    ctx.fill();
}
}
};

// ====== Render Radar Chart (pakai window.PLAYER1 / window.PLAYER2 dari server) ======
(function renderChart(){
const c = document.getElementById('comparisonChart');
if (!c || typeof Chart === 'undefined') return;

const p1 = window.PLAYER1 || null;
const p2 = window.PLAYER2 || null;

if (!p1 && !p2) return; // tidak ada pemain

const labels = ['Speed','Vision','Attacking','Technical','Aerial','Defending','Mental'];

const ds = [];
if (p1) ds.push({
label: p1.Name,
data: [num(p1.Speed), num(p1.Vision), num(p1.Attacking), num(p1.Technical), num(p1.Aerial), num(p1.Defending), num(p1.Mental)],
backgroundColor: 'rgba(16,185,129,0.22)',
borderColor: 'rgba(16,185,129,1)',
borderWidth: 3,
pointBackgroundColor: 'rgba(16,185,129,1)',
pointBorderColor: '#fff',
pointRadius: 4
});
if (p2) ds.push({
label: p2.Name,
data: [num(p2.Speed), num(p2.Vision), num(p2.Attacking), num(p2.Technical), num(p2.Aerial), num(p2.Defending), num(p2.Mental)],
backgroundColor: 'rgba(99,102,241,0.22)',
borderColor: 'rgba(99,102,241,1)',
borderWidth: 3,
pointBackgroundColor: 'rgba(99,102,241,1)',
pointBorderColor: '#fff',
pointRadius: 4
});

new Chart(c.getContext('2d'), {
plugins: [radarBands],
type: 'radar',
data: { labels, datasets: ds },
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    radarBands: { steps: 6 },
    legend: { labels: { color: '#ffffff', font: { size: 14, weight: 'bold' } } }
    },
    elements: { line: { tension: 0.2 } },
    scales: {
    r: {
        min: 0, max: 100,
        ticks: { display: false, backdropColor: 'transparent' },
        grid: { color: '#374151', lineWidth: 1 },
        angleLines: { color: '#374151', lineWidth: 1 },
        pointLabels: { color: '#ffffff', font: { size: 12, weight:'bold' } }
    }
    }
}
});
})();

// ====== Warnai nilai atribut (threshold) di panel kiri/kanan ======
(function colorizeValues(){
document.querySelectorAll('.attr-col .value').forEach(td=>{
const v = parseFloat(String(td.textContent || '').trim());
if (Number.isNaN(v)) return;
td.classList.remove('high','mid','low','verylow');
if (v >= 90) td.classList.add('high');
else if (v >= 75) td.classList.add('mid');
else if (v >= 60) td.classList.add('low');
else td.classList.add('verylow');
});
})();

/* helper */
function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
