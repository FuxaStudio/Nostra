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
      '<a href="koncerty.html" class="btn btn-blue" style="padding:12px 22px;">Detail koncertu →</a>' +
    '</div>';

  document.getElementById('eventList').innerHTML = CONCERTS.slice(1, 9).map(function (item) {
    return '<div class="event-row">' +
      '<img src="' + item.img + '" alt="' + item.title + '">' +
      '<div class="body">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="sub">' + item.desc + '</p>' +
        '<ul>' +
          '<li><svg class="icon" width="14" height="14" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + item.dateFull + '</li>' +
          '<li><svg class="icon" width="14" height="14" style="color:#003FFF"><use href="#i-pin"></use></svg>' + item.venue + '</li>' +
        '</ul>' +
      '</div>' +
    '</div>';
  }).join('');

  /* ---- Genre / gallery teaser ---- */
  document.getElementById('genreRow').innerHTML = CN.GENRES.map(function (g) {
    return '<a href="galerie.html" class="genre-card"><div class="thumb"><img src="' + g.img + '" alt="' + g.label + '" loading="lazy"></div><p>' + g.label + '</p></a>';
  }).join('');

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
      wrap.className = 'hero-slide';
      if (i === active) {
        wrap.innerHTML =
          '<div class="hero-card">' +
            '<div class="progress"><span></span></div>' +
            '<div class="row"><img src="' + s.thumb + '" alt="' + s.title + '"><p>' + s.desc + '</p></div>' +
            '<h2>' + s.title + '</h2>' +
            '<ul>' +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + s.dateFull + '</li>' +
              '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-pin"></use></svg>' + s.venue + '</li>' +
            '</ul>' +
            '<a href="koncerty.html" class="btn btn-blue">Detail koncertu <span>→</span></a>' +
          '</div>';
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
