(function () {
  var CN = window.CN;

  var ALBUMS = CN.ALBUMS;
  function albumById(id) {
    for (var i = 0; i < ALBUMS.length; i++) if (ALBUMS[i].id === id) return ALBUMS[i];
    return null;
  }

  var VIDEOS = [
    { id: 'vltava', title: CN.t('videoVltava'), dur: '4:12', thumb: CN.galleryImg(3, 700, 394) },
    { id: 'priprava', title: CN.t('videoBackstage'), dur: '2:45', thumb: CN.galleryImg(16, 700, 394) },
    { id: 'novosvetska', title: CN.t('videoNewWorld'), dur: '6:30', thumb: CN.galleryImg(5, 700, 394) }
  ];

  var FILTERS = [
    { key: 'all', label: CN.t('filterAll') },
    { key: 'koncerty', label: CN.t('filterConcerts') },
    { key: 'zkousky', label: CN.t('filterRehearsals') },
    { key: 'videa', label: CN.t('filterVideos') }
  ];
  var VISIBLE_COUNT = 6;
  var state = { filter: 'all', expanded: false, lb: null };

  var galleryView = document.getElementById('galleryView');
  var albumView = document.getElementById('albumView');

  document.getElementById('heroImg').src = CN.img('orchestra', 2, 1920, 1080);

  function scrollTop() { window.scrollTo(0, 0); }

  /* ---------------- gallery index ---------------- */
  function renderFilters() {
    document.getElementById('filterRow').innerHTML = FILTERS.map(function (f) {
      var active = state.filter === f.key;
      return '<button type="button" class="filter-pill' + (active ? ' is-active' : '') + '" data-filter="' + f.key + '">' + f.label + '</button>';
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
        '<img src="' + a.cover + '" alt="' + a.name + '" loading="lazy">' +
        '<span class="cat-badge">' + a.cat + '</span>' +
        '<span class="count-badge">' + a.count + ' ' + CN.t('photosCount') + '</span>' +
      '</div>' +
      '<div class="body"><h3>' + a.name + '</h3><p class="date">' + a.date + '</p></div>' +
    '</a>';
  }
  function videoCardHtml(v) {
    return '<a href="#" class="video-card" data-play="' + v.id + '">' +
      '<div class="thumb">' +
        '<img src="' + v.thumb + '" alt="' + v.title + '" loading="lazy">' +
        '<div class="scrim"></div>' +
        '<span class="play-btn"><svg class="icon" width="20" height="20" style="color:#003FFF"><use href="#i-play"></use></svg></span>' +
        '<span class="dur-badge">' + v.dur + '</span>' +
      '</div>' +
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
      videosSection.style.display = 'none';
    } else {
      videosGridMain.style.display = 'none';
      albumsGrid.style.display = 'grid';
      var filtered = state.filter === 'all' ? ALBUMS : ALBUMS.filter(function (a) { return a.group === state.filter; });
      var visible = state.expanded ? filtered : filtered.slice(0, VISIBLE_COUNT);
      albumsGrid.innerHTML = visible.map(albumCardHtml).join('');
      loadWrap.hidden = state.expanded || filtered.length <= VISIBLE_COUNT;
      if (state.filter === 'all') {
        videosSection.style.display = 'block';
        document.getElementById('videosGrid').innerHTML = VIDEOS.map(videoCardHtml).join('');
      } else {
        videosSection.style.display = 'none';
      }
    }
    bindGalleryClicks();
  }

  function bindGalleryClicks() {
    document.querySelectorAll('[data-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        location.hash = 'album/' + a.getAttribute('data-open');
      });
    });
    document.querySelectorAll('[data-play]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var v = VIDEOS.filter(function (x) { return x.id === a.getAttribute('data-play'); })[0];
        if (v) openVideo(v);
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
    document.getElementById('albumMeta').innerHTML =
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + a.date + '</li>' +
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-pin"></use></svg>' + CN.t('albumPlace') + '</li>' +
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-photos"></use></svg>' + a.count + ' ' + CN.t('photosCount') + '</li>';
    document.getElementById('albumPhotosGrid').innerHTML = a.photos.map(function (src, i) {
      return '<a href="#" class="photo-tile" data-photo-i="' + i + '"><img src="' + src + '" alt="" loading="lazy"></a>';
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
      document.getElementById('lbDate').textContent = a.date + ' · ' + CN.t('albumPlace');
      document.getElementById('lbCounter').textContent = (idx + 1) + ' / ' + a.photos.length;
      document.getElementById('lbStage').innerHTML = '<img src="' + a.photos[idx] + '" alt="">';
      thumbs.innerHTML = a.photos.map(function (src, i) {
        return '<button type="button" class="' + (i === idx ? 'is-active' : '') + '" data-thumb-i="' + i + '" aria-label="' + (i + 1) + ' / ' + a.photos.length + '"' +
          (i === idx ? ' aria-current="true"' : '') + '><img src="' + src + '" alt=""></button>';
      }).join('');
      thumbs.querySelectorAll('[data-thumb-i]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          lbGo(parseInt(btn.getAttribute('data-thumb-i'), 10));
        });
      });
      /* Náhledy se překreslují — fokus z klávesnice se musí vrátit na aktivní. */
      if (thumbHadFocus) thumbs.querySelector('.is-active').focus();
      if (opening) document.getElementById('lbCloseBtn1').focus();
    } else {
      lbPhotoEl.hidden = true;
      lbVideoEl.hidden = false;
      lightbox.setAttribute('aria-labelledby', 'lbVideoTitle');
      document.getElementById('lbVideoTitle').textContent = state.lb.video.title;
      document.getElementById('lbVideoTime').textContent = '1:24 / ' + state.lb.video.dur;
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
      var items = panel.querySelectorAll('button');
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
