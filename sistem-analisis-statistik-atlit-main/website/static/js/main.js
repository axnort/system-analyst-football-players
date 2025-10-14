// === Toggle hamburger menu ===
const burger = document.querySelector(".hamburger");
const menu   = document.querySelector(".nav-menu");

if (burger && menu) {
burger.addEventListener("click", () => {
const isOpen = menu.classList.toggle("active");
burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// tutup menu ketika klik di luar
document.addEventListener("click", (e) => {
if (!menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
}
});
}

// === Simple slideshow rotator (opsional) ===
(function rotateSlides(){
const slides = document.querySelectorAll(".slideshow img");
if (!slides.length) return;
let i = 0;
setInterval(() => {
slides[i].classList.remove("active");
i = (i + 1) % slides.length;
slides[i].classList.add("active");
}, 5000);
})();
