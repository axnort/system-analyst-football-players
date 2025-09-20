/* === Concentric color bands plugin (radar) === */
const radarBands = {
id: "radarBands",
beforeDatasetsDraw(chart, _args, opts) {
const scale = chart.scales?.r;
if (!scale) return;
const ctx = chart.ctx;

const steps  = opts?.steps  ?? 5;
const colors = opts?.colors ?? [
    "rgba(239,68,68,0.45)",   // merah
    "rgba(245,158,11,0.35)",  // oranye
    "rgba(234,179,8,0.28)",   // kuning
    "rgba(163,230,201,0.22)", // teal
    "rgba(34,197,94,0.18)"    // hijau
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

/* ===== Radar Chart (di dalam kartu info) ===== */
(function makeRadar(){
const player = typeof PLAYER_JSON !== "undefined" ? PLAYER_JSON : null;
const canvas = document.getElementById("perfRadar");
if (!player || !canvas || typeof Chart === "undefined") return;

// pastikan kanvas punya tinggi; parent-mu sudah 270px
canvas.style.width  = "100%";
canvas.style.height = "100%";

const ctx = canvas.getContext("2d");

new Chart(ctx, {
type: "radar",
plugins: [radarBands],                 // ⬅️ aktifkan bands
data: {
    labels: ["Speed","Vision","Attacking","Technical","Aerial","Defending","Mental"],
    datasets: [{
    label: player.Name,
    data: [
        +player.Speed, +player.Vision, +player.Attacking, +player.Technical,
        +player.Aerial, +player.Defending, +player.Mental
    ],
    borderColor: "#10b981",
    backgroundColor: "rgba(16,185,129,0.20)",  // transparan supaya bands terlihat
    borderWidth: 2,
    pointBackgroundColor: "#10b981",
    pointBorderColor: "#052e2b",
    pointHoverBackgroundColor: "#34d399",
    pointHoverBorderColor: "#052e2b"
    }]
},
options: {
    responsive: true,
    maintainAspectRatio: false,          // ⬅️ biar mengikuti tinggi container
    plugins: {
    radarBands: { steps: 6 },          // jumlah cincin
    legend: { labels: { color: "#e5e7eb", font: { weight: "bold" } } }
    },
    scales: {
    r: {
        min: 0, max: 100,
        ticks: { display: false, backdropColor: "transparent" },
        grid: { color: "rgba(148,163,184,0.18)", lineWidth: 1 },
        angleLines: { color: "rgba(148,163,184,0.18)", lineWidth: 1 },
        pointLabels: { color: "#e5e7eb", font: { size: 12, weight: "bold" } }
    }
    },
    elements: { line: { tension: 0.2 } }
}
});
})();
