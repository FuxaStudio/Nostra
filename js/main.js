/* Shared behaviour for every page: mobile nav drawer and scroll-reveal
   animations. Přepínač CZ/EN je obyčejný odkaz na protějšek stránky
   (viz .lang-toggle v HTML), takže funguje i bez JavaScriptu. */
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
      /* Zásuvka překryje tlačítko menu — fokus proto přejde na první odkaz. */
      var first = links.querySelector('a');
      if (first) first.focus();
    }
    function shut() {
      if (!document.body.classList.contains('nav-open')) return;
      var hadFocus = links.contains(document.activeElement);
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (hadFocus) toggle.focus();
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
      /* Otevřená zásuvka drží fokus v sobě — jinak by Tab utekl pod závoj. */
      if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
        var items = links.querySelectorAll('a, button');
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
        else if (!links.contains(document.activeElement)) { e.preventDefault(); firstEl.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1240) shut();
    });
  }

  /* Přepínač jazyka je obyčejný odkaz na protějšek stránky. V detailu alba
     (#album/…) si ale musí vzít adresu alba s sebou — id alb jsou v obou
     jazycích stejná, takže stačí přilepit hash. */
  function initLangToggle() {
    document.querySelectorAll('.lang-toggle').forEach(function (a) {
      a.addEventListener('click', function () {
        if (/^#album\//.test(location.hash)) {
          a.setAttribute('href', a.getAttribute('href').split('#')[0] + location.hash);
        }
      });
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
      '.genre-section .head',
      '.genre-row',
      '.inquiry-grid',
      '.filters .filter-row',
      '.featured .eyebrow', '.featured .h2',
      '.contact-info', '.contact-form-wrap',
      '.album-head .container > *'
    ].join(',');

    /* Kontejnery, jejichž děti se odhalují se zpožděním po sobě. */
    var GROUPS = [
      '.grid-concerts', '.grid-archive', '.grid-albums',
      '.grid-videos', '.grid-photos', '.grid-musicians', '.grid-leaders',
      '.members-strip'
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
      if (el.classList.contains('reveal')) return false;
      var ancestor = el.parentElement && el.parentElement.closest('.reveal');
      if (ancestor) return false; /* nevnořovat animaci do animace */
      el.classList.add('reveal');
      if (delayMs) el.style.setProperty('--reveal-delay', delayMs + 'ms');
      return true;
    }

    /* Bloky, které už při načtení zasahují do obrazovky (typicky obsah vykukující
       pod hero), se odhalí hned. Observer by je pustil až po 10 % výšky + 36 px,
       takže by z nich byl vidět jen kousek (fotka ano, vedlejší text ne). Pozice
       se čtou předem najednou, aby přidávání tříd nevynucovalo layout dokola. */
    function scan() {
      var items = [];
      document.querySelectorAll(SINGLES).forEach(function (el) { items.push([el, 0]); });
      document.querySelectorAll(GROUPS).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          items.push([child, Math.min(i, 8) * 70]);
        });
      });

      var fold = window.innerHeight;
      var rects = items.map(function (it) {
        return it[0].classList.contains('reveal') ? null : it[0].getBoundingClientRect();
      });

      var now = [];
      items.forEach(function (it, i) {
        if (!tag(it[0], it[1])) return;
        var r = rects[i];
        if (r && r.height > 0 && r.top < fold) now.push(it[0]);
        else io.observe(it[0]);
      });

      /* Dva snímky: prohlížeč nejdřív vykreslí výchozí stav .reveal, jinak by
         přechod neproběhl a blok by jen bez animace "skočil" na místo. */
      if (now.length) requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          now.forEach(function (el) { el.classList.add('is-visible'); });
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
