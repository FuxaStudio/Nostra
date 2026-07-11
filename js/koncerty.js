(function () {
  var CN = window.CN;
  var upcoming = CN.CONCERTS;
  var grid = upcoming;
  var INITIAL_COUNT = 6;
  var expanded = false;

  document.getElementById('heroImg').src = CN.img('orchestra', 9, 1920, 1080);

  function cardHtml(c) {
    return (
      '<a href="' + c.ticketUrl + '" class="concert-card">' +
        '<div class="thumb">' +
          '<img src="' + c.img + '" alt="' + c.title + '" loading="lazy">' +
        '</div>' +
        '<div class="body">' +
          '<h3>' + c.title + '</h3>' +
          '<ul>' +
            '<li><svg class="icon" width="15" height="15" style="color:#003FFF"><use href="#i-calendar"></use></svg>' + c.dateFull + '</li>' +
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
        '</div>' +
        '<p class="date">' + p.date + '</p>' +
        '<h3>' + p.title + '</h3>' +
      '</a>'
    );
  }).join('');
})();
