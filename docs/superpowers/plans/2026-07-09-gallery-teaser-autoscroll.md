# Autoscroll teaser galerie (Home) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradit ručně-posuvnou řadu žánrových karet v teaseru galerie na domovské stránce nekonečným automatickým posuvem (marquee) bez scrollbaru, s obsahem tvořeným vybranými alby z galerie.

**Architecture:** Data alb se přesunou z lokální proměnné v `galerie.js` do sdíleného `CN.ALBUMS` v `data.js`. `home.js` z něj vybere 6 alb a vykreslí posuvný „pás" (`.genre-track`) obsahující sadu karet 2× za sebou. CSS animuje `translateX(0 → -50%)` v nekonečné smyčce; napojení je bezešvé díky tomu, že mezera mezi kartami je `margin-right` (součást šířky karty), ne flex `gap`.

**Tech Stack:** Vanilla JS (ES5 styl, IIFE, žádný build), plain CSS (`@keyframes`), statické HTML. Žádný test runner — ověřování probíhá v prohlížeči přes Playwright MCP.

## Global Constraints

- **Bez build kroku / bez závislostí** — čistý ES5-kompatibilní JS ve stylu okolního kódu (IIFE, `var`, řetězcové `innerHTML`). Nezavádět moduly ani nové knihovny.
- **Zachovat styl karet:** čtvercová fotka se zaoblenými rohy + název pod ní (žádný text přes fotku).
- **Přístupnost:** duplikovaná (druhá) sada karet musí být `aria-hidden="true"` a `tabindex="-1"`; marquee musí respektovat `prefers-reduced-motion: reduce`.
- **Pořadí načítání skriptů se nemění:** `data.js` → `main.js` → `home.js` (Home) a `data.js` → `main.js` → `galerie.js` (Galerie). `data.js` je vždy první, takže `CN.ALBUMS` je dostupné oběma.
- **Chování galerie zůstává identické** — přesun dat nesmí změnit, jak `galerie.html` vykresluje alba ani jak funguje detail alba a lightbox.
- **Vybraná alba (6, v tomto pořadí):** `jarni`, `advent`, `serenada`, `film`, `zakulisi`, `general`.

---

## File Structure

| Soubor | Odpovědnost | Změna |
|--------|-------------|-------|
| `js/data.js` | Sdílená data a obrázkové helpery | Přidat `CN.ALBUMS` (přesun z galerie.js), včetně obohacení o `cover`/`photos`. |
| `js/galerie.js` | Logika stránky galerie | Číst `CN.ALBUMS` místo lokálního `ALBUMS`; smazat lokální definici. |
| `js/home.js` | Logika domovské stránky | Nahradit blok „Genre / gallery teaser" vykreslením marquee z vybraných `CN.ALBUMS`. |
| `css/style.css` | Styly | Přepsat `.genre-row`/`.genre-card` na marquee; přidat `@keyframes` + reduced-motion; odstranit `overflow-x:auto`. |
| `index.html` | Struktura Home | **Beze změny** (obsah generuje `home.js`). |

---

### Task 1: Přesun dat alb do sdíleného `CN.ALBUMS`

Extrahuje seznam alb z `galerie.js` do `data.js`, aby ho mohla používat i domovská stránka. Chování galerie musí zůstat beze změny.

**Files:**
- Modify: `js/data.js` (přidat `CN.ALBUMS` před uzávěrku IIFE na řádku 115)
- Modify: `js/galerie.js:4-19` (nahradit lokální `ALBUMS` odkazem na `CN.ALBUMS`)

**Interfaces:**
- Consumes: `CN.galleryImg(i, w, h)` — už existuje v `data.js` (řádek 61).
- Produces: `CN.ALBUMS` — pole objektů alb. Každý objekt má:
  - `id` (string), `name` (string), `date` (string), `cat` (string), `group` (string), `count` (number), `off` (number)
  - `cover` (string URL, 700×525) a `photos` (pole string URL, `count`×, každý 800×800) — doplněné `forEach` obohacením.

- [ ] **Step 1: Přidat `CN.ALBUMS` do `data.js`**

V `js/data.js` vlož následující blok **za** definici `CN.GENRES` (za řádek 114) a **před** řádek `})(window.CN);` (řádek 115):

```javascript
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
```

- [ ] **Step 2: Přepnout `galerie.js` na `CN.ALBUMS`**

V `js/galerie.js` nahraď celý blok na řádcích 4–19 (od `var ALBUMS = [` až po konec `ALBUMS.forEach(...)`) tímto jediným řádkem:

```javascript
  var ALBUMS = CN.ALBUMS;
```

Zbytek `galerie.js` (funkce `albumById`, filtrování, vykreslení) zůstává beze změny — nadále používá lokální proměnnou `ALBUMS`, která teď odkazuje na sdílené pole.

- [ ] **Step 3: Ověřit, že galerie funguje beze změny (Playwright)**

Navigace na soubor galerie (pozn.: mezera v cestě → `%20`):

Run (MCP): `mcp__plugin_playwright_playwright__browser_navigate` na
`file:///C:/Users/pavla/Desktop/Capella%20Nostra/galerie.html`

Pak vyhodnoť DOM:

Run (MCP): `mcp__plugin_playwright_playwright__browser_evaluate` s funkcí:
```javascript
() => ({
  albumsShared: window.CN.ALBUMS.length,
  cardsRendered: document.querySelectorAll('#albumsGrid .album-card').length,
  firstAlbumName: document.querySelector('#albumsGrid .album-card h3')?.textContent || null
})
```
Expected: `albumsShared` = 9, `cardsRendered` ≥ 1, `firstAlbumName` = "Jarní koncert".

- [ ] **Step 4: Ověřit, že detail alba stále otevírá (Playwright)**

Run (MCP): `mcp__plugin_playwright_playwright__browser_navigate` na
`file:///C:/Users/pavla/Desktop/Capella%20Nostra/galerie.html#album/advent`

Run (MCP): `mcp__plugin_playwright_playwright__browser_evaluate` s funkcí:
```javascript
() => ({
  albumViewVisible: !document.getElementById('albumView').hidden,
  title: document.getElementById('albumTitle')?.textContent || null,
  photoCount: document.querySelectorAll('#albumPhotosGrid img').length
})
```
Expected: `albumViewVisible` = true, `title` = "Adventní koncert v katedrále", `photoCount` = 9.

- [ ] **Step 5: Commit**

```bash
git add js/data.js js/galerie.js
git commit -m "refactor: přesun dat alb do sdíleného CN.ALBUMS"
```

---

### Task 2: Autoscroll marquee teaseru na Home

Nahradí žánrový teaser posuvným marquee z 6 vybraných alb (`home.js`) a přepíše jeho styly na nekonečnou animaci s pauzou na hover a reduced-motion fallbackem (`style.css`). JS markup a CSS jsou těsně provázané (třídy musí sedět), proto jsou v jedné úloze s jedním viditelným výsledkem: funkční marquee.

**Files:**
- Modify: `js/home.js:37-40` (blok „Genre / gallery teaser")
- Modify: `css/style.css:354-364` (styly `.genre-row`/`.genre-card` + prázdný media blok)
- Modify: `css/style.css` (přidat `@keyframes` a reduced-motion pravidlo za blok teaseru)

**Interfaces:**
- Consumes: `CN.ALBUMS` z Tasku 1 (potřebuje `id`, `name`, `photos[0]`).
- Produces: DOM `#genreRow > .genre-track` obsahující 12 `.genre-card` (2× sada 6). První 6 jsou plné odkazy `<a href="galerie.html#album/<id>">`; druhých 6 má navíc `aria-hidden="true"` a `tabindex="-1"`.

- [ ] **Step 1: Přepsat vykreslení teaseru v `home.js`**

V `js/home.js` nahraď blok na řádcích 37–40:

```javascript
  /* ---- Genre / gallery teaser ---- */
  document.getElementById('genreRow').innerHTML = CN.GENRES.map(function (g) {
    return '<a href="galerie.html" class="genre-card"><div class="thumb"><img src="' + g.img + '" alt="' + g.label + '" loading="lazy"></div><p>' + g.label + '</p></a>';
  }).join('');
```

tímto:

```javascript
  /* ---- Gallery teaser (autoscroll marquee) ---- */
  var TEASER_IDS = ['jarni', 'advent', 'serenada', 'film', 'zakulisi', 'general'];
  var teaserAlbums = TEASER_IDS.map(function (id) {
    return CN.ALBUMS.filter(function (a) { return a.id === id; })[0];
  }).filter(Boolean);

  function teaserCard(a, dup) {
    return '<a href="galerie.html#album/' + a.id + '" class="genre-card"' +
      (dup ? ' aria-hidden="true" tabindex="-1"' : '') + '>' +
      '<div class="thumb"><img src="' + a.photos[0] + '" alt="' + a.name + '" loading="lazy"></div>' +
      '<p>' + a.name + '</p></a>';
  }

  var teaserSet = function (dup) {
    return teaserAlbums.map(function (a) { return teaserCard(a, dup); }).join('');
  };
  document.getElementById('genreRow').innerHTML =
    '<div class="genre-track">' + teaserSet(false) + teaserSet(true) + '</div>';
```

- [ ] **Step 2: Přepsat styly marquee v `style.css`**

V `css/style.css` nahraď řádky 354–364 (od `.genre-row{...}` po zavírací `}` media bloku na řádku 364):

```css
.genre-row{position:relative;overflow:hidden;padding:6px 0 18px;}
.genre-track{display:flex;width:max-content;animation:genre-marquee 48s linear infinite;}
.genre-row:hover .genre-track{animation-play-state:paused;}
.genre-card{flex:0 0 300px;margin-right:26px;text-align:center;}
.genre-card .thumb{width:300px;height:300px;border-radius:18px;overflow:hidden;margin-bottom:16px;background:#1a2550;}
.genre-card .thumb img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease;}
.genre-card:hover .thumb img{transform:scale(1.05);}
.genre-card p{font-size:20px;font-weight:700;color:#fff;}
.genre-cta{position:relative;display:flex;justify-content:center;margin-top:12px;}

@keyframes genre-marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}

@media (prefers-reduced-motion: reduce){
  .genre-track{animation:none;flex-wrap:wrap;justify-content:center;width:auto;}
  .genre-card[aria-hidden="true"]{display:none;}
}
```

Pozn.: mezera mezi kartami je nově `margin-right:26px` na `.genre-card` (ne flex `gap` na řadě). Díky tomu je šířka jedné sady přesně 50 % pásu a `translateX(-50%)` napojí smyčku bezešvě. Původní nyní zbytečný media blok `@media (max-width:640px){ .genre-row{justify-content:flex-start;} }` je tímto odstraněn.

- [ ] **Step 3: Ověřit strukturu a přístupnost marquee (Playwright)**

Run (MCP): `mcp__plugin_playwright_playwright__browser_navigate` na
`file:///C:/Users/pavla/Desktop/Capella%20Nostra/index.html`

Run (MCP): `mcp__plugin_playwright_playwright__browser_evaluate` s funkcí:
```javascript
() => {
  var track = document.querySelector('#genreRow .genre-track');
  var cards = track ? track.querySelectorAll('.genre-card') : [];
  var first = cards[0];
  var dup = track ? track.querySelectorAll('.genre-card[aria-hidden="true"]') : [];
  return {
    hasTrack: !!track,
    cardCount: cards.length,
    dupCount: dup.length,
    firstHref: first ? first.getAttribute('href') : null,
    firstLabel: first ? first.querySelector('p').textContent : null,
    animName: track ? getComputedStyle(track).animationName : null
  };
}
```
Expected: `hasTrack` = true, `cardCount` = 12, `dupCount` = 6, `firstHref` = "galerie.html#album/jarni", `firstLabel` = "Jarní koncert", `animName` = "genre-marquee".

- [ ] **Step 4: Ověřit, že marquee se skutečně hýbe a pauzuje na hover (Playwright)**

Run (MCP): `mcp__plugin_playwright_playwright__browser_evaluate` s funkcí (změří posun v čase):
```javascript
() => new Promise(function (resolve) {
  var track = document.querySelector('#genreRow .genre-track');
  function x() {
    var m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    return m.m41;
  }
  var start = x();
  setTimeout(function () { resolve({ moved: Math.abs(x() - start) > 0.5 }); }, 600);
})
```
Expected: `moved` = true (pás se za 600 ms posunul).

Run (MCP): `mcp__plugin_playwright_playwright__browser_hover` na první kartu
(ref z `browser_snapshot`), poté znovu `browser_evaluate`:
```javascript
() => new Promise(function (resolve) {
  var track = document.querySelector('#genreRow .genre-track');
  function x() { return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41; }
  var start = x();
  setTimeout(function () { resolve({ pausedStill: Math.abs(x() - start) < 0.5 }); }, 600);
})
```
Expected: `pausedStill` = true (při najetí myší se pás zastaví).

- [ ] **Step 5: Vizuální kontrola (screenshot)**

Run (MCP): `mcp__plugin_playwright_playwright__browser_take_screenshot`
(uložit do scratchpadu). Zkontroluj vizuálně: žádný scrollbar pod kartami,
karty jsou čtvercové se zaoblenými rohy, název alba pod fotkou, sekce vypadá
konzistentně se zbytkem stránky.

- [ ] **Step 6: Commit**

```bash
git add js/home.js css/style.css
git commit -m "feat: autoscroll marquee teaseru galerie na Home"
```

---

## Self-Review

**Spec coverage:**
- Nekonečný autoscroll doleva + pauza na hover → Task 2, Step 2 (`animation` + `:hover` pause), ověřeno Step 4. ✅
- Respektuje `prefers-reduced-motion` → Task 2, Step 2 (media query). ✅
- Zmizí scrollbar → Task 2, Step 2 (`overflow:hidden`, odstraněn `overflow-x:auto`), vizuálně Step 5. ✅
- Zachovaný styl karet → Task 2, Step 1 (stejná `.thumb` + `<p>` struktura). ✅
- 6 vybraných alb (jarni, advent, serenada, film, zakulisi, general) → Task 2, Step 1 `TEASER_IDS`. ✅
- Proklik na konkrétní album → Task 2, Step 1 (`href="galerie.html#album/<id>"`), ověřeno Step 3. ✅
- Přesun dat do `CN.ALBUMS`, galerie beze změny → Task 1, ověřeno Step 3–4. ✅
- Bezešvá smyčka (2× sada, aria-hidden duplikát) → Task 2, Step 1–2. ✅
- `index.html` beze změny → žádná úloha ho nemění. ✅

**Placeholder scan:** Žádné TBD/TODO; všechny kroky obsahují konkrétní kód a očekávané výsledky. ✅

**Type consistency:** `CN.ALBUMS` položky (`id`, `name`, `photos`) definované v Tasku 1 se shodují s použitím v Tasku 2. Třídy `.genre-track`/`.genre-card` a `@keyframes genre-marquee` se shodují mezi `home.js` a `style.css`. ✅
