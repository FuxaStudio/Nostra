/* Shared content data and image helpers used across pages.
   Vlastní fotky souboru: CN.photo (assets/img/, seznam v assets/img/README.md).

   Vyžaduje js/i18n.js (CN.LANG, CN.t) načtené dříve.

   Struktura a texty jsou záměrně u sebe: koncert nebo album se zapisuje
   jednou a jazykové varianty mají jen slova ({cs, en}). Obě jazykové verze
   se tak nemohou rozejít. NB = nezlomitelná mezera. */
window.CN = window.CN || {};
(function (CN) {
  var LANG = CN.LANG || 'cs';
  var NB = ' ';
  function pick(table) { return table && typeof table === 'object' ? (table[LANG] || table.cs) : table; }

  /* ---- Lokální fotky z assets/img/ ----
     Seznam souborů, rozměry a doporučené použití: assets/img/README.md.
     Cesta se odvozuje od umístění data.js, takže funguje z kořene webu i z /en/.
       CN.photo('snimky/09-soubor-cely-stredni-celek-1600.webp')  libovolný soubor
       CN.photo.member('suk', 960)        portrét 4:5, šířka 480 | 960
       CN.photo.memberSrcset('suk')       "…-480.webp 480w, …-960.webp 960w"
       CN.photo.still('09-soubor-cely-stredni-celek', 1600)   snímek z videa 16:9, 960 | 1600 | 2560
       CN.photo.stillSrcset('09-soubor-cely-stredni-celek')
       CN.photo.shoot('suk-alt')          celý záběr z focení 3:2, šířka 1600 (galerie)
       CN.photo.ensemble(2400, true)      společná fotka, 1200 | 2400, true = výřez 16:9 */
  var PHOTO_BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    try { return new URL('../assets/img/', s || document.baseURI).href; } catch (e) { return 'assets/img/'; }
  })();
  var photo = CN.photo = function (path) { return PHOTO_BASE + path; };
  photo.MEMBERS = ['suk', 'plavec', 'zdvihalova', 'majvaldova', 'kabrt', 'janicek', 'jadrny',
    'svetlikova', 'rykr', 'linkova', 'stehno'];
  photo.MEMBER_ALTS = ['suk-alt', 'rykr-alt', 'svetlikova-alt'];
  photo.STILLS = [
    '01-hlavni-lod-siroky-celek', '02-cembalo-suk-profil', '03-cembalo-ruce-detail',
    '04-violoncello-kontrabas-skupina', '05-housle-detail-sekce', '06-hoboje-duo',
    '07-soubor-bocni-pohled-lod', '08-housle-rada-hloubka', '09-soubor-cely-stredni-celek',
    '10-housle-svetlo-okno', '11-fletna-solistka', '12-housle-tma-detail',
    '13-housle-tma-sekce', '14-kontrabas-violoncello-usmev', '15-soubor-slunecni-skvrny',
    /* 16–34: další snímky hlavně pro karty koncertů (docs/scripts/make_concert_stills.py) */
    '16-housle-u-pultu', '17-housle-trojice', '18-cembalo-kontrabas',
    '20-housle-sekce-pult', '21-violoncello-kontrabas-hoboj', '22-pohled-od-cembala',
    '23-housle-sekce-popredi', '24-violoncello-kontrabas-zblizka', '25-soubor-za-cembalem',
    '26-housle-hoboje', '27-kontrabas-violoncello-duo', '28-soubor-presbytar-zboku',
    '29-housle-trojice-pohyb', '30-housle-tma-dvojice', '31-housle-tma-trojice', '32-cembalo-tma',
    '33-soubor-slunce-ulicka', '34-soubor-slunce-presbytar'
  ];
  photo.member = function (slug, w) { return photo('clenove/' + slug + '-' + (w || 960) + '.webp'); };
  photo.memberSrcset = function (slug) {
    return photo.member(slug, 480) + ' 480w, ' + photo.member(slug, 960) + ' 960w';
  };
  photo.still = function (slug, w) { return photo('snimky/' + slug + '-' + (w || 1600) + '.webp'); };
  photo.stillSrcset = function (slug) {
    return [960, 1600, 2560].map(function (w) { return photo.still(slug, w) + ' ' + w + 'w'; }).join(', ');
  };
  photo.shoot = function (slug) { return photo('foceni/' + slug + '-1600.webp'); };
  photo.ensemble = function (w, wide) {
    return photo('soubor/souborovka-' + (wide ? '16x9-' : '') + (w || 2400) + '.webp');
  };

  /* ---- Koncerty ----
     Zdroj: Podklady/Web.docx (stav k 5. 10. 2026). Nic nedoplňovat:
       iso       datum koncertu RRRR-MM-DD (řazení, oddělení nadcházejících od proběhlých)
       time      jen pokud ho pořadatel zveřejnil, jinak null (a nezobrazuje se)
       place     kostel / sál {cs, en}       town   obec (v obou jazycích stejně)
       title     název koncertu {cs, en}, null = bez názvu (zobrazit jen místo a datum)
       subtitle  podtitul / program {cs, en}, null = není
       url       odkaz na událost na FB nebo web pořadatele, null = není
       urlLabel  popisek odkazu {cs, en}
       mapQuery  (volitelné) dotaz pro Google Mapy, jen když „place, town“ nenajde
                 správné místo jednoznačně; na webu se nezobrazuje. Jinak se hledá
                 podle českého názvu místa (i na anglické stránce).
     Vstupenky se neprodávají a vstupné zatím není potvrzené – neuvádět.
     Fotky u koncertů jsou ilustrační snímky z natáčení souboru, ne z daného
     koncertu (proto vlastní obecný popisek imgAlt). */
  var MONTHS = {
    cs: ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července',
      'srpna', 'září', 'října', 'listopadu', 'prosince'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December']
  };
  function dateParts(iso) {
    var p = iso.split('-');
    return { y: +p[0], m: +p[1], d: +p[2] };
  }
  /* cs „1. listopadu 2026“, en „1 November 2026“ (nezlomitelné mezery uvnitř data) */
  function dateFull(iso) {
    var p = dateParts(iso);
    return LANG === 'en'
      ? p.d + NB + MONTHS.en[p.m - 1] + NB + p.y
      : p.d + '.' + NB + MONTHS.cs[p.m - 1] + NB + p.y;
  }
  /* cs „1. 11.“, en „1 Nov“ */
  function dateShort(iso) {
    var p = dateParts(iso);
    return LANG === 'en' ? p.d + NB + MONTHS.en[p.m - 1].slice(0, 3) : p.d + '.' + NB + p.m + '.';
  }
  var STILL_ALT = {
    cs: 'Capella Nostra při hraní (ilustrační snímek z natáčení souboru)',
    en: 'Capella Nostra playing (illustrative still from the ensemble’s filming)'
  };
  function withDerived(c, still) {
    if (!c.mapQuery) c.mapQuery = c.place.cs + ', ' + c.town;
    c.place = pick(c.place);
    c.title = pick(c.title);
    c.subtitle = pick(c.subtitle);
    c.urlLabel = pick(c.urlLabel);
    c.date = dateShort(c.iso);
    c.dateFull = dateFull(c.iso);
    c.venue = c.place + ', ' + c.town;
    c.img = photo.still(still, 960);
    c.imgWide = photo.still(still, 1600);
    c.thumb = photo.still(still, 960);
    c.imgAlt = pick(STILL_ALT);
    return c;
  }
  function byIso(a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0; }

  /* ---- Sdílené akce u koncertu (úvod i stránka Koncerty) ----
       CN.mapUrl(c)        odkaz na Google Mapy (hledá „místo, obec“, žádné souřadnice se nevymýšlí)
       CN.calendarUrl(c)   data: URI se souborem .ics pro <a href download>
       CN.calendarFile(c)  název souboru „capella-nostra-RRRR-MM-DD.ics“ pro atribut download
     Potřebují c.iso, c.place, c.town; volitelně c.time, c.title, c.subtitle, c.url. */
  CN.mapUrl = function (c) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.mapQuery || (c.place + ', ' + c.town));
  };
  CN.calendarFile = function (c) { return 'capella-nostra-' + c.iso + '.ics'; };

  /* Čas jen tam, kde je známý (Europe/Prague, bez DTEND – délka koncertu
     není zveřejněná); jinak celodenní událost (DTEND = následující den). */
  var VTIMEZONE = ['BEGIN:VTIMEZONE', 'TZID:Europe/Prague',
    'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST',
    'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET',
    'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
    'END:VTIMEZONE'];
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  /* Escapování textu podle RFC 5545 (3.3.11): \ ; , a konec řádku.
     Nezlomitelné mezery z textů webu se do kalendáře převedou na běžné. */
  function icsText(s) {
    return String(s).replace(/ /g, ' ').replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n');
  }
  /* Zalomení řádků delších než 75 oktetů (RFC 5545, 3.1) – pokračování začíná
     mezerou. Čeština má víceoktetové znaky, proto se počítá v UTF-8. */
  function icsFold(line) {
    var out = '', len = 0;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      var code = line.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) { ch += line[++i]; }
      var bytes = unescape(encodeURIComponent(ch)).length;
      if (len + bytes > 75) { out += '\r\n '; len = 1; }
      out += ch;
      len += bytes;
    }
    return out;
  }
  CN.calendarUrl = function (c) {
    var d = c.iso.replace(/-/g, '');
    var p = c.iso.split('-');
    var next = new Date(+p[0], +p[1] - 1, +p[2] + 1);
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Capella Nostra//Web//' + LANG.toUpperCase(), 'CALSCALE:GREGORIAN']
      .concat(c.time ? VTIMEZONE : [])
      .concat([
        'BEGIN:VEVENT',
        'UID:' + d + '-' + c.town.normalize('NFD').replace(/[^A-Za-z0-9]/g, '') + '@capellanostra.cz',
        'DTSTAMP:' + stamp,
        c.time
          ? 'DTSTART;TZID=Europe/Prague:' + d + 'T' + c.time.replace(':', '') + '00'
          : 'DTSTART;VALUE=DATE:' + d,
        c.time ? '' : 'DTEND;VALUE=DATE:' + next.getFullYear() + pad2(next.getMonth() + 1) + pad2(next.getDate()),
        'SUMMARY:' + icsText((c.title || CN.t('concertFallback')) + ' – Capella Nostra'),
        'LOCATION:' + icsText(c.place + ', ' + c.town),
        c.subtitle ? 'DESCRIPTION:' + icsText(c.subtitle) : '',
        c.url ? 'URL:' + c.url : '',
        'END:VEVENT', 'END:VCALENDAR'
      ]).filter(Boolean).map(icsFold);
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n') + '\r\n');
  };

  var FB_EVENT = { cs: 'Událost na Facebooku', en: 'Facebook event' };
  var ORGANISER = { cs: 'Web pořadatele', en: 'Organiser’s website' };
  var CHRISTMAS = { cs: 'Vánoční koncert', en: 'Christmas concert' };

  CN.CONCERTS = [
    withDerived({
      iso: '2026-11-01', time: '18:00',
      place: { cs: 'Kostel sv. Jana Nepomuckého na Zelené hoře', en: 'Pilgrimage Church of St John of Nepomuk at Zelená hora' },
      town: 'Žďár nad Sázavou',
      title: { cs: 'Dušičkový koncert', en: 'All Souls’ concert' },
      subtitle: { cs: 'Barokní triové sonáty', en: 'Baroque trio sonatas' },
      url: 'https://fb.me/e/8qQzMr3J9', urlLabel: FB_EVENT
    }, '30-housle-tma-dvojice'),
    withDerived({
      iso: '2026-11-29', time: null,
      place: { cs: 'Kostel Povýšení sv. Kříže', en: 'Church of the Exaltation of the Holy Cross' },
      town: 'Hustopeče nad Bečvou',
      title: CHRISTMAS, subtitle: null, url: null, urlLabel: null
    }, '25-soubor-za-cembalem'),
    withDerived({
      iso: '2026-12-18', time: null,
      place: { cs: 'Kostel sv. Michala', en: 'Church of St Michael' },
      town: 'Licibořice',
      /* „Kostel sv. Michala, Licibořice“ vrací v Mapách seznam (i kostel v Chrudimi);
         pod tímto názvem je kostel v Licibořicích (538 23) uvedený. Ověřeno 6. 10. 2026. */
      mapQuery: 'Kostel sv. Michaela archanděla, Licibořice',
      title: CHRISTMAS, subtitle: null, url: null, urlLabel: null
    }, '24-violoncello-kontrabas-zblizka')
  ].sort(byIso);

  CN.PAST = [
    withDerived({
      iso: '2026-09-27', time: null,
      place: { cs: 'Kostel sv. Víta', en: 'Church of St Vitus' }, town: 'Bojanov',
      title: { cs: 'Bojanovské muzicírování', en: 'Bojanovské muzicírování' },
      subtitle: { cs: 'Baroko (v)' + NB + 'září', en: 'Baroko (v) září' },
      url: 'https://www.muzicirovanibojanov.cz/', urlLabel: ORGANISER
    }, '22-pohled-od-cembala'),
    withDerived({
      iso: '2026-09-25', time: null,
      place: { cs: 'Kostel Zvěstování Panny Marie', en: 'Church of the Annunciation of the Virgin Mary' }, town: 'Ostrov',
      title: {
        cs: 'Mezinárodní hudební festival J.' + NB + 'C.' + NB + 'F.' + NB + 'Fischera',
        en: 'J.' + NB + 'C.' + NB + 'F.' + NB + 'Fischer International Music Festival'
      },
      subtitle: { cs: 'Mladí s' + NB + 'barokem ladí', en: 'Mladí s barokem ladí' },
      url: 'https://imff.cz/program/mladi-s-barokem-ladi/', urlLabel: ORGANISER
    }, '17-housle-trojice'),
    withDerived({
      iso: '2026-09-06', time: null,
      place: { cs: 'Evangelický kostel', en: 'Evangelical church' }, town: 'Dvakačovice',
      title: null, subtitle: null, url: null, urlLabel: null
    }, '26-housle-hoboje'),
    withDerived({
      iso: '2026-08-20', time: null,
      place: { cs: 'Fabrika 1861', en: 'Fabrika 1861' }, town: 'Semily',
      title: null, subtitle: null, url: null, urlLabel: null
    }, '18-cembalo-kontrabas')
  ].sort(byIso).reverse();   /* archiv od nejnovějšího */

  /* ---- Galerie ----
     Alba sdílí stránka Galerie (js/galerie.js) a ukázka na úvodu. Tvar:
       id      klíč hash routy #album/<id> (stejný v obou jazycích)
       name, date, cat   název, datum ('' = neznámé, nezobrazuje se), štítek
       cover   náhled alba 960 px · photos  fotky pro lightbox (1600 px a víc)
       thumbs  menší verze fotek pro mřížku · alts  popisky (alt) ke každé fotce
       desc    věta pod nadpisem alba · group  skupina pro filtr
     Fotky z koncertů nemáme: alba stojí na snímcích z natáčení videí (natáčelo
     se bez publika – nikdy nepopisovat jako koncert, nejmenovat místo ani hosty)
     a na focení souboru. Zdroje: assets/img/snimky, assets/img/galerie
     (docs/scripts/make_gallery_stills.py), assets/img/foceni, assets/img/soubor.
     Fotka = [druh, soubor, popisek cs, popisek en]; druh s = snímek z videa,
     g = galerie/, e = společná fotka, f = focení 3:2. */
  function albumPhoto(kind, slug) {
    if (kind === 's') return { full: photo.still(slug, 1600), thumb: photo.still(slug, 960) };
    if (kind === 'g') return { full: photo('galerie/' + slug + '-1600.webp'), thumb: photo('galerie/' + slug + '-960.webp') };
    if (kind === 'e') return { full: photo.ensemble(2400), thumb: photo.ensemble(1200) };
    return { full: photo.shoot(slug), thumb: photo.shoot(slug) }; /* 'f' focení 3:2 */
  }
  var FILMING = { cs: 'Natáčení', en: 'Filming' };
  /* Tři alba. Pás galerie na úvodu ukazuje jejich obálky (obálka = první fotka),
     proto jsou obálky vybrané tak, aby jinde na webu nebyly: 09 (Ouverture má
     v galerii jiný náhled), cembalo-tma (hero galerie je housle-tma-hloubka)
     a portrét místo společné fotky (ta je na úvodu v kruhu). Skoro stejné
     snímky (31 ≈ 13, 32 ≈ cembalo-tma, 34 ≈ 15, 33/28 ≈ soubor-celek-zepredu,
     18 ≈ 02) v albech záměrně nejsou, 04 vypadl kvůli hostující hráčce na buben. */
  var ALBUMS = [
    {
      id: 'natoceni', group: 'natoceni', cat: FILMING,
      name: { cs: 'Při hraní', en: 'Playing' },
      desc: {
        cs: 'Snímky z' + NB + 'natáčení videí s' + NB + 'hudbou J.' + NB + 'C.' + NB + 'F.' + NB + 'Fischera a' + NB + 'Antonia Vivaldiho: celý soubor, cembalo, smyčce i' + NB + 'hoboje.',
        en: 'Stills from filming videos of music by J.' + NB + 'C.' + NB + 'F.' + NB + 'Fischer and Antonio Vivaldi: the whole ensemble, harpsichord, strings and oboes.'
      },
      photos: [
        ['s', '09-soubor-cely-stredni-celek', 'Celý soubor při hraní: housle, cembalo, hoboje, violoncello a kontrabas', 'The whole ensemble playing: violins, harpsichord, oboes, cello and double bass'],
        ['g', 'soubor-celek-zepredu', 'Soubor při hraní, pohled zepředu přes řady prázdných židlí', 'The ensemble playing, seen from the front across rows of empty chairs'],
        ['s', '25-soubor-za-cembalem', 'Celý soubor zepředu, v popředí cembalista zezadu', 'The whole ensemble from the front, the harpsichordist seen from behind in the foreground'],
        ['s', '02-cembalo-suk-profil', 'Adam Suk u cembala, v pozadí kontrabas a violoncello', 'Adam Suk at the harpsichord, double bass and cello in the background'],
        ['s', '03-cembalo-ruce-detail', 'Ruce na klaviatuře zdobeného cembala', 'Hands on the keyboard of a decorated harpsichord'],
        ['g', 'cembalo-zboku', 'Adam Suk u zeleného cembala, v pozadí hoboj a kontrabas', 'Adam Suk at the green harpsichord, oboe and double bass in the background'],
        ['g', 'cembalo-violoncello', 'Cembalo a violoncello, pohled přes rameno cembalisty', 'Harpsichord and cello, seen over the harpsichordist’s shoulder'],
        ['s', '22-pohled-od-cembala', 'Pohled přes rameno cembalisty na soubor', 'View of the ensemble over the harpsichordist’s shoulder'],
        ['s', '06-hoboje-duo', 'Hobojové duo: Tomáš Rykr a Amélie Linková', 'Oboe duo: Tomáš Rykr and Amélie Linková'],
        ['g', 'hoboj-housle-solo', 'Hoboj a housle v sólech, za nimi smyčce', 'Oboe and violin solos with the strings behind them'],
        ['s', '26-housle-hoboje', 'Houslista a dva hobojisté u oltáře', 'A violinist and two oboists by the altar'],
        ['s', '08-housle-rada-hloubka', 'Řada houslistů při hraní', 'A row of violinists playing'],
        ['s', '29-housle-trojice-pohyb', 'Tři houslisté při hraní', 'Three violinists playing'],
        ['s', '16-housle-u-pultu', 'Pět houslistů ve stoje u pultů', 'Five violinists standing at their music stands'],
        ['s', '05-housle-detail-sekce', 'Houslová sekce zblízka', 'The violin section up close'],
        ['s', '20-housle-sekce-pult', 'Houslistky a houslista u pultu', 'Violinists at a music stand'],
        ['s', '10-housle-svetlo-okno', 'Housle v protisvětle od okna', 'Violins backlit by a window'],
        ['s', '14-kontrabas-violoncello-usmev', 'Ema Světlíková s kontrabasem a Tadeáš Jadrný s violoncellem', 'Ema Světlíková with the double bass and Tadeáš Jadrný with the cello'],
        ['s', '27-kontrabas-violoncello-duo', 'Kontrabas a violoncello při hraní', 'Double bass and cello playing'],
        ['s', '24-violoncello-kontrabas-zblizka', 'Violoncello zblízka, za ním kontrabas a hobojistka', 'The cello up close, with the double bass and an oboist behind'],
        ['g', 'cembalo-pult-celek', 'Cembalo s notovým pultem, v pozadí kontrabas a violoncello', 'Harpsichord with a music stand, double bass and cello in the background'],
        ['s', '07-soubor-bocni-pohled-lod', 'Celý soubor z boku, v popředí řady židlí', 'The whole ensemble from the side, rows of chairs in the foreground'],
        ['s', '15-soubor-slunecni-skvrny', 'Soubor při hraní, na podlaze sluneční skvrny', 'The ensemble playing, patches of sunlight on the floor'],
        ['s', '01-hlavni-lod-siroky-celek', 'Široký záběr prostorem, soubor hraje na konci uličky', 'A wide shot of the space, the ensemble playing at the end of the aisle']
      ]
    },
    {
      id: 've-tme', group: 'natoceni', cat: FILMING,
      name: { cs: 'Ve tmě', en: 'In the dark' },
      desc: {
        cs: 'Housle a' + NB + 'cembalo nasvícené do tmy. Záběry z' + NB + 'natáčení Vivaldiho Larga a' + NB + 'Koncertu pro hoboj a' + NB + 'housle.',
        en: 'Violins and harpsichord lit against the dark. Shots from filming Vivaldi’s Largo and the Concerto for oboe and violin.'
      },
      photos: [
        ['g', 'cembalo-tma', 'Adam Suk u cembala v šeru', 'Adam Suk at the harpsichord in the half-light'],
        ['s', '13-housle-tma-sekce', 'Tři houslisté ve tmě, nasvícení z boku', 'Three violinists in the dark, lit from the side'],
        ['g', 'housle-tma-hloubka', 'Housle ve tmě, řada hráčů do hloubky', 'Violins in the dark, a row of players receding into depth'],
        ['s', '12-housle-tma-detail', 'Detail houslí nasvícených do tmy', 'Detail of violins lit against the dark'],
        ['g', 'housle-tma-smycce', 'Smyčce v bočním světle na černém pozadí', 'Strings in side light against a black background'],
        ['s', '30-housle-tma-dvojice', 'Dva houslisté nasvícení do tmy', 'Two violinists lit against the dark']
      ]
    },
    {
      id: 'portrety', group: 'foceni', cat: { cs: 'Focení', en: 'Photo shoot' },
      name: { cs: 'Portréty', en: 'Portraits' },
      desc: {
        cs: 'Hráči souboru se svými nástroji a' + NB + 'společná fotka.',
        en: 'The players with their instruments, and a group photo.'
      },
      photos: [
        ['f', 'zdvihalova', 'Marie Zdvihalová, housle', 'Marie Zdvihalová, violin'],
        ['e', '', 'Společná fotka deseti členů souboru s nástroji', 'Group photo of ten members of the ensemble with their instruments'],
        ['f', 'suk', 'Adam Suk, cembalo', 'Adam Suk, harpsichord'],
        ['f', 'suk-alt', 'Adam Suk, cembalo', 'Adam Suk, harpsichord'],
        ['f', 'plavec', 'Daniel Plavec, housle', 'Daniel Plavec, violin'],
        ['f', 'majvaldova', 'Tereza Majvaldová, housle', 'Tereza Majvaldová, violin'],
        ['f', 'kabrt', 'Jiří Kábrt, housle a viola', 'Jiří Kábrt, violin and viola'],
        ['f', 'janicek', 'Adam Janíček, housle a viola', 'Adam Janíček, violin and viola'],
        ['f', 'jadrny', 'Tadeáš Jadrný, violoncello', 'Tadeáš Jadrný, cello'],
        ['f', 'svetlikova', 'Ema Světlíková, kontrabas', 'Ema Světlíková, double bass'],
        ['f', 'svetlikova-alt', 'Ema Světlíková, kontrabas', 'Ema Světlíková, double bass'],
        ['f', 'rykr', 'Tomáš Rykr, hoboj', 'Tomáš Rykr, oboe'],
        ['f', 'rykr-alt', 'Tomáš Rykr, hoboj', 'Tomáš Rykr, oboe'],
        ['f', 'linkova', 'Amélie Linková, hoboj', 'Amélie Linková, oboe'],
        ['f', 'stehno', 'Michael Stehno, trubka', 'Michael Stehno, trumpet']
      ]
    }
  ];

  CN.ALBUMS = ALBUMS.map(function (a) {
    var ph = a.photos.map(function (p) { return albumPhoto(p[0], p[1]); });
    return {
      id: a.id, name: pick(a.name), date: '', cat: pick(a.cat), group: a.group, desc: pick(a.desc),
      count: ph.length,
      cover: ph[0].thumb,
      photos: ph.map(function (p) { return p.full; }),
      thumbs: ph.map(function (p) { return p.thumb; }),
      alts: a.photos.map(function (p) { return LANG === 'en' ? p[3] : p[2]; })
    };
  });
})(window.CN);
