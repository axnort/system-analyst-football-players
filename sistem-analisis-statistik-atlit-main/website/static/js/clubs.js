(function () {
// ===== Helpers
const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

// ===== Hamburger =====
const burger = qs(".hamburger");
const menu   = qs("#main-menu");

const openMenu  = () => { menu.classList.add("active");  burger.setAttribute("aria-expanded","true");  };
const closeMenu = () => { menu.classList.remove("active"); burger.setAttribute("aria-expanded","false"); };

if (burger && menu) {
burger.addEventListener("click", () => menu.classList.contains("active") ? closeMenu() : openMenu());
document.addEventListener("pointerdown", (e) => {
    if (menu.classList.contains("active") && !menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
}, {passive:true});
window.addEventListener("resize", () => { if (window.innerWidth >= 768) closeMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

// fallback active link
const path = location.pathname.replace(/\/+$/,'') || '/';
qsa(".nav-menu a").forEach(a => {
const href = (a.getAttribute("href")||'').replace(/\/+$/,'') || '/';
if (!a.classList.contains('active') && href === path) a.classList.add('active');
});

// ===== Search & KU =====
const form   = qs("#club-search-form");
const search = qs("#search");
const kuSel  = qs("#ku");

if (form && search) {
search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.submit(); }
});
}
if (form && kuSel) {
kuSel.addEventListener("change", () => {
    form.requestSubmit ? form.requestSubmit() : form.submit();
});
}

// (Optional) contoh suggestion statis sederhana (hapus bila tidak dipakai)
const suggestBox = qs("#search-suggest");
if (suggestBox && search) {
const data = (window.CLUB_NAMES || []).slice(0, 8); // inject dari backend kalau mau
const render = (q) => {
    if (!q || !data.length) { suggestBox.classList.add("hidden"); suggestBox.innerHTML = ""; return; }
    const lower = q.toLowerCase();
    const items = data.filter(n => n.toLowerCase().includes(lower)).slice(0,5);
    if (!items.length) { suggestBox.classList.add("hidden"); suggestBox.innerHTML=""; return; }
    suggestBox.innerHTML = items.map(n => `<div class="suggest-item" role="option">${n}</div>`).join("");
    suggestBox.classList.remove("hidden");
};
search.addEventListener("input", () => render(search.value));
suggestBox.addEventListener("click", (e) => {
    const it = e.target.closest(".suggest-item");
    if (!it) return;
    search.value = it.textContent.trim();
    suggestBox.classList.add("hidden");
    form.requestSubmit ? form.requestSubmit() : form.submit();
});
document.addEventListener("pointerdown", (e) => {
    if (!suggestBox.contains(e.target) && e.target !== search) suggestBox.classList.add("hidden");
}, {passive:true});
}
})();
