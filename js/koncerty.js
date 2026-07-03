(function () {
  var CN = window.CN;
  var upcoming = CN.CONCERTS;
  var hero = upcoming[0];
  var grid = upcoming.slice(1);
  var INITIAL_COUNT = 6;
  var expanded = false;

  document.getElementById('heroImg').src = hero.imgWide;

  document.getElementById('heroCard').innerHTML =
    '<h1>' + hero.title + '</h1>' +
    '<p class="desc">' + hero.desc + '</p>' +
    '<ul>' +
      '<li><svg class="icon" width="18" height="18" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + hero.dateFull + ' · ' + hero.time + '</li>' +
      '<li><svg class="icon" width="18" height="18" style="color:#003FFF"><use href="#i-pin"></use></svg>' + hero.venue + '</li>' +
    '</ul>' +
    '<a href="#" class="btn btn-blue">Vstupenky <span>↗</span></a>';

  function cardHtml(c) {
    return (
      '<a href="#" class="concert-card">' +
        '<div class="thumb">' +
          '<img src="' + c.img + '" alt="' + c.title + '" loading="lazy">' +
          '<span class="date-pill">' + c.date + '</span>' +
        '</div>' +
        '<div class="body">' +
          '<h3>' + c.title + '</h3>' +
          '<ul>' +
            '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-clock"></use></svg>' + c.time + '</li>' +
            '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-pin"></use></svg>' + c.venue + '</li>' +
          '</ul>' +
          '<p class="desc">' + c.desc + '</p>' +
          '<span class="ticket-pill">Vstupenky <span>↗</span></span>' +
        '</div>' +
      '</a>'
    );
  }

  function renderGrid() {
    var visible = expanded ? grid : grid.slice(0, INITIAL_COUNT);
    document.getElementById('concertsGrid').innerHTML = visible.map(cardHtml).join('');
    document.getElementById('loadMoreWrap').hidden = expanded || grid.length <= INITIAL_COUNT;
  }
  renderGrid();

  document.getElementById('loadMoreBtn').addEventListener('click', function () {
    expanded = true;
    renderGrid();
  });

  /* ---- Archive ---- */
  document.getElementById('archiveGrid').innerHTML = CN.PAST.map(function (p) {
    return (
      '<a href="galerie.html" class="archive-card">' +
        '<div class="thumb">' +
          '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy">' +
          '<div class="tint"></div>' +
          '<span class="done-badge"><svg class="icon" width="11" height="11"><use href="#i-check"></use></svg>proběhlo</span>' +
        '</div>' +
        '<p class="date">' + p.date + '</p>' +
        '<h3>' + p.title + '</h3>' +
      '</a>'
    );
  }).join('');
})();
