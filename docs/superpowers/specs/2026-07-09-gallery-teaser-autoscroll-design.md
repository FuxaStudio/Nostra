# Autoscroll teaser galerie (Home) — návrh

**Datum:** 2026-07-09
**Soubor sekce:** `index.html` → `<section class="genre-section">`

## Problém

Teaser galerie na domovské stránce (`.genre-section`) vykresluje karty ve
vodorovné řadě s `overflow-x:auto` ([css/style.css:354](../../../css/style.css)).
To produkuje viditelný scrollbar dole, který působí neelegantně, a karty jsou
dnes odvozené od *žánrů repertoáru* (`CN.GENRES`), ne od skutečného obsahu
galerie.

## Cíl

Nahradit ručně posuvnou řadu **nekonečným automatickým posuvem (marquee)** bez
scrollbaru a přepnout obsah karet z žánrů na **vybraná alba z galerie**.

## Chování (marquee)

- Karty jedou plynule doleva v nekonečné smyčce, pomalu (celý okruh cca 40–50 s),
  `linear` časování — bez trhání.
- **Pauza při najetí myší** (`:hover` → `animation-play-state: paused`), aby si
  návštěvník mohl kartu přečíst a kliknout na ni.
- **Respektuje `prefers-reduced-motion: reduce`**: bez animace se karty zobrazí
  v klidné zarovnané (wrap) mřížce — žádný pohyb, žádný scrollbar.
- `overflow-x:auto` na `.genre-row` je odstraněn → scrollbar zmizí.

## Karty

- Zachovaný **současný vizuální styl**: čtvercová fotka se zaoblenými rohy +
  název pod ní (žádný text přes fotku).
- Obsah = **obálka alba + název alba** z galerie (ne žánry).
- Zdroj čtvercové fotky: `album.photos[0]` (800×800), aby nedocházelo ke
  zkreslení.
- **Proklik vede přímo na dané album**: `galerie.html#album/<id>`. Hash routing
  už `galerie.js` podporuje (otevře konkrétní album po načtení stránky).

### Vybraná alba (6, mix koncertů + zákulisí)

| Pořadí | id         | Název                              | Kategorie |
|--------|------------|------------------------------------|-----------|
| 1      | `jarni`    | Jarní koncert                      | Koncerty  |
| 2      | `advent`   | Adventní koncert v katedrále       | Koncerty  |
| 3      | `serenada` | Letní serenáda na zámku            | Koncerty  |
| 4      | `film`     | Filmová hudba LIVE                 | Koncerty  |
| 5      | `zakulisi` | Zákulisí jarního turné             | Zákulisí  |
| 6      | `general`  | Generální zkouška: Dvořák          | Zkoušky   |

Výběr je definován seznamem id, takže se dá triviálně zaměnit.

## Pod tím

Tlačítko „Celá galerie →" (`galerie.html`) zůstává beze změny.

## Technický návrh

### Sdílení dat alb

Data alb dnes žijí lokálně uvnitř `galerie.js` (`var ALBUMS`). Přesunou se do
sdíleného `js/data.js` jako **`CN.ALBUMS`** (single source of truth vedle
`CN.CONCERTS`, `CN.PAST`, `CN.GENRES`).

- `galerie.js` přestane definovat vlastní `ALBUMS` a bude číst `CN.ALBUMS`.
- `home.js` z `CN.ALBUMS` vybere 6 alb podle seznamu id a vykreslí marquee.
- Odůvodnění: jinak by názvy/obálky teaseru a galerie mohly začít žít každý svým
  životem. Chování galerie zůstává identické.

### Marquee struktura

- Uvnitř `.genre-row` je posuvný „pás" `.genre-track`, do kterého se vybraná
  sada 6 karet vykreslí **2× za sebou** → smyčka nemá mezeru.
- Animace: `@keyframes` posun `translateX(0)` → `translateX(-50%)`,
  `linear infinite`. Posun o `-50%` = přesně šířka jedné sady, takže napojení je
  bezešvé.
- **Přístupnost:** druhá (duplikovaná) sada karet je `aria-hidden="true"`, aby
  čtečka nečetla názvy dvakrát.
- Volitelně full-bleed (pás přes celou šířku okna, hlavička a CTA zůstávají v
  `.container`) — rozhodne se při implementaci podle výsledného vzhledu; není to
  blokující požadavek.

### Dotčené soubory

| Soubor          | Změna |
|-----------------|-------|
| `js/data.js`    | Přidat `CN.ALBUMS` (přesun z galerie.js). |
| `js/galerie.js` | Číst `CN.ALBUMS` místo lokálního `ALBUMS`. |
| `js/home.js`    | Vykreslit marquee z vybraných `CN.ALBUMS` místo `CN.GENRES`. |
| `css/style.css` | Marquee animace + pauza na hover + reduced-motion fallback; odstranit `overflow-x:auto`. |
| `index.html`    | Beze změny (obsah generuje JS). |

## Mimo rozsah (YAGNI)

- Žádné ruční ovládací prvky (šipky/tečky) — marquee je čistě automatický.
- `CN.GENRES` je dnes použité **jen** tímto teaserem (jinde v projektu ne).
  Po změně zůstane v `data.js` nevyužité — necháme ho být (neškodí), nemažeme
  ho v rámci tohoto úkolu.
- Žádná změna lightboxu ani detailu alba.
