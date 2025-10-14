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

/* ===== Value coloring for attributes ===== */
(function(){
document.querySelectorAll('.attr-table td.value').forEach(td=>{
const v = parseInt(td.textContent,10);
if (isNaN(v)) return;
td.classList.remove('high','mid','low','verylow');
if (v >= 85) td.classList.add('high');
else if (v >= 70) td.classList.add('mid');
else if (v >= 50) td.classList.add('low');
else td.classList.add('verylow');
});
})();

/* ===== Radar bands (sunset→green, 5 stage) ===== */
const radarBands = {
id: "radarBands",
beforeDatasetsDraw(chart) {
const r = chart.scales?.r; if (!r) return;
const ctx = chart.ctx;

const steps = 5;
// inner → outer (red → amber → yellow → lime → green)
const colors = [
    "rgba(239,68,68,0.25)",   // red-500 (inner)
    "rgba(245,158,11,0.25)",  // amber-500
    "rgba(234,179,8,0.25)",   // yellow-500
    "rgba(132,204,22,0.25)",  // lime-500
    "rgba(34,197,94,0.25)"    // green-500 (outer)
];

const n = chart.data.labels?.length ?? 0;
const min = r.min ?? 0, max = r.max ?? 100;
const stepVal = (max - min) / steps;

// draw outer → inner for neat borders
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

/* ===== Soft glow for dataset polygon ===== */
const radarGlow = {
id: "radarGlow",
beforeDatasetDraw(chart, args, opts) {
const ctx = chart.ctx;
ctx.save();
ctx.shadowColor = opts?.color ?? "rgba(34,197,94,0.9)"; // green glow
ctx.shadowBlur  = opts?.blur  ?? 18;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
},
afterDatasetDraw(chart) { chart.ctx.restore(); }
};

(function makeRadar(){
const player = typeof PLAYER_JSON !== "undefined" ? PLAYER_JSON : null;
const canvas = document.getElementById("perfRadar");
if (!player || !canvas || typeof Chart === "undefined") return;

// center & symmetric
const wrap = canvas.parentElement;
wrap.style.height = "320px";
wrap.style.display = "flex";
wrap.style.alignItems = "center";
wrap.style.justifyContent = "center";

canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.maxWidth = "420px";
canvas.style.maxHeight = "320px";
canvas.style.display = "block";
canvas.style.margin = "0 auto";

const ctx = canvas.getContext("2d");

new Chart(ctx, {
type: "radar",
plugins: [radarBands, radarGlow],
data: {
    labels: ["Speed","Vision","Attacking","Technical","Aerial","Defending","Mental","Physical"],
    datasets: [{
    label: player.Name,
    data: [
        +player.Speed, +player.Vision, +player.Attacking, +player.Technical,
        +player.Aerial, +player.Defending, +player.Mental, +player.Physical
    ],
    borderColor: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.22)",
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: "#22c55e",
    pointBorderColor: "transparent",
    pointHoverRadius: 4
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    legend: { display: false },
    tooltip:{ enabled: true },
    radarGlow: { color:"#22c55e", blur:20 }
    },
    scales: {
    r: {
        min: 0, max: 100,
        ticks: { display: false, backdropColor: "transparent" }, // no numbers inside
        grid: { color: "rgba(148,163,184,0.10)" },
        angleLines: { color: "rgba(148,163,184,0.10)" },
        pointLabels: {
        display: true,
        color: "#e5e7eb",
        font: { size: 13, weight: "600" },
        padding: 6
        }
    }
    },
    elements: { line: { tension: 0 } }
}
});
})();
