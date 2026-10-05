/* Shared placeholder-image pool and content data used across pages.
   All photography is temporary (Unsplash placeholders) — swap for
   Capella Nostra's own photography before launch, per project handoff.

   Vyžaduje js/i18n.js (CN.LANG, CN.t) načtené dříve.

   Struktura a texty jsou záměrně oddělené: offsety fotek, počty, id a časy
   jsou zapsané jednou, jazykovou variantu mají jen slova. Nový koncert nebo
   album se tak přidává na jednom místě + dva řetězce — obě jazykové verze
   se nemohou rozejít. */
window.CN = window.CN || {};
(function (CN) {
  var LANG = CN.LANG || 'cs';

  var IDS = {
    hero: [
      '1514320291840-2e0a9bf2a9ae',
      '1506157786151-b8491531f063',
      '1493225457124-a3eb161ffa5f'
    ],
    orchestra: [
      '1551696785-927d4ac2d35b', '1465847899084-d164df4dedc6', '1488630228244-bcdf33562a43',
      '1590377894621-65093facaef0', '1519682718457-c82ce8296645', '1719753458800-c09cfb167ac5',
      '1617544517234-c436b0624a34', '1702986956144-f51b17424f1c', '1617544518238-492c0c419a6d',
      '1571299803548-831c31e293e7', '1613142659418-718b2ae6940d', '1519412666065-94acb3f8838f',
      '1509782642997-4befdc4b21c9', '1567619822659-2094d3ebef04', '1519683109079-d5f539e1542f'
    ],
    strings: [
      '1612225330812-01a9c6b355ec', '1624367171718-14026220ee35', '1460036521480-ff49c08c2781',
      '1492563817904-5f1dc687974f', '1566913485242-694e995731b4', '1701749059090-ac8afdba7b44',
      '1600537599107-1c1fc449c238', '1585263547501-7e5a0c222010', '1704961625677-dc57dcf6cef1',
      '1590594638854-19a378b6872d', '1566913485268-1287f67f87fe', '1725547827077-28ba45265794',
      '1693778201003-19a5f36e50da', '1526142684086-7ebd69df27a5', '1472312656035-eeef4726de6c'
    ],
    hall: [
      '1458639817867-2c9d4c5dcad4', '1639408396873-4a284924bc3c', '1629276301820-0f3eedc29fd0',
      '1545129139-1beb780cf337', '1615414046707-3d7d91938aa4', '1560184611-ff3e53f00e8f',
      '1574551375004-f46a1d1cca53', '1613210434051-4b00d62d03fb', '1675327161957-929e3faa37cc',
      '1574267432309-3c7d5ed31b9e', '1531660963020-52ba84d92593', '1719753457285-d61d11305aff'
    ],
    portrait: [
      '1675859427928-fe41277572b4', '1659150140178-d672b4763fd0', '1599594407616-af1c058be616',
      '1599594407558-957c79005316', '1640836907763-1028cf0df896', '1672445537316-3da6628a1096',
      '1593459866242-426f7768f3dc', '1669825097362-1dfa877e31f5', '1670743601827-a96d129e8e09',
      '1670743601886-a10cce7855d0', '1767000418433-e7e951d77c7e', '1549209486-09dafa74f944',
      '1659150140146-eccc70a8515c', '1661432432848-870f61fb4b3e', '1719977507164-932fcb300317'
    ],
    cathedral: [
      '1620574542357-31f5a14a2416', '1619508422331-606e38f1f902', '1652948701568-843ffbd8f110',
      '1619899783752-a678a3a035b5', '1625259566209-8c59614a28fa', '1610523581796-1b78a61ad668',
      '1596624647497-3501cb866911', '1600423809757-8cd9d249bd63', '1697206897349-f782a7f1ae01',
      '1635473171860-2cb787258994', '1619904252549-88d890e7455b', '1621784710359-68f1be1c46f5',
      '1634036326413-9771cead3cf5', '1688415507053-e700bec6ce64'
    ]
  };

  function idAt(cat, i) {
    var arr = IDS[cat];
    return arr[((i % arr.length) + arr.length) % arr.length];
  }
  function url(id, w, h, opts) {
    opts = opts || {};
    var p = 'w=' + w + '&h=' + h + '&fit=crop&q=' + (opts.q || 75) + '&auto=format';
    if (opts.faces) p += '&crop=faces';
    return 'https://images.unsplash.com/photo-' + id + '?' + p;
  }
  CN.img = function (cat, i, w, h, opts) { return url(idAt(cat, i), w, h, opts); };

  var GALLERY_POOL = IDS.orchestra.concat(IDS.hall, IDS.cathedral, IDS.strings);
  CN.galleryImg = function (i, w, h) {
    var id = GALLERY_POOL[((i % GALLERY_POOL.length) + GALLERY_POOL.length) % GALLERY_POOL.length];
    return url(id, w, h, { q: 75 });
  };

  var CONCERT_POOL = IDS.orchestra.concat(IDS.hall);
  function concertImg(i, w, h) {
    var id = CONCERT_POOL[((i % CONCERT_POOL.length) + CONCERT_POOL.length) % CONCERT_POOL.length];
    return url(id, w, h, { q: 75 });
  }

  function pick(table) { return table[LANG] || table.cs; }

  /* Upcoming concerts — season 2026/2027 (index 0 = soonest).
     ticketUrl: odkaz na prodej vstupenek pro daný koncert. Zatím placeholder '#'
     (proklik zůstane na stránce). Před spuštěním nahraďte reálnou URL prodejce
     vstupenek pro každý koncert zvlášť, např. 'https://goout.net/...'. */
  var CONCERT_BASE = [
    { time: '19:00', ticketUrl: '#' },
    { time: '18:30', ticketUrl: '#' },
    { time: '19:30', ticketUrl: '#' },
    { time: '19:00', ticketUrl: '#' },
    { time: '18:00', ticketUrl: '#' },
    { time: '19:00', ticketUrl: '#' },
    { time: '17:00', ticketUrl: '#' },
    { time: '18:00', ticketUrl: '#' },
    { time: '19:00', ticketUrl: '#' },
    { time: '19:00', ticketUrl: '#' }
  ];

  var CONCERT_TEXT = {
    cs: [
      { date: '12. 9.', dateFull: '12. září 2026', venue: 'Kostel sv. Mikuláše, Praha', title: 'Slavnostní zahájení sezóny', desc: 'Slavnostní zahájení nové koncertní sezóny s díly českých i světových mistrů.' },
      { date: '27. 9.', dateFull: '27. září 2026', venue: 'Zámek Lysice', title: 'Barokní perly na zámku', desc: 'Komorní program z období vrcholného baroka v jedinečných prostorách zámku.' },
      { date: '11. 10.', dateFull: '11. října 2026', venue: 'Smetanova síň, Praha', title: 'Dvořák & Smetana', desc: 'Symfonické perly dvou velikánů české hudby v podání celého souboru.' },
      { date: '25. 10.', dateFull: '25. října 2026', venue: 'Katedrála sv. Petra a Pavla, Brno', title: 'Podzimní nešpory', desc: 'Podvečerní program duchovní hudby v majestátní katedrále.' },
      { date: '8. 11.', dateFull: '8. listopadu 2026', venue: 'Chrám sv. Barbory, Kutná Hora', title: 'Svatocecilský koncert', desc: 'Koncert ke svátku patronky hudby svaté Cecílie.' },
      { date: '22. 11.', dateFull: '22. listopadu 2026', venue: 'Rudolfinum, Praha', title: 'Mozart: Requiem', desc: 'Mozartovo Requiem v podání souboru, sboru a sólistů.' },
      { date: '6. 12.', dateFull: '6. prosince 2026', venue: 'Obecní dům, Praha', title: 'Adventní koncert', desc: 'Adventní písně a koledy ve slavnostním hávu.' },
      { date: '20. 12.', dateFull: '20. prosince 2026', venue: 'Bazilika sv. Jakuba, Praha', title: 'Vánoční koncert', desc: 'Tradiční vánoční koncert plný známých melodií.' },
      { date: '6. 1.', dateFull: '6. ledna 2027', venue: 'Zrcadlová kaple, Praha', title: 'Novoroční koncert', desc: 'Slavnostní zahájení nového roku ve znamení Straussových valčíků.' },
      { date: '31. 1.', dateFull: '31. ledna 2027', venue: 'Zámek Český Krumlov', title: 'Komorní večer při svíčkách', desc: 'Intimní komorní program při svíčkách v historických sálech.' }
    ],
    en: [
      { date: '12 Sep', dateFull: '12 September 2026', venue: 'St Nicholas Church, Prague', title: 'Season Opening Gala', desc: 'A festive opening of the new concert season with works by Czech and international masters.' },
      { date: '27 Sep', dateFull: '27 September 2026', venue: 'Lysice Château', title: 'Baroque Gems at the Château', desc: 'A chamber programme from the high Baroque in the remarkable interiors of the château.' },
      { date: '11 Oct', dateFull: '11 October 2026', venue: 'Smetana Hall, Prague', title: 'Dvořák & Smetana', desc: 'Symphonic gems by two giants of Czech music, performed by the full ensemble.' },
      { date: '25 Oct', dateFull: '25 October 2026', venue: 'Cathedral of St Peter and Paul, Brno', title: 'Autumn Vespers', desc: 'An early-evening programme of sacred music in a majestic cathedral.' },
      { date: '8 Nov', dateFull: '8 November 2026', venue: 'St Barbara’s Church, Kutná Hora', title: 'St Cecilia’s Day Concert', desc: 'A concert for the feast of St Cecilia, the patron saint of music.' },
      { date: '22 Nov', dateFull: '22 November 2026', venue: 'Rudolfinum, Prague', title: 'Mozart: Requiem', desc: 'Mozart’s Requiem performed by the ensemble, choir and soloists.' },
      { date: '6 Dec', dateFull: '6 December 2026', venue: 'Municipal House, Prague', title: 'Advent Concert', desc: 'Advent songs and carols in festive arrangements.' },
      { date: '20 Dec', dateFull: '20 December 2026', venue: 'St James’s Basilica, Prague', title: 'Christmas Concert', desc: 'A traditional Christmas concert full of familiar melodies.' },
      { date: '6 Jan', dateFull: '6 January 2027', venue: 'Mirror Chapel, Prague', title: 'New Year’s Concert', desc: 'A festive start to the new year in the spirit of Strauss waltzes.' },
      { date: '31 Jan', dateFull: '31 January 2027', venue: 'Český Krumlov Château', title: 'Chamber Evening by Candlelight', desc: 'An intimate candlelit chamber programme in historic halls.' }
    ]
  };

  CN.CONCERTS = CONCERT_BASE.map(function (base, i) {
    var t = pick(CONCERT_TEXT)[i];
    return {
      date: t.date,
      dateFull: t.dateFull,
      time: base.time,
      venue: t.venue,
      title: t.title,
      desc: t.desc,
      ticketUrl: base.ticketUrl,
      img: concertImg(i, 700, 440),
      imgWide: concertImg(i, 1400, 1000),
      thumb: concertImg(i, 200, 200)
    };
  });

  /* Past / archive concerts. */
  var PAST_TEXT = {
    /* Data se píší všude stejně: celé datum „12. září 2026“, jen měsíc
       „květen 2026“ (měsíce malým písmenem, jak je v češtině správně). */
    cs: [
      { date: 'květen 2026', title: 'Jarní koncert' },
      { date: 'duben 2026', title: 'Velikonoční nešpory' },
      { date: 'březen 2026', title: 'Barokní večer' },
      { date: 'prosinec 2025', title: 'Vánoční koncert' },
      { date: 'listopad 2025', title: 'Svatomartinský koncert' },
      { date: 'říjen 2025', title: 'Podzimní serenáda' },
      { date: 'září 2025', title: 'Zahajovací koncert sezóny' },
      { date: 'červen 2025', title: 'Letní serenáda na zámku' }
    ],
    en: [
      { date: 'May 2026', title: 'Spring Concert' },
      { date: 'April 2026', title: 'Easter Vespers' },
      { date: 'March 2026', title: 'Baroque Evening' },
      { date: 'December 2025', title: 'Christmas Concert' },
      { date: 'November 2025', title: 'St Martin’s Day Concert' },
      { date: 'October 2025', title: 'Autumn Serenade' },
      { date: 'September 2025', title: 'Season Opening Concert' },
      { date: 'June 2025', title: 'Summer Serenade at the Château' }
    ]
  };

  CN.PAST = pick(PAST_TEXT).map(function (t, i) {
    return { date: t.date, title: t.title, img: concertImg(i + 10, 500, 375) };
  });

  /* Repertoire genres (also reused as the Home "gallery teaser" cards). */
  var GENRE_BASE = [
    { cat: 'strings', i: 0 },
    { cat: 'orchestra', i: 5 },
    { cat: 'cathedral', i: 2 },
    { cat: 'cathedral', i: 7 },
    { cat: 'hall', i: 3 },
    { cat: 'strings', i: 8 }
  ];
  var GENRE_TEXT = {
    cs: ['Klasicismus', 'Romantismus', 'Baroko', 'Sakrální hudba', 'Filmová hudba', 'Soudobá tvorba'],
    en: ['Classical', 'Romantic', 'Baroque', 'Sacred Music', 'Film Music', 'Contemporary Works']
  };
  CN.GENRES = GENRE_BASE.map(function (g, i) {
    return { label: pick(GENRE_TEXT)[i], img: CN.img(g.cat, g.i, 500, 500) };
  });

  /* Gallery albums (event photo sets) — shared by the gallery page and the Home
     teaser. `id` je klíč hash routy a je v obou jazycích stejný, takže
     #album/jarni funguje i na /en/gallery.html. */
  var ALBUM_BASE = [
    { id: 'jarni', catKey: 'catConcerts', group: 'koncerty', count: 12, off: 0 },
    { id: 'advent', catKey: 'catConcerts', group: 'koncerty', count: 9, off: 7 },
    { id: 'serenada', catKey: 'catConcerts', group: 'koncerty', count: 8, off: 13 },
    { id: 'film', catKey: 'catConcerts', group: 'koncerty', count: 11, off: 9 },
    { id: 'novorocni', catKey: 'catConcerts', group: 'koncerty', count: 10, off: 10 },
    { id: 'komorni', catKey: 'catConcerts', group: 'koncerty', count: 7, off: 6 },
    { id: 'general', catKey: 'catRehearsals', group: 'zkousky', count: 6, off: 16 },
    { id: 'zakulisi', catKey: 'catBackstage', group: 'zkousky', count: 9, off: 18 },
    { id: 'zkousky2526', catKey: 'catRehearsals', group: 'zkousky', count: 8, off: 4 }
  ];
  var ALBUM_TEXT = {
    cs: {
      jarni: { name: 'Jarní koncert', date: '6. července 2026' },
      advent: { name: 'Adventní koncert v katedrále', date: '15. prosince 2025' },
      serenada: { name: 'Letní serenáda na zámku', date: '2. srpna 2025' },
      film: { name: 'Filmová hudba LIVE', date: '19. dubna 2025' },
      novorocni: { name: 'Novoroční koncert', date: '1. ledna 2025' },
      komorni: { name: 'Komorní večer', date: '14. února 2025' },
      general: { name: 'Generální zkouška: Dvořák', date: '28. června 2025' },
      zakulisi: { name: 'Zákulisí jarního turné', date: 'květen 2025' },
      zkousky2526: { name: 'Zkoušky na sezónu 25/26', date: 'září 2025' }
    },
    en: {
      jarni: { name: 'Spring Concert', date: '6 July 2026' },
      advent: { name: 'Advent Concert at the Cathedral', date: '15 December 2025' },
      serenada: { name: 'Summer Serenade at the Château', date: '2 August 2025' },
      film: { name: 'Film Music LIVE', date: '19 April 2025' },
      novorocni: { name: 'New Year’s Concert', date: '1 January 2025' },
      komorni: { name: 'Chamber Evening', date: '14 February 2025' },
      general: { name: 'Dress Rehearsal: Dvořák', date: '28 June 2025' },
      zakulisi: { name: 'Backstage on the Spring Tour', date: 'May 2025' },
      zkousky2526: { name: 'Rehearsals for the 25/26 Season', date: 'September 2025' }
    }
  };

  CN.ALBUMS = ALBUM_BASE.map(function (base) {
    var t = pick(ALBUM_TEXT)[base.id];
    var a = {
      id: base.id,
      name: t.name,
      date: t.date,
      cat: CN.t(base.catKey),
      group: base.group,
      count: base.count,
      off: base.off,
      cover: CN.galleryImg(base.off, 700, 525),
      photos: []
    };
    for (var k = 0; k < base.count; k++) a.photos.push(CN.galleryImg(base.off + k, 800, 800));
    return a;
  });
})(window.CN);
