/* Inline SVG icon sprite, injected at the top of <body>.
   Usage: <svg class="icon" width="16" height="16"><use href="#i-calendar"></use></svg> */
(function () {
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' +
    '<defs>' +

    '<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 9h18M8 2v4M16 2v4"></path></symbol>' +

    '<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></symbol>' +

    '<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></symbol>' +

    '<symbol id="i-chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M15 18l-6-6 6-6"></path></symbol>' +

    '<symbol id="i-chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M9 6l6 6-6 6"></path></symbol>' +

    '<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M6 6l12 12M18 6L6 18"></path></symbol>' +

    '<symbol id="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></symbol>' +

    '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20 6L9 17l-5-5"></path></symbol>' +

    '<symbol id="i-instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle>' +
    '<circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"></circle></symbol>' +

    '<symbol id="i-facebook" viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8.2V14h2.5v7h2.8z"></path></symbol>' +

    '<symbol id="i-youtube" viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M21.6 8.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 5.1 12 5.1 12 5.1s-4 0-6.8.2c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2.2 9.8 2.2 11.5v1c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.5.1 6.7.2 6.7.2s4 0 6.8-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1c0-1.7-.2-3.3-.2-3.3zM9.9 14.6V9.4l5.2 2.6-5.2 2.6z"></path></symbol>' +

    '<symbol id="i-spotify" viewBox="0 0 24 24" fill="none">' +
    '<circle cx="12" cy="12" r="9" fill="currentColor"></circle>' +
    '<path d="M7.5 9.8c3-.7 6.2-.4 8.8 1.1M8 12.7c2.4-.5 4.9-.3 7 .9M8.4 15.4c1.9-.4 3.8-.2 5.5.7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"></path></symbol>' +

    '<symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
    '<rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="M3.5 7.5l8.5 6 8.5-6"></path></symbol>' +

    '<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
    '<path d="M5 4h4l2 5-2.6 1.5a11 11 0 0 0 5 5L16 13l5 2v4c0 1-1 2-2 2A16 16 0 0 1 3 6c0-1 1-2 2-2z"></path></symbol>' +

    '<symbol id="i-photos" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="8.5" cy="10" r="1.7"></circle><path d="M21 16l-5-5-9 8"></path></symbol>' +

    '<symbol id="i-church" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
    '<path d="M12 2v4M10 4h4"></path><path d="M12 7l6 4v10H6V11l6-4z"></path><rect x="10" y="15" width="4" height="6"></rect></symbol>' +

    '<symbol id="i-columns" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 9l8-5 8 5"></path><path d="M6 9v9M18 9v9M10 9v9M14 9v9"></path><path d="M3 21h18"></path></symbol>' +

    '<symbol id="i-castle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
    '<path d="M4 21V8h2V6h2v2h2V6h2v2h2V6h2v2h2v13z"></path><path d="M4 21h16"></path><rect x="10" y="15" width="4" height="6"></rect></symbol>' +

    '<symbol id="i-festival" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="13" r="4"></circle><path d="M12 3v2.5M4.7 7.2l1.7 1.7M19.3 7.2l-1.7 1.7M3 21h18"></path></symbol>' +

    '<symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
    '<circle cx="12" cy="12" r="8.5"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"></circle></symbol>' +

    '<symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
    '<path d="M12 3l2.2 5.6L20 9.3l-4.4 3.7 1.4 5.9L12 15.8 7 18.9l1.4-5.9L4 9.3l5.8-.7z"></path></symbol>' +

    '<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<path d="M3 6h18M3 12h18M3 18h18"></path></symbol>' +

    '</defs></svg>';

  document.body.insertAdjacentHTML('afterbegin', SPRITE);
})();
