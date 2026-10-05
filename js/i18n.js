/* Shared language layer for the Czech site (/) and the English site (/en/).

   The active language comes from <html lang="…"> on the page itself, so a
   page is self-describing and nothing has to be toggled at runtime:
     CN.LANG      'cs' | 'en'
     CN.t(key)    UI string rendered by JavaScript
     CN.url(key)  filename of a sibling page in the current language

   Copy that lives in the markup is translated in the HTML files themselves;
   only strings that JavaScript builds belong here. */
window.CN = window.CN || {};
(function (CN) {
  var lang = (document.documentElement.getAttribute('lang') || 'cs').toLowerCase();
  CN.LANG = lang.indexOf('en') === 0 ? 'en' : 'cs';

  /* Page filenames per language. EN pages live side by side in /en/, so the
     same relative filename works from either tree. */
  var ROUTES = {
    cs: {
      home: 'index.html',
      concerts: 'koncerty.html',
      about: 'o-nas.html',
      members: 'clenove.html',
      gallery: 'galerie.html',
      contact: 'kontakt.html',
      privacy: 'zasady-ochrany-osobnich-udaju.html'
    },
    en: {
      home: 'index.html',
      concerts: 'concerts.html',
      about: 'about.html',
      members: 'members.html',
      gallery: 'gallery.html',
      contact: 'contact.html',
      privacy: 'privacy-policy.html'
    }
  };
  CN.url = function (key) { return ROUTES[CN.LANG][key] || ROUTES.cs[key]; };

  var STRINGS = {
    cs: {
      /* home */
      concertDetail: 'Detail koncertu',
      buyTicketsAria: 'koupit vstupenky',
      heroPrev: 'Předchozí koncert',
      heroNext: 'Další koncert',
      /* concerts */
      tickets: 'Vstupenky',
      /* gallery */
      filterAll: 'Vše',
      filterConcerts: 'Koncerty',
      filterRehearsals: 'Zkoušky a zákulisí',
      filterVideos: 'Videa',
      photosCount: 'fotek',
      albumKicker: 'Album',
      albumPlace: 'Lukavice',
      videoVltava: 'Smetana — Vltava (živě z katedrály)',
      videoBackstage: 'Zákulisí: příprava na jarní koncert',
      videoNewWorld: 'Dvořák — Novosvětská, finále',
      /* album category badges */
      catConcerts: 'Koncerty',
      catRehearsals: 'Zkoušky',
      catBackstage: 'Zákulisí',
      /* members — instruments / roles */
      roleConcertmaster: 'Koncertní mistryně · 1. housle',
      roleChorusMaster: 'Sbormistr a asistent dirigenta',
      violin1: '1. housle',
      violin2: '2. housle',
      viola: 'Viola',
      cello: 'Violoncello',
      doubleBass: 'Kontrabas',
      flute: 'Flétna',
      oboe: 'Hoboj',
      clarinet: 'Klarinet',
      bassoon: 'Fagot',
      horn: 'Lesní roh',
      trumpet: 'Trubka',
      trombone: 'Pozoun',
      harp: 'Harfa',
      piano: 'Klavír a cembalo',
      timpani: 'Tympány a bicí',
      /* contact form */
      errName: 'Vyplňte prosím své jméno.',
      errEmailEmpty: 'Vyplňte prosím e-mail.',
      errEmailInvalid: 'Zadejte platný e-mail.',
      errMessage: 'Napište nám prosím zprávu.',
      errGdpr: 'Bez souhlasu nelze zprávu odeslat.',
      errSend: 'Zprávu se nepodařilo odeslat. Zkuste to prosím za chvíli znovu, nebo nám napište přímo na info@capellanostra.cz.',
      sending: 'Odesílám…',
      mailSubject: 'Nová poptávka z webu — ',
      mailFromName: 'Web Capella Nostra'
    },
    en: {
      /* home */
      concertDetail: 'Concert details',
      buyTicketsAria: 'buy tickets',
      heroPrev: 'Previous concert',
      heroNext: 'Next concert',
      /* concerts */
      tickets: 'Tickets',
      /* gallery */
      filterAll: 'All',
      filterConcerts: 'Concerts',
      filterRehearsals: 'Rehearsals & backstage',
      filterVideos: 'Videos',
      photosCount: 'photos',
      albumKicker: 'Album',
      albumPlace: 'Lukavice',
      videoVltava: 'Smetana — Vltava (live from the cathedral)',
      videoBackstage: 'Backstage: preparing for the spring concert',
      videoNewWorld: 'Dvořák — New World Symphony, finale',
      /* album category badges */
      catConcerts: 'Concerts',
      catRehearsals: 'Rehearsals',
      catBackstage: 'Backstage',
      /* members — instruments / roles */
      roleConcertmaster: 'Concertmaster · First violin',
      roleChorusMaster: 'Chorus master & assistant conductor',
      violin1: 'First violin',
      violin2: 'Second violin',
      viola: 'Viola',
      cello: 'Cello',
      doubleBass: 'Double bass',
      flute: 'Flute',
      oboe: 'Oboe',
      clarinet: 'Clarinet',
      bassoon: 'Bassoon',
      horn: 'French horn',
      trumpet: 'Trumpet',
      trombone: 'Trombone',
      harp: 'Harp',
      piano: 'Piano & harpsichord',
      timpani: 'Timpani & percussion',
      /* contact form */
      errName: 'Please enter your name.',
      errEmailEmpty: 'Please enter your e-mail address.',
      errEmailInvalid: 'Please enter a valid e-mail address.',
      errMessage: 'Please write us a message.',
      errGdpr: 'We cannot send the message without your consent.',
      errSend: 'The message could not be sent. Please try again in a moment, or write to us directly at info@capellanostra.cz.',
      sending: 'Sending…',
      mailSubject: 'New enquiry from the website — ',
      mailFromName: 'Capella Nostra website'
    }
  };

  CN.t = function (key) {
    var pack = STRINGS[CN.LANG] || STRINGS.cs;
    return pack[key] !== undefined ? pack[key] : (STRINGS.cs[key] !== undefined ? STRINGS.cs[key] : key);
  };
})(window.CN);
