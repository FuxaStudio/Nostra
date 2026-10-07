/* Soubory .ics pro tlačítko „Do kalendáře“ na iPhonu, iPadu a v Safari na Macu.

   Safari soubor .ics stažený z webu nestahuje, rovnou nabídne „Přidat do
   kalendáře“. Vygenerovaný v prohlížeči (data: URI) to nedělá, proto musí
   soubory ležet na webu. Text události skládá CN.calendarIcs v js/data.js,
   tento skript ho jen uloží – data koncertů se nikde neopakují.

   Spuštění z kořene webu, po každé změně CN.CONCERTS v js/data.js:
     node docs/scripts/make_ics.js
   Výstup: kalendar/cs/*.ics a kalendar/en/*.ics (staré soubory smaže). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'kalendar');

function loadCN(lang) {
  const document = {
    documentElement: { getAttribute: () => lang },
    currentScript: { src: 'https://capellanostra.com/js/data.js' },
    baseURI: 'https://capellanostra.com/'
  };
  const window = {};
  const ctx = vm.createContext({ window, document, navigator: { userAgent: '' }, URL });
  for (const f of ['js/i18n.js', 'js/data.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  return window.CN;
}

for (const lang of ['cs', 'en']) {
  const dir = path.join(OUT, lang);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const CN = loadCN(lang);
  for (const c of CN.CONCERTS) {
    const file = path.join(ROOT, CN.calendarPath(c));
    fs.writeFileSync(file, CN.calendarIcs(c));
    console.log(path.relative(ROOT, file));
  }
}
