// Toggle show/hide PIN
(function(){
const field = document.getElementById("pinField");
const btn = document.getElementById("pinToggle");
if (!field || !btn) return;

let visible = false;
btn.addEventListener("click", () => {
visible = !visible;
field.type = visible ? "text" : "password";
btn.setAttribute("aria-label", visible ? "Hide PIN" : "Show PIN");
});
})();
