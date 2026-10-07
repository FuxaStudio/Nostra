(function () {
  var CN = window.CN;

  /* Stránka Koncerty v obou jazycích (koncerty.html, en/concerts.html);
     texty přes CN.t, data z js/data.js. */
  /* ---- Rozdělení na nadcházející a proběhlé ----
     Koncerty z CN.CONCERTS i CN.PAST se slijí a rozdělí podle dnešního data
     (místní čas prohlížeče). V den konání je koncert ještě mezi nadcházejícími,
     den poté se sám přesune do archivu. */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var now = new Date();
  var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

  var seen = {};
  var all = CN.CONCERTS.concat(CN.PAST).filter(function (c) {
    var key = c.iso + '|' + c.place;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
  function byIso(a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0; }
  var upcoming = all.filter(function (c) { return c.iso >= today; }).sort(byIso);
  var past = all.filter(function (c) { return c.iso < today; }).sort(byIso).reverse();

  /* ---- Pomocné funkce ---- */
  var WEEKDAYS = CN.t('weekdays').split(',');
  var NEW_WINDOW = '<span class="sr-only">' + CN.t('newWindow') + '</span>';
  function icon(id) {
    return '<svg class="icon" width="15" height="15" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* Nezlomitelná mezera po jednopísmenných předložkách/spojkách a po „sv.“ (jen čeština) */
  function nb(s) {
    if (CN.LANG === 'en') return esc(s);
    var re = /(^|[\s ])([kKsSvVzZoOuUaAiI]|sv\.)\s+/g;
    return esc(s).replace(re, '$1$2 ').replace(re, '$1$2 ');
  }
  function weekday(iso) {
    var p = iso.split('-');
    return WEEKDAYS[new Date(+p[0], +p[1] - 1, +p[2]).getDay()];
  }
  function datetime(c) { return c.iso + (c.time ? 'T' + c.time : ''); }
  /* Snímky u karet jsou ilustrační (z natáčení souboru), ne z daného koncertu. */
  function thumb(c, sizes) {
    return '<img src="' + c.img + '" srcset="' + c.img + ' 960w, ' + c.imgWide + ' 1600w" sizes="' + sizes + '"' +
      ' width="960" height="540" alt="' + esc(c.imgAlt) + '" loading="lazy">';
  }
  /* Místo konání jako odkaz na Google Mapy (CN.mapUrl v data.js). */
  function mapLink(c, cls) {
    return '<a class="' + cls + '" href="' + esc(CN.mapUrl(c)) + '" target="_blank" rel="noopener">' +
      nb(c.place) + ', ' + nb(c.town) + '<span class="sr-only">' + CN.t('mapHint') + '</span>' + NEW_WINDOW + '</a>';
  }

  /* ---- Nadcházející koncerty: karty ----
     Stejné jako na úvodní stránce. Karta není celá odkazem, protože nese dvě
     akce: událost (jen kde existuje) a uložení do kalendáře (CN.calendarUrl). */
  function cardHtml(c) {
    return (
      '<article class="concert-card koncerty-card">' +
        '<div class="thumb">' + thumb(c, '(max-width: 760px) 100vw, (max-width: 1140px) 50vw, 460px') + '</div>' +
        '<div class="body">' +
          '<h3>' + nb(c.title || c.town) + '</h3>' +
          (c.subtitle ? '<p class="koncerty-card__sub">' + nb(c.subtitle) + '</p>' : '') +
          '<ul>' +
            '<li>' + icon('calendar') + '<time datetime="' + datetime(c) + '">' +
              weekday(c.iso) + ' ' + c.dateFull + (c.time ? ', ' + c.time : '') + '</time></li>' +
            '<li>' + icon('pin') + mapLink(c, 'koncerty-card__map') + '</li>' +
          '</ul>' +
          '<div class="koncerty-card__actions">' +
            (c.url ? '<a class="btn btn-blue" href="' + esc(c.url) + '" target="_blank" rel="noopener">' +
              esc(c.urlLabel || CN.t('details')) + ' <span class="arrow-ne" aria-hidden="true">↗</span>' + NEW_WINDOW + '</a>' : '') +
            '<a class="btn btn-outline" ' + CN.calendarAttrs(c) + '>' +
              icon('calendar') + CN.t('addToCalendar') + '</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  document.getElementById('concertsGrid').innerHTML = upcoming.map(cardHtml).join('');
  document.getElementById('concertsGrid').hidden = !upcoming.length;
  document.getElementById('concertsEmpty').hidden = !!upcoming.length;

  /* ---- Archiv: menší karty, ilustrační snímek ztlumený do šeda ----
     Karta není celá odkazem: místo vede na Mapy, případně odkaz na pořadatele –
     oba jsou samostatné odkazy, takže jdou ovládat klávesnicí. Do kalendáře ne,
     koncert už proběhl. Koncert bez názvu (Dvakačovice, Semily) má jako nadpis obec. */
  function archiveHtml(c) {
    return (
      '<article class="archive-card koncerty-archive-card">' +
        '<div class="thumb">' + thumb(c, '(max-width: 560px) 50vw, 340px') + '<div class="tint"></div></div>' +
        '<p class="date"><time datetime="' + c.iso + '">' + c.dateFull + '</time></p>' +
        '<h3>' + nb(c.title || c.town) + '</h3>' +
        (c.subtitle ? '<p class="ac-meta">' + nb(c.subtitle) + '</p>' : '') +
        '<p class="ac-place">' + mapLink(c, 'ac-map') + '</p>' +
        (c.url ? '<a class="ac-link" href="' + esc(c.url) + '" target="_blank" rel="noopener">' +
          esc(c.urlLabel || CN.t('details')) + ' <span aria-hidden="true">↗</span>' + NEW_WINDOW + '</a>' : '') +
      '</article>'
    );
  }

  document.getElementById('archiveGrid').innerHTML = past.map(archiveHtml).join('');
  /* Bez proběhlých koncertů (nemělo by nastat) celou sekci schovat. */
  document.getElementById('archiveGrid').closest('section').hidden = !past.length;

  /* ---- Strukturovaná data pro vyhledávače (schema.org MusicEvent) ----
     Jen údaje z data.js; vstupné se neuvádí, protože není potvrzené. */
  if (upcoming.length) {
    var ld = upcoming.map(function (c) {
      var ev = {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: (c.title || CN.t('concertFallback')) + (c.subtitle ? ' – ' + c.subtitle : '') + ' | Capella Nostra',
        startDate: c.time ? c.iso + 'T' + c.time : c.iso,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: c.place,
          address: { '@type': 'PostalAddress', addressLocality: c.town, addressCountry: 'CZ' }
        },
        performer: { '@type': 'MusicGroup', name: 'Capella Nostra' }
      };
      if (c.url) ev.url = c.url;
      return ev;
    });
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
})();
