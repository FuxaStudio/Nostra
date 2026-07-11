/* Shared behaviour for every page: mobile nav drawer, CZ/EN cosmetic toggle
   and scroll-reveal animations. */
(function () {
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var close = document.getElementById('navClose');
    var scrim = document.getElementById('navScrim');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    function open() {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function shut() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      document.body.classList.contains('nav-open') ? shut() : open();
    });
    if (close) close.addEventListener('click', shut);
    if (scrim) scrim.addEventListener('click', shut);
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', shut);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1140) shut();
    });
  }

  function initLangToggle() {
    var btn = document.getElementById('langToggle');
    if (!btn) return;
    var flagCs = btn.querySelector('.flag-cs');
    var flagEn = btn.querySelector('.flag-en');
    var label = btn.querySelector('.lang-label');
    var lang = 'cs';
    btn.addEventListener('click', function () {
      lang = lang === 'cs' ? 'en' : 'cs';
      var isCs = lang === 'cs';
      if (flagCs) flagCs.hidden = !isCs;
      if (flagEn) flagEn.hidden = isCs;
      if (label) label.textContent = isCs ? 'CZ' : 'EN';
    });
  }

  function initPlaceholderLinks() {
    /* Links not yet wired to a real destination (e.g. ticket vendor, legal
       pages) use href="#" — keep them inert instead of jumping to top. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="#"]');
      if (a) e.preventDefault();
    });
  }

  /* Scroll-reveal: bloky dostanou .reveal a objeví se při vstupu do viewportu.
     Karty v gridech se odhalují postupně (stagger). Dynamicky dorenderovaný
     obsah (galerie, "načíst další") pokrývá MutationObserver. */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    /* Samostatné bloky — textové sloupce, hlavičky sekcí, fotky. */
    var SINGLES = [
      '.section-head', '.copy', '.photo-wrap',
      '.mission .head', '.venues .head', '.genre-section .head',
      '.genre-row',
      '.inquiry .inner',
      '.filters .filter-row',
      '.featured .eyebrow', '.featured .h2',
      '.contact-info', '.contact-form-wrap',
      '.album-head .container > *'
    ].join(',');

    /* Kontejnery, jejichž děti se odhalují se zpožděním po sobě. */
    var GROUPS = [
      '.featured-list', '.grid-concerts', '.grid-archive', '.grid-albums',
      '.grid-videos', '.grid-photos', '.grid-musicians', '.mission-grid',
      '.venues-grid', '.stats-strip', '.timeline-items',
      '.repertoire .tags', '.members-strip', '.leaders-row'
    ].join(',');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    function tag(el, delayMs) {
      if (el.classList.contains('reveal')) return;
      var ancestor = el.parentElement && el.parentElement.closest('.reveal');
      if (ancestor) return; /* nevnořovat animaci do animace */
      el.classList.add('reveal');
      if (delayMs) el.style.setProperty('--reveal-delay', delayMs + 'ms');
      io.observe(el);
    }

    function scan() {
      document.querySelectorAll(SINGLES).forEach(function (el) { tag(el, 0); });
      document.querySelectorAll(GROUPS).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          tag(child, Math.min(i, 8) * 70);
        });
      });
    }

    scan();

    var scheduled = false;
    new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        scan();
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initLangToggle();
    initPlaceholderLinks();
    initReveal();
  });
})();
