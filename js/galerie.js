(function () {
  var CN = window.CN;

  var ALBUMS = CN.ALBUMS;
  function albumById(id) {
    for (var i = 0; i < ALBUMS.length; i++) if (ALBUMS[i].id === id) return ALBUMS[i];
    return null;
  }

  /* ---- Videa ----
     Pět skladeb z natáčení. Vlastní YouTube kanál zatím není: video bez
     `youtube` (ID z adresy youtube.com/watch?v=<ID>) má na kartě štítek
     „Brzy na YouTube“ a v okně místo přehrávače jen náhled se stejnou větou.
     Po nahrání stačí doplnit ID (a případně `dur`, délku podle YouTube,
     např. '3:29'). Přehrává se přes youtube-nocookie.com až po kliknutí –
     do té doby web na YouTube nic nenačítá.
     Náhledy jsou z videa, ke kterému patří (16 = video 01, 28 = 02, smyčce ve
     tmě = 04), a liší se od obálek alb i hera, aby se na stránce neopakovaly. */
  var V = CN.LANG === 'en' ? 1 : 0;   /* index jazyka v [cs, en] */
  var VIDEOS = [
    { id: 'fischer-marche', composer: 'J. C. F. Fischer', title: ['Marche C dur', 'March in C major'][V],
      youtube: null, dur: null, poster: CN.photo.still('16-housle-u-pultu', 960), posterFull: CN.photo.still('16-housle-u-pultu', 1600) },
    { id: 'fischer-ouverture', composer: 'J. C. F. Fischer', title: 'Ouverture',
      youtube: null, dur: null, poster: CN.photo.still('28-soubor-presbytar-zboku', 960), posterFull: CN.photo.still('28-soubor-presbytar-zboku', 1600) },
    { id: 'vivaldi-rv439-allegro', composer: 'A. Vivaldi',
      title: ['Koncert pro flétnu a orchestr g moll RV 439 – Allegro', 'Flute Concerto in G minor, RV 439 – Allegro'][V],
      youtube: null, dur: null, poster: CN.photo('galerie/cembalo-pult-celek-960.webp'), posterFull: CN.photo('galerie/cembalo-pult-celek-1600.webp') },
    { id: 'vivaldi-rv439-largo', composer: 'A. Vivaldi',
      title: ['Koncert pro flétnu a orchestr g moll RV 439 – Largo', 'Flute Concerto in G minor, RV 439 – Largo'][V],
      youtube: null, dur: null, poster: CN.photo('galerie/housle-tma-smycce-960.webp'), posterFull: CN.photo('galerie/housle-tma-smycce-1600.webp') },
    { id: 'vivaldi-hoboj-housle', composer: 'A. Vivaldi',
      title: ['Koncert pro hoboj a housle – Allegro', 'Concerto for oboe and violin – Allegro'][V],
      youtube: null, dur: null, poster: CN.photo('galerie/hoboj-housle-solo-960.webp'), posterFull: CN.photo('galerie/hoboj-housle-solo-1600.webp') }
  ];

  /* Filtry mají smysl až u většího počtu alb – jinak se celý pruh skryje. */
  var VISIBLE_COUNT = 6;
  var FILTERS = [{ key: 'all', label: CN.t('filterAll') }];
  ALBUMS.forEach(function (a) {
    if (FILTERS.some(function (f) { return f.key === a.group; })) return;
    FILTERS.push({ key: a.group, label: a.cat });
  });
  if (VIDEOS.length) FILTERS.push({ key: 'videa', label: CN.t('filterVideos') });
  var SHOW_FILTERS = ALBUMS.length > VISIBLE_COUNT && FILTERS.length > 2;

  var state = { filter: 'all', expanded: false, lb: null };

  var galleryView = document.getElementById('galleryView');
  var albumView = document.getElementById('albumView');
  var filtersSection = document.querySelector('.filters');
  if (filtersSection) filtersSection.hidden = !SHOW_FILTERS;

  function scrollTop() { window.scrollTo(0, 0); }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function photoCount(n) {
    if (CN.LANG === 'en') return n + ' ' + (n === 1 ? 'photo' : 'photos');
    return n + ' ' + (n === 1 ? 'fotka' : n > 1 && n < 5 ? 'fotky' : 'fotek');
  }
  function thumbOf(a, i) { return (a.thumbs && a.thumbs[i]) || a.photos[i]; }
  function altOf(a, i) { return (a.alts && a.alts[i]) || ''; }

  /* ---------------- gallery index ---------------- */
  function renderFilters() {
    if (!SHOW_FILTERS) return;
    document.getElementById('filterRow').innerHTML = FILTERS.map(function (f) {
      var active = state.filter === f.key;
      return '<button type="button" class="btn btn-outline filter-pill' + (active ? ' is-active' : '') + '" data-filter="' + f.key + '"' +
        ' aria-pressed="' + active + '">' + f.label + '</button>';
    }).join('');
    document.querySelectorAll('#filterRow [data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.getAttribute('data-filter');
        state.expanded = false;
        renderGalleryBody();
      });
    });
  }

  function albumCardHtml(a) {
    return '<a href="#album/' + a.id + '" class="album-card" data-open="' + a.id + '">' +
      '<div class="thumb">' +
        '<img src="' + a.cover + '" alt="" loading="lazy">' +
        '<span class="cat-badge">' + a.cat + '</span>' +
        '<span class="count-badge">' + photoCount(a.count) + '</span>' +
      '</div>' +
      '<div class="body"><h3>' + a.name + '</h3>' +
        (a.date ? '<p class="date">' + a.date + '</p>' : '') +
        (a.desc ? '<p class="album-desc">' + a.desc + '</p>' : '') +
      '</div>' +
    '</a>';
  }
  function videoCardHtml(v) {
    var label = v.composer + ' – ' + v.title;
    var href = v.youtube ? 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.youtube) : '#';
    return '<a href="' + href + '" class="video-card' + (v.youtube ? '' : ' is-soon') + '" data-play="' + v.id + '"' +
      ' aria-label="' + (v.youtube ? CN.t('videoPlay') : CN.t('videoSoonAria')) + esc(label) + '">' +
      '<div class="thumb">' +
        '<img src="' + v.poster + '" alt="" loading="lazy">' +
        '<div class="scrim"></div>' +
        '<span class="play-btn" aria-hidden="true"><svg class="icon" width="20" height="20" style="color:#003FFF"><use href="#i-play"></use></svg></span>' +
        (v.dur ? '<span class="dur-badge">' + v.dur + '</span>' : '') +
        (v.youtube ? '' : '<span class="dur-badge">' + CN.t('videoSoon') + '</span>') +
      '</div>' +
      '<p class="composer">' + v.composer + '</p>' +
      '<h3>' + v.title + '</h3>' +
    '</a>';
  }

  function renderGalleryBody() {
    renderFilters();
    var albumsGrid = document.getElementById('albumsGrid');
    var videosGridMain = document.getElementById('videosGridMain');
    var loadWrap = document.getElementById('loadMoreAlbumsWrap');
    var videosSection = document.getElementById('videosSection');

    if (state.filter === 'videa') {
      albumsGrid.style.display = 'none';
      loadWrap.hidden = true;
      videosGridMain.style.display = 'grid';
      videosGridMain.innerHTML = VIDEOS.map(videoCardHtml).join('');
      videosSection.hidden = true;
    } else {
      videosGridMain.style.display = 'none';
      albumsGrid.style.display = 'grid';
      var filtered = state.filter === 'all' ? ALBUMS : ALBUMS.filter(function (a) { return a.group === state.filter; });
      var visible = state.expanded ? filtered : filtered.slice(0, VISIBLE_COUNT);
      albumsGrid.innerHTML = visible.map(albumCardHtml).join('');
      loadWrap.hidden = state.expanded || filtered.length <= VISIBLE_COUNT;
      var showVideos = state.filter === 'all' && VIDEOS.length > 0;
      videosSection.hidden = !showVideos;
      videosSection.style.display = '';
      if (showVideos) document.getElementById('videosGrid').innerHTML = VIDEOS.map(videoCardHtml).join('');
    }
    bindGalleryClicks();
  }

  function lbPlayerEl() { return document.getElementById('lbPlayer'); }

  function bindGalleryClicks() {
    document.querySelectorAll('[data-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        location.hash = 'album/' + a.getAttribute('data-open');
      });
    });
    document.querySelectorAll('[data-play]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var v = VIDEOS.filter(function (x) { return x.id === a.getAttribute('data-play'); })[0];
        if (!v || !lbPlayerEl()) return; /* bez přehrávače otevře YouTube */
        e.preventDefault();
        openVideo(v);
      });
    });
  }

  document.getElementById('loadMoreAlbumsBtn').addEventListener('click', function () {
    state.expanded = true;
    renderGalleryBody();
  });

  /* ---------------- album detail ---------------- */
  function renderAlbum(id) {
    var a = albumById(id) || ALBUMS[0];
    document.getElementById('albumKicker').textContent = CN.t('albumKicker') + ' · ' + a.cat;
    document.getElementById('albumTitle').textContent = a.name;
    var desc = document.getElementById('albumDesc');
    if (desc) desc.textContent = a.desc || '';
    document.getElementById('albumMeta').innerHTML =
      (a.date ? '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + a.date + '</li>' : '') +
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-photos"></use></svg>' + photoCount(a.count) + '</li>';
    document.getElementById('albumPhotosGrid').innerHTML = a.photos.map(function (src, i) {
      return '<a href="' + src + '" class="photo-tile" data-photo-i="' + i + '">' +
        '<img src="' + thumbOf(a, i) + '" alt="' + esc(altOf(a, i)) + '" loading="lazy"></a>';
    }).join('');
    document.querySelectorAll('[data-photo-i]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPhoto(a.id, parseInt(el.getAttribute('data-photo-i'), 10));
      });
    });
  }

  document.getElementById('backToGallery').addEventListener('click', function (e) {
    e.preventDefault();
    location.hash = '';
  });

  /* ---------------- hash routing ---------------- */
  function sync() {
    var h = location.hash.replace(/^#/, '');
    var m = /^album\/(.+)$/.exec(h);
    var id = m ? decodeURIComponent(m[1]) : null;
    if (id && albumById(id)) {
      galleryView.hidden = true;
      albumView.hidden = false;
      renderAlbum(id);
    } else {
      albumView.hidden = true;
      galleryView.hidden = false;
      renderGalleryBody();
    }
    scrollTop();
  }
  window.addEventListener('hashchange', sync);
  sync();

  /* ---------------- lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lbPhotoEl = document.getElementById('lbPhoto');
  var lbVideoEl = document.getElementById('lbVideo');
  var lbPlayer = document.getElementById('lbPlayer');

  function openPhoto(albumId, i) {
    state.lb = { kind: 'photo', albumId: albumId, i: i };
    renderLightbox();
  }
  function openVideo(v) {
    state.lb = { kind: 'video', video: v };
    renderLightbox();
  }
  /* Prvek, ze kterého se lightbox otevřel — po zavření se na něj vrátí fokus. */
  var lastFocus = null;

  function closeLb() {
    state.lb = null;
    lightbox.classList.remove('is-open');
    lbPhotoEl.hidden = true;
    lbVideoEl.hidden = true;
    if (lbPlayer) lbPlayer.innerHTML = ''; /* zastaví přehrávání */
    document.body.style.overflow = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }
  function lbPrev() {
    if (!state.lb || state.lb.kind !== 'photo') return;
    var a = albumById(state.lb.albumId);
    var n = a.photos.length;
    state.lb.i = (state.lb.i - 1 + n) % n;
    renderLightbox();
  }
  function lbNext() {
    if (!state.lb || state.lb.kind !== 'photo') return;
    var a = albumById(state.lb.albumId);
    var n = a.photos.length;
    state.lb.i = (state.lb.i + 1) % n;
    renderLightbox();
  }
  function lbGo(i) {
    if (!state.lb) return;
    state.lb.i = i;
    renderLightbox();
  }

  function renderLightbox() {
    if (!state.lb) return;
    var opening = !lightbox.classList.contains('is-open');
    if (opening) lastFocus = document.activeElement;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden'; /* zámek scrollu pod lightboxem */
    if (state.lb.kind === 'photo') {
      lbPhotoEl.hidden = false;
      lbVideoEl.hidden = true;
      lightbox.setAttribute('aria-labelledby', 'lbTitle');
      var a = albumById(state.lb.albumId);
      var idx = Math.max(0, Math.min(state.lb.i, a.photos.length - 1));
      var thumbs = document.getElementById('lbThumbs');
      var thumbHadFocus = thumbs.contains(document.activeElement);
      document.getElementById('lbTitle').textContent = a.name;
      document.getElementById('lbDate').textContent = [a.date, a.cat].filter(Boolean).join(' · ');
      document.getElementById('lbCounter').textContent = (idx + 1) + ' / ' + a.photos.length;
      document.getElementById('lbStage').innerHTML = '<img src="' + a.photos[idx] + '" alt="' + esc(altOf(a, idx)) + '">';
      thumbs.innerHTML = a.photos.map(function (src, i) {
        return '<button type="button" class="' + (i === idx ? 'is-active' : '') + '" data-thumb-i="' + i + '" aria-label="' + (i + 1) + ' / ' + a.photos.length + '"' +
          (i === idx ? ' aria-current="true"' : '') + '><img src="' + thumbOf(a, i) + '" alt="" loading="lazy"></button>';
      }).join('');
      thumbs.querySelectorAll('[data-thumb-i]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          lbGo(parseInt(btn.getAttribute('data-thumb-i'), 10));
        });
      });
      /* Náhledy se překreslují — fokus z klávesnice se musí vrátit na aktivní. */
      if (thumbHadFocus) thumbs.querySelector('.is-active').focus();
      var active = thumbs.querySelector('.is-active');
      if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });
      if (opening) document.getElementById('lbCloseBtn1').focus();
    } else {
      var v = state.lb.video;
      lbPhotoEl.hidden = true;
      lbVideoEl.hidden = false;
      lightbox.setAttribute('aria-labelledby', 'lbVideoTitle');
      document.getElementById('lbVideoTitle').textContent = v.composer + ' – ' + v.title;
      if (opening && lbPlayer && v.youtube) {
        lbPlayer.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtube) +
          '?autoplay=1&rel=0" title="' + esc(v.composer + ' – ' + v.title) + '"' +
          ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>';
      } else if (opening && lbPlayer) {
        /* Video ještě není na YouTube: náhled ve stejném rámu, kde se pak přehraje. */
        lbPlayer.innerHTML = '<img src="' + (v.posterFull || v.poster) + '" alt="">' +
          '<div class="player-soon"><span class="play-btn" aria-hidden="true"><svg class="icon" width="26" height="26" style="color:#003FFF"><use href="#i-play"></use></svg></span>' +
          '<p>' + CN.t('videoSoonText') + '</p></div>';
      }
      if (opening) document.getElementById('lbCloseBtn2').focus();
    }
  }

  /* Na dotykových displejích se mezi fotkami listuje tahem prstu do strany. */
  var lbBody = lbPhotoEl.querySelector('.lb-body');
  var touchX = null, touchY = 0;
  lbBody.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { touchX = null; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  lbBody.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) lbNext(); else lbPrev();
    }
  }, { passive: true });

  lightbox.addEventListener('click', closeLb);
  lbPhotoEl.addEventListener('click', function (e) { e.stopPropagation(); });
  lbVideoEl.addEventListener('click', function (e) { e.stopPropagation(); });
  document.getElementById('lbCloseBtn1').addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
  document.getElementById('lbCloseBtn2').addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
  document.getElementById('lbPrevBtn').addEventListener('click', function (e) { e.stopPropagation(); lbPrev(); });
  document.getElementById('lbNextBtn').addEventListener('click', function (e) { e.stopPropagation(); lbNext(); });

  document.addEventListener('keydown', function (e) {
    if (!state.lb) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'Tab') {
      /* Fokus zůstává uvnitř otevřeného lightboxu (je to modální dialog). */
      var panel = state.lb.kind === 'photo' ? lbPhotoEl : lbVideoEl;
      var items = panel.querySelectorAll('button, iframe');
      var first = items[0], last = items[items.length - 1];
      if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    else if (state.lb.kind === 'photo') {
      if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
    }
  });
})();
