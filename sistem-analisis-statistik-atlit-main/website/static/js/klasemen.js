// Kecil-kecil tapi manis: format SG (+/-), collapse/expand per grup
document.addEventListener("DOMContentLoaded", () => {
// Format kolom Selisih Gol (SG)
document.querySelectorAll(".klasemen-table td.sg").forEach((cell) => {
const raw = (cell.textContent || "").trim();
const val = Number(raw);

if (!Number.isNaN(val)) {
    // tambahkan tanda + untuk nilai positif
    cell.textContent = (val > 0 ? `+${val}` : `${val}`);
    // warna kelas
    cell.classList.remove("sg-pos", "sg-neg", "sg-zero");
    if (val > 0) cell.classList.add("sg-pos");
    else if (val < 0) cell.classList.add("sg-neg");
    else cell.classList.add("sg-zero");
}
});

// Collapse/expand grup saat judul diklik
document.querySelectorAll(".group-card").forEach((card) => {
const title = card.querySelector(".group-title");
const tbody = card.querySelector("tbody");
if (!title || !tbody) return;

title.addEventListener("click", () => {
    const collapsed = card.classList.toggle("collapsed");
    tbody.style.display = collapsed ? "none" : "";
});
});

// Hilangkan pesan kosong jika ada data minimal satu grup
const groupedHasData =
document.querySelectorAll(".group-card tbody tr").length > 0;
if (groupedHasData) {
const empty = document.querySelector(".empty-state");
if (empty) empty.remove();
}
});
