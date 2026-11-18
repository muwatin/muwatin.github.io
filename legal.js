// Language toggle for the privacy policy and disclaimer pages (same setting as the main page).
(() => {
  const root = document.documentElement;
  const body = document.body;
  const btn = document.getElementById('lang-toggle');
  let saved = null;
  try { saved = localStorage.getItem('muwatin-lang'); } catch (e) {}

  const apply = (lang) => {
    body.dataset.lang = lang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    btn.textContent = lang === 'ar' ? 'EN' : 'ع';
  };

  apply(saved === 'en' ? 'en' : 'ar');

  btn.addEventListener('click', () => {
    const next = body.dataset.lang === 'ar' ? 'en' : 'ar';
    apply(next);
    try { localStorage.setItem('muwatin-lang', next); } catch (e) {}
  });
})();
