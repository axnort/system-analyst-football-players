// Toggle PIN visibility
(function () {
const pin = document.getElementById('pinField');
const toggle = document.getElementById('pinToggle');
if (pin && toggle) {
toggle.addEventListener('click', () => {
    pin.type = (pin.type === 'password') ? 'text' : 'password';
});
}
})();

// Toggle hamburger menu (pakai struktur navbar di clubs.css)
(function () {
const hamburger = document.querySelector('.hamburger');
const navMenu = document.getElementById('main-menu');
if (hamburger && navMenu) {
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', (!expanded).toString());
});
}
})();
