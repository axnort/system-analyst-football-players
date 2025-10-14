"use strict";

// === NAV: hamburger toggle ===
(function(){
const btn = document.querySelector(".hamburger");
const menu = document.getElementById("main-menu");
if(!btn || !menu) return;
btn.addEventListener("click", ()=>{
const open = menu.classList.toggle("active");
btn.setAttribute("aria-expanded", open ? "true" : "false");
});
document.addEventListener("click", (e)=>{
if(!menu.classList.contains("active")) return;
if(!menu.contains(e.target) && e.target !== btn){
    menu.classList.remove("active");
    btn.setAttribute("aria-expanded","false");
}
});
})();

// === KU selector: sync querystring ===
(function(){
const sel = document.getElementById("kuSel");
if(!sel) return;

const url = new URL(window.location.href);
const kuQS = url.searchParams.get("ku");
if(kuQS && sel.value !== kuQS) sel.value = kuQS;

sel.addEventListener("change", ()=>{
const u = new URL(window.location.href);
u.searchParams.set("ku", sel.value);
window.location.replace(`${u.pathname}?${u.searchParams.toString()}`);
});
})();
