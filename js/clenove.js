(function () {
  var CN = window.CN;
  var EN = CN.LANG === 'en';

  /* Členové podle Podklady/zadani.md. Pořadí odsouhlasené 6. 10. 2026:
     vedení (garant, koncertní mistr, management), pak hráči podle nástrojů
     a uvnitř nástroje abecedně podle příjmení. Adam Suk má vlastní sekci v HTML.
     Jména zůstávají v originále v obou jazycích, překládá se jen role. */
  var LEADERS = [
    { name: 'Michal Hanuš', title: 'MgA.', role: { cs: 'Umělecký garant', en: 'Artistic supervisor' } },
    { slug: 'plavec', name: 'Daniel Plavec', role: { cs: 'Housle, koncertní mistr', en: 'Violin, concertmaster' }, with: { cs: 's houslemi', en: 'with a violin' } },
    { slug: 'stehno', name: 'Michael Stehno', role: { cs: 'Trubka, management', en: 'Trumpet, management' }, with: { cs: 's trubkou', en: 'with a trumpet' } }
  ];
  var PLAYERS = [
    { slug: 'majvaldova', name: 'Tereza Majvaldová', role: { cs: 'Housle', en: 'Violin' }, with: { cs: 's houslemi', en: 'with a violin' } },
    { slug: 'zdvihalova', name: 'Marie Zdvihalová', role: { cs: 'Housle', en: 'Violin' }, with: { cs: 's houslemi', en: 'with a violin' } },
    { slug: 'janicek', name: 'Adam Janíček', role: { cs: 'Housle, viola', en: 'Violin, viola' }, with: { cs: 's houslemi', en: 'with a violin' } },
    { slug: 'kabrt', name: 'Jiří Kábrt', role: { cs: 'Housle, viola', en: 'Violin, viola' }, with: { cs: 's houslemi', en: 'with a violin' } },
    { slug: 'jadrny', name: 'Tadeáš Jadrný', role: { cs: 'Violoncello', en: 'Cello' }, with: { cs: 's violoncellem', en: 'with a cello' } },
    { slug: 'svetlikova', name: 'Ema Světlíková', role: { cs: 'Kontrabas', en: 'Double bass' }, with: { cs: 's kontrabasem', en: 'with a double bass' } },
    { slug: 'linkova', name: 'Amélie Linková', role: { cs: 'Hoboj', en: 'Oboe' }, with: { cs: 's hobojem', en: 'with an oboe' } },
    { slug: 'rykr', name: 'Tomáš Rykr', role: { cs: 'Hoboj', en: 'Oboe' }, with: { cs: 's hobojem', en: 'with an oboe' } }
  ];

  function role(m) { return EN ? m.role.en : m.role.cs; }

  /* Garant nemá fotku a mít nebude: místo portrétu typografická karta
     stejné velikosti (žádná silueta ani zástupný avatar). */
  function typeCard(m) {
    return '<div class="musician musician--type" role="listitem">' +
      '<div class="photo type-card">' +
        '<h3><span class="type-card__title">' + m.title + '</span> ' + m.name + '</h3>' +
        '<span class="type-card__rule" aria-hidden="true"></span>' +
        '<p>' + role(m) + '</p>' +
      '</div>' +
    '</div>';
  }

  function portrait(m, sizes) {
    if (!m.slug) return typeCard(m);
    var alt = m.name + ' ' + (EN ? m.with.en : m.with.cs.replace(' ', ' '));
    return '<div class="musician" role="listitem">' +
      '<div class="photo"><img src="' + CN.photo.member(m.slug, 480) + '" srcset="' + CN.photo.memberSrcset(m.slug) + '"' +
        ' sizes="' + sizes + '" width="480" height="600" loading="lazy" alt="' + alt + '"><span class="ring"></span></div>' +
      '<h3>' + m.name + '</h3>' +
      '<p>' + role(m) + '</p>' +
    '</div>';
  }

  document.getElementById('leadersFeature').innerHTML = LEADERS.map(function (m) {
    return portrait(m, '(max-width: 680px) 220px, 310px');
  }).join('');
  document.getElementById('musiciansGrid').innerHTML = PLAYERS.map(function (m) {
    return portrait(m, '(max-width: 680px) 45vw, 310px');
  }).join('');
})();
