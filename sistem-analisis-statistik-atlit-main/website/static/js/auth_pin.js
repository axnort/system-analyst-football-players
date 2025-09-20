(function () {
const pin = document.getElementById('pinField');
const toggle = document.getElementById('pinToggle');
if (pin && toggle) {
toggle.addEventListener('click', () => {
    pin.type = (pin.type === 'password') ? 'text' : 'password';
});
}
})();
