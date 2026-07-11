(function () {
  var CN = window.CN;

  document.getElementById('heroImg').src = CN.img('orchestra', 4, 1920, 1080);

  /* Gender-matched violinist/musician portraits (Czech surnames make gender
     unambiguous, so photos are assigned per person rather than cycled blindly). */
  var FEMALE_POOL = [
    '1499442711659-a9566695faed', '1725215956940-91f616b95443', '1465821185615-20b3c2fbf41b',
    '1586351011807-b79c8ef43057', '1631474962645-d8eb9111572d', '1534782710882-2f5e2c80c1b5',
    '1628016046698-5ca1a3a03b8f'
  ];
  var MALE_POOL = [
    '1755388601179-bebe91a7c907', '1653071999858-b54e6aa411f2', '1643035921321-a060a99513c0',
    '1643035920561-7ba082785c2b', '1626913634123-2457b43792c1', '1626913630350-e9580b32fe16',
    '1755389176283-3cd924205df0'
  ];
  function faceUrl(id, w, h) {
    return 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&h=' + h + '&fit=crop&crop=faces&q=78&auto=format';
  }
  var fi = 0, mi = 0;
  function nextFemale(w, h) { return faceUrl(FEMALE_POOL[fi++ % FEMALE_POOL.length], w, h); }
  function nextMale(w, h) { return faceUrl(MALE_POOL[mi++ % MALE_POOL.length], w, h); }

  var conductorImg = CN.img('portrait', 0, 640, 640, { faces: true, q: 82 });
  document.getElementById('conductorImg').src = conductorImg;

  var leaders = [
    { name: 'Eliška Marešová', role: 'Koncertní mistryně · 1. housle', img: faceUrl('1610306673745-258854d4bbcd', 320, 320) },
    { name: 'Martin Beneš', role: 'Sbormistr & asistent dirigenta', img: faceUrl('1484972759836-b93f9ef2b293', 320, 320) }
  ];
  document.getElementById('leadersFeature').innerHTML = leaders.map(function (l) {
    return '<div class="musician">' +
      '<div class="photo"><img src="' + l.img + '" alt="' + l.name + '"><span class="ring"></span></div>' +
      '<h3>' + l.name + '</h3>' +
      '<p>' + l.role + '</p>' +
    '</div>';
  }).join('');

  var memberData = [
    { name: 'Anna Procházková', role: '1. housle', f: true },
    { name: 'Jakub Svoboda', role: '1. housle', f: false },
    { name: 'Tereza Nováková', role: '1. housle', f: true },
    { name: 'Filip Horák', role: '2. housle', f: false },
    { name: 'Klára Pospíšilová', role: '2. housle', f: true },
    { name: 'Ondřej Marek', role: '2. housle', f: false },
    { name: 'Karolína Müllerová', role: '2. housle', f: true },
    { name: 'Veronika Krejčí', role: 'Viola', f: true },
    { name: 'David Růžička', role: 'Viola', f: false },
    { name: 'Hana Bláhová', role: 'Violoncello', f: true },
    { name: 'Lukáš Fiala', role: 'Violoncello', f: false },
    { name: 'Vojtěch Říha', role: 'Violoncello', f: false },
    { name: 'Markéta Sedláčková', role: 'Kontrabas', f: true },
    { name: 'Štěpán Dvořáček', role: 'Kontrabas', f: false },
    { name: 'Petr Kučera', role: 'Flétna', f: false },
    { name: 'Lucie Veselá', role: 'Hoboj', f: true },
    { name: 'Tomáš Urban', role: 'Klarinet', f: false },
    { name: 'Barbora Doležalová', role: 'Fagot', f: true },
    { name: 'Jan Šťastný', role: 'Lesní roh', f: false },
    { name: 'Kateřina Macháčková', role: 'Trubka', f: true },
    { name: 'Michal Kovář', role: 'Pozoun', f: false },
    { name: 'Nikola Černá', role: 'Harfa', f: true },
    { name: 'Adam Pokorný', role: 'Klavír & cembalo', f: false },
    { name: 'Simona Holubová', role: 'Tympány & bicí', f: true }
  ];

  document.getElementById('musiciansGrid').innerHTML = memberData.map(function (m) {
    var img = m.f ? nextFemale(260, 260) : nextMale(260, 260);
    return '<div class="musician">' +
      '<div class="photo"><img src="' + img + '" alt="' + m.name + '" loading="lazy"><span class="ring"></span></div>' +
      '<h3>' + m.name + '</h3>' +
      '<p>' + m.role + '</p>' +
    '</div>';
  }).join('');
})();
