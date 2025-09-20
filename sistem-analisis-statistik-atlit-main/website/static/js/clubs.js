// static/js/clubs.js
(function () {
const $form = document.querySelector('form.search-row');
const $ku = document.querySelector('#ku');
const $search = document.querySelector('#search');
const $cards = document.querySelectorAll('.club-card');

// Auto-submit ketika KU berubah (server-side filtering)
if ($form && $ku) {
$ku.addEventListener('change', () => {
    $form.submit();
});
}

// Enter di input search = submit form
if ($form && $search) {
$search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    e.preventDefault();
    $form.submit();
    }
});
}

// Pastikan klik kartu klub menuju halaman auth PIN klub, bawa param KU sekarang
$cards.forEach((card) => {
card.addEventListener('click', (e) => {
    // biarkan default kalau href sudah benar
    const slug = card.getAttribute('data-slug');
    const ku = card.getAttribute('data-ku') || (document.querySelector('#ku')?.value || 'KU8');
    if (slug) {
    e.preventDefault();
    const url = `/auth_club/${encodeURIComponent(slug)}?ku=${encodeURIComponent(ku)}`;
    window.location.assign(url);
    }
});
});
})();
