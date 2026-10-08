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

  /* Page addresses per language, without .html (Cloudflare serves /koncerty
     from koncerty.html). EN pages live side by side in /en/, so the same
     relative address works from either tree. */
  var ROUTES = {
    cs: {
      home: './',
      concerts: 'koncerty',
      about: 'o-nas',
      members: 'clenove',
      gallery: 'galerie',
      contact: 'kontakt',
      privacy: 'zasady-ochrany-osobnich-udaju'
    },
    en: {
      home: './',
      concerts: 'concerts',
      about: 'about',
      members: 'members',
      gallery: 'gallery',
      contact: 'contact',
      privacy: 'privacy-policy'
    }
  };
  CN.url = function (key) { return ROUTES[CN.LANG][key] || ROUTES.cs[key]; };

  var STRINGS = {
    cs: {
      /* koncerty (úvod i stránka Koncerty) */
      concertDetail: 'Program koncertů',
      concertFallback: 'Koncert',
      weekdays: 'neděle,pondělí,úterý,středa,čtvrtek,pátek,sobota',
      details: 'Podrobnosti',
      addToCalendar: 'Do kalendáře',
      mapHint: ' (mapa)',
      newWindow: ' (otevře se v novém okně)',
      heroPrev: 'Předchozí koncert',
      heroNext: 'Další koncert',
      /* galerie */
      filterAll: 'Vše',
      filterVideos: 'Videa',
      albumKicker: 'Album',
      videoPlay: 'Přehrát video: ',
      videoSoonAria: 'Video (brzy na YouTube): ',
      videoSoon: 'Brzy na YouTube',
      videoSoonText: 'Video brzy zveřejníme na YouTube.',
      /* kontaktní formulář */
      errName: 'Vyplňte prosím své jméno.',
      errEmailEmpty: 'Vyplňte prosím e-mail.',
      errEmailInvalid: 'Zadejte platný e-mail.',
      errMessage: 'Napište nám prosím zprávu.',
      errGdpr: 'Bez souhlasu nelze zprávu odeslat.',
      errSend: 'Zprávu se nepodařilo odeslat. Zkuste to prosím za chvíli znovu, nebo nám napište přímo na capellanostra@gmail.com.',
      sending: 'Odesílám…',
      mailSubject: 'Nová poptávka z webu – ',
      mailFromName: 'Web Capella Nostra'
    },
    en: {
      /* concerts (home and Concerts page) */
      concertDetail: 'Concert programme',
      concertFallback: 'Concert',
      weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      details: 'Details',
      addToCalendar: 'Add to calendar',
      mapHint: ' (map)',
      newWindow: ' (opens in a new window)',
      heroPrev: 'Previous concert',
      heroNext: 'Next concert',
      /* gallery */
      filterAll: 'All',
      filterVideos: 'Videos',
      albumKicker: 'Album',
      videoPlay: 'Play video: ',
      videoSoonAria: 'Video (coming soon to YouTube): ',
      videoSoon: 'Coming soon to YouTube',
      videoSoonText: 'The video will be published on YouTube soon.',
      /* contact form */
      errName: 'Please enter your name.',
      errEmailEmpty: 'Please enter your e-mail address.',
      errEmailInvalid: 'Please enter a valid e-mail address.',
      errMessage: 'Please write us a message.',
      errGdpr: 'We cannot send the message without your consent.',
      errSend: 'The message could not be sent. Please try again in a moment, or write to us directly at capellanostra@gmail.com.',
      sending: 'Sending…',
      mailSubject: 'New enquiry from the website – ',
      mailFromName: 'Capella Nostra website'
    }
  };

  CN.t = function (key) {
    var pack = STRINGS[CN.LANG] || STRINGS.cs;
    return pack[key] !== undefined ? pack[key] : (STRINGS.cs[key] !== undefined ? STRINGS.cs[key] : key);
  };
})(window.CN);
