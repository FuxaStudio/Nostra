(function () {
  var CN = window.CN;

  var ALBUMS = [
    { id: 'jarni', name: 'Jarní koncert', date: '6. 7. 2026', cat: 'Koncerty', group: 'koncerty', count: 12, off: 0 },
    { id: 'advent', name: 'Adventní koncert v katedrále', date: '15. 12. 2025', cat: 'Koncerty', group: 'koncerty', count: 9, off: 7 },
    { id: 'serenada', name: 'Letní serenáda na zámku', date: '2. 8. 2025', cat: 'Koncerty', group: 'koncerty', count: 8, off: 13 },
    { id: 'film', name: 'Filmová hudba LIVE', date: '19. 4. 2025', cat: 'Koncerty', group: 'koncerty', count: 11, off: 9 },
    { id: 'novorocni', name: 'Novoroční koncert', date: '1. 1. 2025', cat: 'Koncerty', group: 'koncerty', count: 10, off: 10 },
    { id: 'komorni', name: 'Komorní večer', date: '14. 2. 2025', cat: 'Koncerty', group: 'koncerty', count: 7, off: 6 },
    { id: 'general', name: 'Generální zkouška: Dvořák', date: '28. 6. 2025', cat: 'Zkoušky', group: 'zkousky', count: 6, off: 16 },
    { id: 'zakulisi', name: 'Zákulisí jarního turné', date: 'květen 2025', cat: 'Zákulisí', group: 'zkousky', count: 9, off: 18 },
    { id: 'zkousky2526', name: 'Zkoušky na sezónu 25/26', date: 'září 2025', cat: 'Zkoušky', group: 'zkousky', count: 8, off: 4 }
  ];
  ALBUMS.forEach(function (a) {
    a.cover = CN.galleryImg(a.off, 700, 525);
    a.photos = [];
    for (var k = 0; k < a.count; k++) a.photos.push(CN.galleryImg(a.off + k, 800, 800));
  });
  function albumById(id) {
    for (var i = 0; i < ALBUMS.length; i++) if (ALBUMS[i].id === id) return ALBUMS[i];
    return null;
  }

  var VIDEOS = [
    { id: 'vltava', title: 'Smetana — Vltava (živě z katedrály)', dur: '4:12', thumb: CN.galleryImg(3, 700, 394) },
    { id: 'priprava', title: 'Zákulisí: příprava na jarní koncert', dur: '2:45', thumb: CN.galleryImg(16, 700, 394) },
    { id: 'novosvetska', title: 'Dvořák — Novosvětská, finále', dur: '6:30', thumb: CN.galleryImg(5, 700, 394) }
  ];

  var FILTERS = [
    { key: 'all', label: 'Vše' },
    { key: 'koncerty', label: 'Koncerty' },
    { key: 'zkousky', label: 'Zkoušky & zákulisí' },
    { key: 'videa', label: 'Videa' }
  ];
  var VISIBLE_COUNT = 6;
  var state = { filter: 'all', expanded: false, lb: null };

  var galleryView = document.getElementById('galleryView');
  var albumView = document.getElementById('albumView');

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
        '<span class="count-badge">' + a.count + ' fotek</span>' +
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
    document.getElementById('albumKicker').textContent = 'Album · ' + a.cat;
    document.getElementById('albumTitle').textContent = a.name;
    document.getElementById('albumMeta').innerHTML =
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + a.date + '</li>' +
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-pin"></use></svg>Lukavice</li>' +
      '<li><svg class="icon" width="16" height="16" style="color:#003FFF"><use href="#i-photos"></use></svg>' + a.count + ' fotek</li>';
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
  function closeLb() {
    state.lb = null;
    lightbox.classList.remove('is-open');
    lbPhotoEl.hidden = true;
    lbVideoEl.hidden = true;
    document.body.style.overflow = '';
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
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden'; /* zámek scrollu pod lightboxem */
    if (state.lb.kind === 'photo') {
      lbPhotoEl.hidden = false;
      lbVideoEl.hidden = true;
      var a = albumById(state.lb.albumId);
      var idx = Math.max(0, Math.min(state.lb.i, a.photos.length - 1));
      document.getElementById('lbTitle').textContent = a.name;
      document.getElementById('lbDate').textContent = a.date + ' · Lukavice';
      document.getElementById('lbCounter').textContent = (idx + 1) + ' / ' + a.photos.length;
      document.getElementById('lbStage').innerHTML = '<img src="' + a.photos[idx] + '" alt="">';
      document.getElementById('lbThumbs').innerHTML = a.photos.map(function (src, i) {
        return '<button type="button" class="' + (i === idx ? 'is-active' : '') + '" data-thumb-i="' + i + '"><img src="' + src + '" alt=""></button>';
      }).join('');
      document.querySelectorAll('#lbThumbs [data-thumb-i]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          lbGo(parseInt(btn.getAttribute('data-thumb-i'), 10));
        });
      });
    } else {
      lbPhotoEl.hidden = true;
      lbVideoEl.hidden = false;
      document.getElementById('lbVideoTitle').textContent = state.lb.video.title;
      document.getElementById('lbVideoTime').textContent = '1:24 / ' + state.lb.video.dur;
    }
  }

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
    else if (state.lb.kind === 'photo') {
      if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
    }
  });
})();
