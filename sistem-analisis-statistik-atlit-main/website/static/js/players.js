// Filter nama pemain di halaman Players (tanpa reload)
document.addEventListener("DOMContentLoaded", () => {
const input = document.getElementById("search");
const btn = document.getElementById("search-button");
const cards = Array.from(document.querySelectorAll(".player-card"));

if (!input || !btn || cards.length === 0) return;

function applyFilter() {
const q = (input.value || "").trim().toLowerCase();
let visibleCount = 0;

cards.forEach(card => {
    const name = (card.querySelector(".player-name")?.textContent || "").toLowerCase();
    if (!q || name.includes(q)) {
    card.style.display = "";
    visibleCount++;
    } else {
    card.style.display = "none";
    }
});

// pastikan tidak ada pesan "Belum ada pemain"
const empty = document.querySelector(".empty-state");
if (empty) empty.style.display = "none";

// optional: bisa tampilkan pesan custom kalau semua tersembunyi
// tapi kamu minta disembunyikan, jadi tidak kita munculkan.
}

btn.addEventListener("click", (e) => {
e.preventDefault();
applyFilter();
});

input.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
    e.preventDefault();
    applyFilter();
}
});
});
