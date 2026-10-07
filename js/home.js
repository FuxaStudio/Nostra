/* Úvodní stránka. Skript sdílí česká (/index.html) i anglická verze
   (/en/index.html); texty jdou přes CN.t a data z js/data.js. Každý blok se
   vykreslí jen tam, kde stránka má jeho prvky (karusel jen ve stare-hero.html). */
(function () {
  var CN = window.CN;
  function $(id) { return document.getElementById(id); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nadcházející koncerty ----
     Řazení podle ISO data. Koncert, který už proběhl, se schová sám
     (v den koncertu na webu ještě zůstává). */
  var now = new Date();
  var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  var upcoming = CN.CONCERTS
    .filter(function (c) { return c.iso >= today; })
    .sort(function (a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0; });

  /* „neděle“ / „Sunday“ z ISO data (počítá se v místním čase, bez posunu přes UTC). */
  function weekday(iso) {
    var p = iso.split('-');
    return CN.t('weekdays').split(',')[new Date(+p[0], +p[1] - 1, +p[2]).getDay()] || '';
  }

  /* Snímky z videí jsou ve třech šířkách (…-960/1600/2560.webp). */
  function stillSrcset(src) {
    var m = /^(.*-)(?:960|1600|2560)\.webp$/.exec(src || '');
    if (!m) return '';
    return [960, 1600, 2560].map(function (w) { return m[1] + w + '.webp ' + w + 'w'; }).join(', ');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function icon(id) {
    return '<svg class="icon" width="15" height="15" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';
  }
  var NEW_WINDOW = '<span class="sr-only">' + CN.t('newWindow') + '</span>';

  /* ---- Tři nejbližší koncerty jako karty ----
     Vzhled vychází z karet na stránce Koncerty. Karta není celá odkazem,
     protože nese dvě akce: událost (jen kde existuje) a uložení do kalendáře.
     Mapy a .ics: sdílené CN.mapUrl / CN.calendarAttrs v data.js. */
  var concertGrid = $('homeConcerts');
  if (concertGrid) {
    var next3 = upcoming.slice(0, 3);
    if (!next3.length) {
      concertGrid.hidden = true;
      $('homeConcertsEmpty').hidden = false;
    } else {
      concertGrid.innerHTML = next3.map(function (c) {
        return '<article class="concert-card home-card">' +
          '<div class="thumb"><img src="' + c.img + '" srcset="' + stillSrcset(c.img) + '"' +
            ' sizes="(max-width: 760px) 100vw, (max-width: 1140px) 50vw, 460px"' +
            ' width="960" height="540" alt="' + esc(c.imgAlt) + '" loading="lazy"></div>' +
          '<div class="body">' +
            '<h3>' + esc(c.title || c.town) + '</h3>' +
            (c.subtitle ? '<p class="home-card__sub">' + esc(c.subtitle) + '</p>' : '') +
            '<ul>' +
              '<li>' + icon('calendar') + '<time datetime="' + c.iso + (c.time ? 'T' + c.time : '') + '">' +
                weekday(c.iso) + ' ' + c.dateFull + (c.time ? ', ' + c.time : '') + '</time></li>' +
              '<li>' + icon('pin') + '<a class="home-card__map" href="' + esc(CN.mapUrl(c)) + '" target="_blank" rel="noopener">' +
                esc(c.place) + ', ' + esc(c.town) + '<span class="sr-only">' + CN.t('mapHint') + '</span>' + NEW_WINDOW + '</a></li>' +
            '</ul>' +
            '<div class="home-card__actions">' +
              (c.url ? '<a class="btn btn-blue" href="' + esc(c.url) + '" target="_blank" rel="noopener">' +
                esc(c.urlLabel || CN.t('details')) + ' <span class="arrow-ne" aria-hidden="true">↗</span>' + NEW_WINDOW + '</a>' : '') +
              '<a class="btn btn-outline" ' + CN.calendarAttrs(c) + '>' +
                icon('calendar') + CN.t('addToCalendar') + '</a>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('');
    }
  }

  /* ---- Ukázka galerie (pás alb s tažením) ----
     Alba z CN.ALBUMS ve tvaru {id, name, cover, photos}. Bez alb se sekce skryje. */
  var genreRow = $('genreRow');
  if (genreRow) {
    var albums = (CN.ALBUMS || []).filter(function (a) { return a && (a.cover || (a.photos && a.photos[0])); }).slice(0, 8);

    if (!albums.length) {
      var gallerySection = genreRow.closest('section');
      if (gallerySection) gallerySection.hidden = true;
    } else {
      initGalleryTeaser(albums);
    }
  }

  function initGalleryTeaser(albums) {
    var CARD = 326; /* šířka karty + mezera (.genre-card) */

    function teaserCard(a, dup) {
      return '<a href="' + CN.url('gallery') + '#album/' + a.id + '" class="genre-card"' +
        (dup ? ' aria-hidden="true" tabindex="-1"' : '') + '>' +
        '<div class="thumb"><img src="' + (a.cover || a.photos[0]) + '" alt="" loading="lazy" draggable="false"></div>' +
        '<p>' + a.name + '</p></a>';
    }

    /* Jedna „sada“ musí být širší než okno, jinak by se v nekonečném pásu
       objevila mezera — při málo albech se proto v sadě zopakují (kopie jsou
       pro čtečky i klávesnici skryté). Celý pás = dvě stejné sady. */
    var reps = Math.max(1, Math.ceil((Math.max(window.innerWidth, 1440) + CARD) / (albums.length * CARD)));
    function teaserSet(dupAll) {
      var html = '';
      for (var r = 0; r < reps; r++) {
        html += albums.map(function (a) { return teaserCard(a, dupAll || r > 0); }).join('');
      }
      return html;
    }
    genreRow.innerHTML = '<div class="genre-track">' + teaserSet(false) + teaserSet(true) + '</div>';

    /* Pás plyne sám a dá se chytit a odhodit (myš i prst). Dvě stejné sady =
       plynulá nekonečná smyčka oběma směry. Po odhození dojede setrvačností
       a plynule se vrátí do vlastního tempa; najetí myší ho pozastaví. */
    var track = genreRow.querySelector('.genre-track');
    if (!track || reduceMotion) return; /* CSS ukáže statickou mřížku */

    var setWidth = 0, speed = 0;
    function measure() {
      setWidth = track.scrollWidth / 2;           /* šířka jedné sady */
      speed = setWidth ? setWidth / (albums.length * reps * 8000) : 0; /* ~8 s na kartu */
    }
    measure();
    window.addEventListener('load', measure);

    var offset = 0;        /* posun doleva v px, drží se v [0, setWidth) */
    var state = 'auto';    /* 'auto' | 'drag' | 'inertia' */
    var hovering = false;
    var dragId = null, startX = 0, startOffset = 0, moved = 0;
    var lastX = 0, lastT = 0, vel = 0;   /* vel: px posunu za ms */

    function wrap(v) { return setWidth ? ((v % setWidth) + setWidth) % setWidth : 0; }
    function apply() { track.style.transform = 'translateX(' + (-offset) + 'px)'; }

    window.addEventListener('resize', function () {
      var ratio = setWidth ? offset / setWidth : 0;
      measure();
      offset = wrap(ratio * setWidth);
      apply();
    });

    genreRow.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovering = true; });
    genreRow.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hovering = false; });

    genreRow.addEventListener('pointerdown', function (e) {
      dragId = e.pointerId;
      try { genreRow.setPointerCapture(dragId); } catch (err) {}
      state = 'drag';
      genreRow.classList.add('dragging');
      startX = e.clientX; startOffset = offset; moved = 0;
      lastX = e.clientX; lastT = e.timeStamp; vel = 0;
    });

    genreRow.addEventListener('pointermove', function (e) {
      if (state !== 'drag' || e.pointerId !== dragId) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > moved) moved = Math.abs(dx);
      offset = wrap(startOffset - dx);            /* tažení doprava → dřívější karty */
      apply();
      var dt = e.timeStamp - lastT;
      if (dt > 0) {
        var inst = -(e.clientX - lastX) / dt;
        vel = vel * 0.7 + inst * 0.3;             /* vyhlazená rychlost */
        lastX = e.clientX; lastT = e.timeStamp;
      }
    });

    function endDrag(e) {
      if (e.pointerId !== dragId) return;
      genreRow.classList.remove('dragging');
      try { genreRow.releasePointerCapture(dragId); } catch (err) {}
      dragId = null;
      state = (Math.abs(vel) > 0.02) ? 'inertia' : 'auto';
    }
    genreRow.addEventListener('pointerup', endDrag);
    genreRow.addEventListener('pointercancel', endDrag);

    /* Skutečné tažení nesmí zároveň otevřít album. */
    genreRow.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    genreRow.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* Fokus z klávesnice: pás se zastaví, aby karta neutekla z obrazovky. */
    genreRow.addEventListener('focusin', function () { hovering = true; });
    genreRow.addEventListener('focusout', function () { hovering = false; });

    var prev = null;
    function frame(t) {
      if (prev == null) prev = t;
      var dt = t - prev; if (dt > 48) dt = 48; prev = t;
      if (!setWidth) measure();
      if (setWidth) {
        if (state === 'auto') {
          if (!hovering) { offset = wrap(offset + speed * dt); apply(); }
        } else if (state === 'inertia') {
          offset = wrap(offset + vel * dt); apply();
          vel *= Math.pow(0.94, dt / 16);         /* tření nezávislé na snímkové frekvenci */
          if (Math.abs(vel) <= speed) state = 'auto';
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---- Hero s videem (index.html) ----
     Nejdřív je vidět první snímek videa (<picture> v HTML). Video se začne
     stahovat až po načtení stránky, aby nebrzdilo text, písmo a fotky.
     Při omezeném pohybu, úspoře dat nebo pomalém připojení zůstane jen snímek.
     Mimo obrazovku se video zastaví. Mobil a úzké obrazovky na výšku dostanou
     vlastní výřez 720 × 1280 (stejné pravidlo jako <source> u snímku). */
  var heroVideo = $('heroVideo');
  if (heroVideo) {
    var conn = navigator.connection || {};
    if (!reduceMotion && !conn.saveData && !/2g$/.test(conn.effectiveType || '')) {
      var startHeroVideo = function () {
        var narrow = window.matchMedia('(max-width: 640px), (max-aspect-ratio: 7/10)').matches;
        heroVideo.muted = true;
        heroVideo.addEventListener('playing', function () { heroVideo.classList.add('is-playing'); });
        heroVideo.src = heroVideo.getAttribute(narrow ? 'data-src-mobile' : 'data-src');
        var play = function () { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); };
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) play(); else heroVideo.pause();
          }).observe(heroVideo);
        } else {
          play();
        }
      };
      if (document.readyState === 'complete') startHeroVideo();
      else window.addEventListener('load', startHeroVideo);
    }
  }

  /* ---- Hero: karusel nejbližších koncertů ----
     Slouží už jen archivu původního hera stare-hero.html. */
  var row = $('heroRow');
  if (!row) return;
  var bgs = [$('heroBg0'), $('heroBg1'), $('heroBg2')];
  var slides = upcoming.slice(0, 3);
  var mobile = window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
  var active = 0;
  var timer = null;

  /* Pozadí hera je na mobilu skryté (stohovaný hero s vlastním obrázkem),
     proto si tam vezme jen nejmenší variantu a další snímky se nenačtou. */
  function setBg(img, src, i) {
    var set = stillSrcset(src);
    if (set) {
      img.srcset = set;
      img.sizes = '(max-width: 860px) 1px, 100vw';
    }
    if (i > 0) img.loading = 'lazy';
    img.src = src;
  }

  /* Žádný nadcházející koncert: jedna karta se základním představením. */
  if (!slides.length) {
    var tpl = $('heroEmpty');
    bgs.forEach(function (img) { img.style.opacity = '0'; });
    if (tpl) {
      setBg(bgs[0], CN.photo.still('13-housle-tma-sekce', 1600), 0);
      bgs[0].style.opacity = '1';
      row.appendChild(tpl.content.cloneNode(true));
    }
    return;
  }

  slides.forEach(function (s, i) { setBg(bgs[i], s.imgWide, i); });

  function renderHero() {
    bgs.forEach(function (img, i) {
      if (!slides[i]) { img.removeAttribute('src'); img.style.opacity = '0'; return; }
      img.style.opacity = i === active ? '1' : '0';
    });
    row.innerHTML = '';
    slides.forEach(function (s, i) {
      var wrap = document.createElement('div');
      wrap.className = 'hero-slide' + (i === active ? '' : ' is-peek');
      if (i === active) {
        var multi = slides.length > 1;
        var shotSet = stillSrcset(s.imgWide);
        wrap.innerHTML =
          '<div class="hero-card">' +
            '<div class="hero-shot"><img src="' + s.imgWide + '"' +
              (shotSet ? ' srcset="' + shotSet + '" sizes="(max-width: 600px) calc(100vw - 44px), 520px"' : '') +
              (mobile ? '' : ' loading="lazy"') +
              ' width="1600" height="900" alt="' + s.imgAlt + '"></div>' +
            (multi ?
              '<div class="hero-arrows">' +
                '<button type="button" class="hero-arrow" data-dir="prev" aria-label="' + CN.t('heroPrev') + '"><svg class="icon" width="20" height="20"><use href="#i-chevron-left"></use></svg></button>' +
                '<button type="button" class="hero-arrow" data-dir="next" aria-label="' + CN.t('heroNext') + '"><svg class="icon" width="20" height="20"><use href="#i-chevron-right"></use></svg></button>' +
              '</div>' +
              '<div class="progress"><span></span></div>' : '') +
            '<div class="row"><img src="' + s.thumb + '" alt=""><p>' + (s.subtitle || s.town || '') + '</p></div>' +
            '<h2>' + (s.title || s.town) + '</h2>' +
            '<ul>' +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + s.dateFull + '</li>' +
              (s.iso && s.time ? '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-clock"></use></svg>' + s.time + '</li>' : '') +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-pin"></use></svg>' + s.venue + '</li>' +
            '</ul>' +
            '<a href="' + CN.url('concerts') + '" class="btn btn-blue">' + CN.t('concertDetail') + '</a>' +
          '</div>';
        if (multi) {
          wrap.querySelector('.hero-arrow[data-dir="prev"]').addEventListener('click', function () { go((active - 1 + slides.length) % slides.length); });
          wrap.querySelector('.hero-arrow[data-dir="next"]').addEventListener('click', function () { go((active + 1) % slides.length); });
        }
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-peek';
        btn.innerHTML = '<img src="' + s.thumb + '" alt=""><p>' + s.dateFull + ' · ' + (s.title || s.town) + '</p>';
        btn.addEventListener('click', function () { go(i); });
        wrap.appendChild(btn);
      }
      row.appendChild(wrap);
    });
  }

  /* Automatické přepínání jen při více koncertech a bez omezeného pohybu. */
  function startTimer() {
    clearInterval(timer);
    if (slides.length < 2 || reduceMotion) return;
    timer = setInterval(function () {
      active = (active + 1) % slides.length;
      renderHero();
    }, 7000);
  }

  function go(i) {
    active = i;
    renderHero();
    startTimer();
  }

  renderHero();
  startTimer();
})();
