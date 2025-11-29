"use strict";

/* =========================
1) FORMAT SG + COLLAPSE
========================= */
document.addEventListener("DOMContentLoaded", () => {
// --- Format kolom SG (+x / 0 / -x) + warna ---
document.querySelectorAll(".klasemen-table td.sg").forEach((cell) => {
const raw = (cell.textContent || "").trim();
const val = Number(raw);
if (!Number.isNaN(val)) {
    cell.textContent = (val > 0 ? `+${val}` : `${val}`);
    cell.classList.remove("sg-pos", "sg-neg", "sg-zero");
    if (val > 0) cell.classList.add("sg-pos");
    else if (val < 0) cell.classList.add("sg-neg");
    else cell.classList.add("sg-zero");
}
});

// --- Collapse/expand tiap group-card ---
document.querySelectorAll(".group-card").forEach((card, idx) => {
const titleEl = card.querySelector(".group-title");
const tbody = card.querySelector("tbody");
if (!titleEl || !tbody) return;

titleEl.setAttribute("role", "button");
titleEl.setAttribute("tabindex", "0");

if (!tbody.id) tbody.id = `group-tbody-${idx + 1}`;
titleEl.setAttribute("aria-controls", tbody.id);
titleEl.setAttribute("aria-expanded", "true");

const toggle = () => {
    const collapsed = card.classList.toggle("collapsed");
    tbody.style.display = collapsed ? "none" : "";
    titleEl.setAttribute("aria-expanded", String(!collapsed));
};

titleEl.addEventListener("click", toggle);
titleEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggle();
    }
});
});

// --- Hapus empty-state kalau ada data ---
const hasRows = document.querySelectorAll(".group-card tbody tr").length > 0;
if (hasRows) {
const empty = document.querySelector(".empty-state");
if (empty) empty.remove();
}
});

/* ===========================================
2) KU SWITCH, TAB SPA, BRACKET IMG, LIGHTBOX
=========================================== */
(() => {
const BRACKET_IMG = {
KU8:  "/static/aset/bracket/KU8/knockout.jpg",
KU12: "/static/aset/bracket/KU12/knockout.jpg",
};

const kuSel = document.getElementById("kuSel");
const tabs  = document.querySelectorAll(".tab");
const secG  = document.getElementById("section-group");
const secK  = document.getElementById("section-knockout");
const imgB  = document.getElementById("img-bracket");

const params = new URLSearchParams(location.search);

const initTab = params.get("tab") || (document.querySelector(".tab.active")?.dataset.tab || "group");
const initKU  = params.get("ku")  || (kuSel?.value || "KU8");

if (kuSel) kuSel.value = initKU;
setActiveTab(initTab);
setBracket(initKU);

// --- Ganti KU → reload (agar server render data baru) ---
kuSel?.addEventListener("change", () => {
params.set("ku", kuSel.value);
const currentTab = document.querySelector(".tab.active")?.dataset.tab || "group";
params.set("tab", currentTab);
location.search = params.toString();
});

// --- Tabs SPA (tanpa reload) ---
tabs.forEach((btn) => {
btn.addEventListener("click", () => {
    const nextTab = btn.dataset.tab;
    setActiveTab(nextTab);
    params.set("tab", nextTab);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
});
});

function setActiveTab(tab) {
tabs.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
if (secG) secG.classList.toggle("hidden", tab !== "group");
if (secK) secK.classList.toggle("hidden", tab !== "knockout");
}

function setBracket(ku) {
if (!imgB) return;
imgB.src = BRACKET_IMG[ku] || BRACKET_IMG.KU8;
imgB.alt = `Bagan Knockout ${ku}`;
}

/* -------- LIGHTBOX -------- */
const lb      = document.getElementById("lightbox");
const lbImg   = document.getElementById("lightbox-img");
const lbCap   = document.getElementById("lightbox-cap");
const lbClose = document.querySelector(".lightbox-close");

const openLB = (src, caption) => {
if (!lb || !lbImg) return;
lbImg.src = src;
if (lbCap) lbCap.textContent = caption || "";
lb.classList.add("show");
lb.setAttribute("aria-hidden", "false");
};

const closeLB = () => {
if (!lb || !lbImg) return;
lb.classList.remove("show");
lb.setAttribute("aria-hidden", "true");
setTimeout(() => { lbImg.src = ""; }, 50);
};

imgB?.addEventListener("click", () => openLB(imgB.src, imgB.alt));
lbClose?.addEventListener("click", closeLB);
lb?.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });
})();

/* ===========================================
3) HAMBURGER NAVBAR (MOBILE MENU)
=========================================== */
document.addEventListener("DOMContentLoaded", () => {
const burger = document.querySelector(".hamburger");
const menu   = document.querySelector(".nav-menu");

if (!burger || !menu) return;

// Saat tombol ☰ ditekan
burger.addEventListener("click", (e) => {
e.stopPropagation(); // biar gak langsung ketutup
const isOpen = menu.classList.toggle("active");
burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Tutup menu kalau klik di luar area menu
document.addEventListener("click", (e) => {
if (!menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
}
});

// Tutup menu saat salah satu link di dalam menu diklik
menu.querySelectorAll("a").forEach((link) => {
link.addEventListener("click", () => {
    menu.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
});
});
});

