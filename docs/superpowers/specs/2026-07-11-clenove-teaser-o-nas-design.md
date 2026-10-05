# Sekce „Členové" na o-nas.html — redesign (směr E1)

**Datum:** 2026-07-11
**Stránka:** o-nas.html, sekce `.members-teaser`
**Cíl:** Nahradit genericky působící řadu kulatých avatarů + dlaždici „+16 dalších"
osobitější a lidštější **portrétní páskou se jmény**, která ladí s klidným,
profesionálním tónem webu Capella Nostra.

## Kontext

Současná sekce je teaser s proklikem na `clenove.html`: hlavička (eyebrow
`ČLENOVÉ`, h2 „Lidé za hudbou", věta, tlačítko „Poznat členy →") a pod ní řada
8 kulatých fotek `.avatar` + kolečko `.avatar-more` „+16 dalších". Vzor „řada
koleček + počet" je genericky webový a klient s ním nebyl spokojený.

Zvažené směry (vizuálně přes brainstorming companion): A – editorial rozpis
sekcí (zamítnuto), B – portrétní mozaika, C – trojice karet osobností, D –
kinematický split, E – portrétní páska, F – kolážová sestava. Vybráno **E**,
následně zpřesněno na zakončení **E1** (bez dlaždice „+X").

## Finální podoba (E1)

**Hlavička** — beze změny struktury (`.section-head`): eyebrow `ČLENOVÉ`,
h2 „Lidé za hudbou", úvodní věta vlevo, tlačítko „Poznat členy →" vpravo.
Úvodní věta upravena na: **„Za jménem souboru je čtyřiadvacet muzikantů — pár
z nich hned poznáte."** (počet 24 zazní přirozeně v textu, ne jako chip.)

**Páska** — nový kontejner `.members-strip`: **6 hranatých portrétů** (zaoblené
rohy, poměr na výšku) v jedné řadě, pod každým **jméno + nástroj**. Žádná
dlaždice „+X". Jemný hover (lehké přiblížení fotky). Dlaždice jsou **dekorativní
(ne odkazy)** — protože individuální stránky členů nevzniknou, jediný proklik
nese tlačítko „Poznat členy →" v hlavičce (odkaz na tutéž stránku z každé
dlaždice by byl redundantní a matoucí).

**Vybraná šestice** (napříč nástrojovými sekcemi; fotky jsou placeholder
z Unsplash poolu, k pozdější výměně za vlastní — stejně jako zbytek webu):

| Jméno | Nástroj | Unsplash id |
|---|---|---|
| Eliška Marešová | Koncertní mistryně | 1610306673745-258854d4bbcd |
| Jakub Svoboda | 1. housle | 1755388601179-bebe91a7c907 |
| Veronika Krejčí | Viola | 1725215956940-91f616b95443 |
| Lukáš Fiala | Violoncello | 1643035921321-a060a99513c0 |
| Lucie Veselá | Hoboj | 1465821185615-20b3c2fbf41b |
| Jan Šťastný | Lesní roh | 1626913634123-2457b43792c1 |

Jména/role odpovídají datům na `clenove.html` (Eliška Marešová je tam vedená
jako koncertní mistryně mezi „leaders"). Fotky gender-matched.

**Responsivita:** 6 sloupců (desktop) → 3 (tablet) → 2 (mobil). Jména a nástroje
zůstávají pod fotkou. Breakpointy sladit s existujícími v `style.css`.

**Animace:** zachovat jemný scroll-reveal. Nový kontejner `.members-strip`
nahradí `.avatar-row` v seznamu `GROUPS` v `js/main.js`, takže dlaždice se
odhalí postupně za sebou (staggered), stejně jako dosud u avatarů.

## Dotčené soubory

- **o-nas.html** — přepsat blok `.avatar-row` (řádky ~142–152) na
  `.members-strip` se 6 dlaždicemi; upravit úvodní větu v `.section-head`.
- **css/style.css** — nahradit pravidla `.avatar-row / .avatar / .avatar-more`
  (řádky ~456–462) novými pravidly `.members-strip` a dlaždice (`.m-photo`,
  `.m-name`, `.m-role`) včetně hover a media queries.
- **js/main.js** — v `GROUPS` (řádek ~84) zaměnit `'.avatar-row'` za
  `'.members-strip'`.

## Mimo rozsah

- `o-nas-nahled.html` (starší pracovní náhled se stejnou řadou koleček) —
  ponechat beze změny.
- Individuální stránky/detaily členů — nevznikají.
- Výměna placeholder fotek za vlastní — otevřený bod celého webu, řeší klient.

## Přijetí (acceptance)

- Na o-nas.html je místo řady koleček páska 6 portrétů se jmény a nástroji,
  bez prvku „+X dalších".
- Jediný proklik na `clenove.html` je tlačítko „Poznat členy →".
- Layout funguje na desktopu (1440) i mobilu (≤390) bez horizontálního
  přetečení; na mobilu 2 sloupce.
- Scroll-reveal dlaždic funguje (postupné naskákání).
- Staré `.avatar*` styly a HTML jsou odstraněny (ověřeno, že se nepoužívají
  jinde než v `o-nas-nahled.html`, který je mimo rozsah).
