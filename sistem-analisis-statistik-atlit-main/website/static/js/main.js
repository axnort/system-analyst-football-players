// Slideshow auto-rotate
const slides = document.querySelectorAll('.slideshow img');
let idx = 0;

function showSlide(n) {
slides.forEach((s, i) => s.classList.toggle('active', i === n));
}
if (slides.length > 0) {
showSlide(idx);
setInterval(() => {
idx = (idx + 1) % slides.length;
showSlide(idx);
}, 5000);
}
