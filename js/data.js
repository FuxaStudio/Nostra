/* Shared placeholder-image pool and content data used across pages.
   All photography is temporary (Unsplash placeholders) — swap for
   Capella Nostra's own photography before launch, per project handoff. */
window.CN = window.CN || {};
(function (CN) {
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

  /* Upcoming concerts — season 2026/2027 (index 0 = soonest). */
  CN.CONCERTS = [
    { date: '12. 9.', dateFull: '12. září 2026', time: '19:00', venue: 'Kostel sv. Mikuláše, Praha', title: 'Slavnostní zahájení sezóny', desc: 'Slavnostní zahájení nové koncertní sezóny s díly českých i světových mistrů.' },
    { date: '27. 9.', dateFull: '27. září 2026', time: '18:30', venue: 'Zámek Lysice', title: 'Barokní perly na zámku', desc: 'Komorní program z období vrcholného baroka v jedinečných prostorách zámku.' },
    { date: '11. 10.', dateFull: '11. října 2026', time: '19:30', venue: 'Smetanova síň, Praha', title: 'Dvořák & Smetana', desc: 'Symfonické perly dvou velikánů české hudby v podání celého souboru.' },
    { date: '25. 10.', dateFull: '25. října 2026', time: '19:00', venue: 'Katedrála sv. Petra a Pavla, Brno', title: 'Podzimní nešpory', desc: 'Podvečerní program duchovní hudby v majestátní katedrále.' },
    { date: '8. 11.', dateFull: '8. listopadu 2026', time: '18:00', venue: 'Chrám sv. Barbory, Kutná Hora', title: 'Svatocecilský koncert', desc: 'Koncert ke svátku patronky hudby svaté Cecílie.' },
    { date: '22. 11.', dateFull: '22. listopadu 2026', time: '19:00', venue: 'Rudolfinum, Praha', title: 'Mozart: Requiem', desc: 'Mozartovo Requiem v podání souboru, sboru a sólistů.' },
    { date: '6. 12.', dateFull: '6. prosince 2026', time: '17:00', venue: 'Obecní dům, Praha', title: 'Adventní koncert', desc: 'Adventní písně a koledy ve slavnostním hávu.' },
    { date: '20. 12.', dateFull: '20. prosince 2026', time: '18:00', venue: 'Bazilika sv. Jakuba, Praha', title: 'Vánoční koncert', desc: 'Tradiční vánoční koncert plný známých melodií.' },
    { date: '6. 1.', dateFull: '6. ledna 2027', time: '19:00', venue: 'Zrcadlová kaple, Praha', title: 'Novoroční koncert', desc: 'Slavnostní zahájení nového roku ve znamení Straussových valčíků.' },
    { date: '31. 1.', dateFull: '31. ledna 2027', time: '19:00', venue: 'Zámek Český Krumlov', title: 'Komorní večer při svíčkách', desc: 'Intimní komorní program při svíčkách v historických sálech.' }
  ].map(function (c, i) {
    c.img = concertImg(i, 700, 440);
    c.imgWide = concertImg(i, 1400, 1000);
    c.thumb = concertImg(i, 200, 200);
    return c;
  });

  /* Past / archive concerts. */
  CN.PAST = [
    { date: 'Květen 2026', title: 'Jarní koncert' },
    { date: 'Duben 2026', title: 'Velikonoční nešpory' },
    { date: 'Březen 2026', title: 'Barokní večer' },
    { date: 'Prosinec 2025', title: 'Vánoční koncert' },
    { date: 'Listopad 2025', title: 'Svatomartinský koncert' },
    { date: 'Říjen 2025', title: 'Podzimní serenáda' },
    { date: 'Září 2025', title: 'Zahajovací koncert sezóny' },
    { date: 'Červen 2025', title: 'Letní serenáda na zámku' }
  ].map(function (c, i) {
    c.img = concertImg(i + 10, 500, 375);
    return c;
  });

  /* Repertoire genres (also reused as the Home "gallery teaser" cards). */
  CN.GENRES = [
    { label: 'Klasicismus', img: CN.img('strings', 0, 500, 500) },
    { label: 'Romantismus', img: CN.img('orchestra', 5, 500, 500) },
    { label: 'Baroko', img: CN.img('cathedral', 2, 500, 500) },
    { label: 'Sakrální hudba', img: CN.img('cathedral', 7, 500, 500) },
    { label: 'Filmová hudba', img: CN.img('hall', 3, 500, 500) },
    { label: 'Soudobá tvorba', img: CN.img('strings', 8, 500, 500) }
  ];

  /* Gallery albums (event photo sets) — shared by galerie.html and the Home teaser. */
  CN.ALBUMS = [
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
  CN.ALBUMS.forEach(function (a) {
    a.cover = CN.galleryImg(a.off, 700, 525);
    a.photos = [];
    for (var k = 0; k < a.count; k++) a.photos.push(CN.galleryImg(a.off + k, 800, 800));
  });
})(window.CN);
