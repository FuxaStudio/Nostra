(function () {
  var CN = window.CN;
  var CONCERTS = CN.CONCERTS;

  document.getElementById('seasonImg').src = CN.img('hall', 1, 900, 900, { q: 80 });
  document.getElementById('recommendImg').src = CN.img('orchestra', 3, 700, 700, { q: 80 });
  document.getElementById('genreBg').src = CN.img('hall', 5, 1600, 900, { q: 70 });

  /* ---- Featured events ---- */
  var featured = CONCERTS[0];
  document.getElementById('featuredPhoto').innerHTML =
    '<img src="' + featured.imgWide + '" alt="' + featured.title + '">' +
    '<div class="panel">' +
      '<h3>' + featured.title + '</h3>' +
      '<p class="sub">' + featured.desc + '</p>' +
      '<ul>' +
        '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + featured.dateFull + '</li>' +
        '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-pin"></use></svg>' + featured.venue + '</li>' +
      '</ul>' +
      '<a href="' + CN.url('concerts') + '" class="btn btn-blue" style="padding:12px 22px;">' + CN.t('concertDetail') + ' →</a>' +
    '</div>';

  document.getElementById('eventList').innerHTML = CONCERTS.slice(1, 9).map(function (item) {
    return '<a href="' + item.ticketUrl + '" class="event-row" aria-label="' + item.title + ' – ' + CN.t('buyTicketsAria') + '">' +
      '<img src="' + item.img + '" alt="' + item.title + '">' +
      '<div class="body">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="sub">' + item.desc + '</p>' +
        '<ul>' +
          '<li><svg class="icon" width="14" height="14"><use href="#i-calendar"></use></svg>' + item.dateFull + '</li>' +
          '<li><svg class="icon" width="14" height="14"><use href="#i-pin"></use></svg>' + item.venue + '</li>' +
        '</ul>' +
      '</div>' +
    '</a>';
  }).join('');

  /* ---- Gallery teaser (drag-scroll marquee) ---- */
  var TEASER_IDS = ['jarni', 'advent', 'serenada', 'film', 'zakulisi', 'general'];
  var teaserAlbums = TEASER_IDS.map(function (id) {
    return CN.ALBUMS.filter(function (a) { return a.id === id; })[0];
  }).filter(Boolean);

  function teaserCard(a, dup) {
    return '<a href="' + CN.url('gallery') + '#album/' + a.id + '" class="genre-card"' +
      (dup ? ' aria-hidden="true" tabindex="-1"' : '') + '>' +
      '<div class="thumb"><img src="' + a.photos[0] + '" alt="' + a.name + '" loading="lazy" draggable="false"></div>' +
      '<p>' + a.name + '</p></a>';
  }

  var teaserSet = function (dup) {
    return teaserAlbums.map(function (a) { return teaserCard(a, dup); }).join('');
  };
  var genreRow = document.getElementById('genreRow');
  genreRow.innerHTML =
    '<div class="genre-track">' + teaserSet(false) + teaserSet(true) + '</div>';

  /* Auto-scrolling marquee that the user can also grab and fling.
     Two identical card sets → seamless infinite wrap in both directions.
     Flick has momentum; when it eases back to marquee speed, auto-scroll
     resumes immediately (no pause). Hover pauses on mouse. */
  (function initGenreMarquee() {
    var track = genreRow.querySelector('.genre-track');
    if (!track) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; /* CSS shows a static wrapped grid instead */
    }

    var setWidth = 0, speed = 0;
    function measure() {
      setWidth = track.scrollWidth / 2;           /* width of one card set */
      speed = setWidth ? setWidth / 48000 : 0;    /* px per ms → ~48s per loop */
    }
    measure();
    window.addEventListener('load', measure);

    var offset = 0;        /* px scrolled left, kept in [0, setWidth) */
    var state = 'auto';    /* 'auto' | 'drag' | 'inertia' */
    var hovering = false;
    var dragId = null, startX = 0, startOffset = 0, moved = 0;
    var lastX = 0, lastT = 0, vel = 0;   /* vel: offset-px per ms */

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
      offset = wrap(startOffset - dx);            /* drag right → earlier cards */
      apply();
      var dt = e.timeStamp - lastT;
      if (dt > 0) {
        var inst = -(e.clientX - lastX) / dt;
        vel = vel * 0.7 + inst * 0.3;             /* smoothed velocity */
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

    /* A real drag must not also trigger the card's link. */
    genreRow.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    genreRow.addEventListener('dragstart', function (e) { e.preventDefault(); });

    var prev = null;
    function frame(now) {
      if (prev == null) prev = now;
      var dt = now - prev; if (dt > 48) dt = 48; prev = now;
      if (!setWidth) measure();
      if (setWidth) {
        if (state === 'auto') {
          if (!hovering) { offset = wrap(offset + speed * dt); apply(); }
        } else if (state === 'inertia') {
          offset = wrap(offset + vel * dt); apply();
          vel *= Math.pow(0.94, dt / 16);         /* friction (framerate-independent) */
          if (Math.abs(vel) <= speed) state = 'auto';   /* resume immediately, seamless */
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---- Hero carousel ---- */
  var row = document.getElementById('heroRow');
  var bgs = [document.getElementById('heroBg0'), document.getElementById('heroBg1'), document.getElementById('heroBg2')];
  var slides = CONCERTS.slice(0, 3);
  var active = 0;
  var timer = null;

  function renderHero() {
    bgs.forEach(function (img, i) {
      img.src = slides[i].imgWide;
      img.style.opacity = i === active ? '1' : '0';
    });
    row.innerHTML = '';
    slides.forEach(function (s, i) {
      var wrap = document.createElement('div');
      wrap.className = 'hero-slide' + (i === active ? '' : ' is-peek');
      if (i === active) {
        wrap.innerHTML =
          '<div class="hero-card">' +
            '<div class="hero-shot"><img src="' + s.imgWide + '" alt="' + s.title + '"></div>' +
            '<div class="hero-arrows">' +
              '<button type="button" class="hero-arrow" data-dir="prev" aria-label="' + CN.t('heroPrev') + '"><svg class="icon" width="20" height="20"><use href="#i-chevron-left"></use></svg></button>' +
              '<button type="button" class="hero-arrow" data-dir="next" aria-label="' + CN.t('heroNext') + '"><svg class="icon" width="20" height="20"><use href="#i-chevron-right"></use></svg></button>' +
            '</div>' +
            '<div class="progress"><span></span></div>' +
            '<div class="row"><img src="' + s.thumb + '" alt="' + s.title + '"><p>' + s.desc + '</p></div>' +
            '<h2>' + s.title + '</h2>' +
            '<ul>' +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + s.dateFull + '</li>' +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-pin"></use></svg>' + s.venue + '</li>' +
            '</ul>' +
            '<a href="' + CN.url('concerts') + '" class="btn btn-blue">' + CN.t('concertDetail') + ' <span>→</span></a>' +
          '</div>';
        var prev = wrap.querySelector('.hero-arrow[data-dir="prev"]');
        var next = wrap.querySelector('.hero-arrow[data-dir="next"]');
        prev.addEventListener('click', function () { go((active - 1 + slides.length) % slides.length); });
        next.addEventListener('click', function () { go((active + 1) % slides.length); });
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-peek';
        btn.innerHTML = '<img src="' + s.thumb + '" alt="' + s.title + '"><p>' + s.desc + '</p>';
        btn.addEventListener('click', function () { go(i); });
        wrap.appendChild(btn);
      }
      row.appendChild(wrap);
    });
  }

  function startTimer() {
    clearInterval(timer);
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
