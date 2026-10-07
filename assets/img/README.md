# Webové obrázky – Capella Nostra

Jediný zdroj fotek pro web. Stránky berou obrázky **jen odtud** (Unsplash na webu nesmí zůstat). Originály jsou v `Podklady/` a nemění se.

Vygenerováno 5. 10. 2026 skriptem [`docs/scripts/make_images.py`](../../docs/scripts/make_images.py) (Python + Pillow: výřez, zmenšení Lanczos, jemné doostření, WebP kvalita 82, `method=6`). Když přibude nebo se vymění fotka, spusťte skript znovu – přepisuje jen soubory v `assets/img/`.

## Jak obrázky používat

- **Formát:** všechno je WebP (umí ho všechny současné prohlížeče), jen `assets/og-cover.jpg` je JPEG kvůli sociálním sítím.
- **Vždy `srcset` + `sizes`**, ať mobil nestahuje velkou verzi. Uvádějte `width`/`height` (nebo CSS `aspect-ratio`) proti poskakování layoutu a `loading="lazy"` u všeho mimo první obrazovku.
- **V JS** je helper `CN.photo` v `js/data.js` (cesta funguje z kořene webu i z `/en/`):

```js
CN.photo.member('suk', 960)                  // assets/img/clenove/suk-960.webp
CN.photo.memberSrcset('suk')                 // "…suk-480.webp 480w, …suk-960.webp 960w"
CN.photo.still('09-soubor-cely-stredni-celek', 1600)
CN.photo.stillSrcset('09-soubor-cely-stredni-celek')   // 960w, 1600w, 2560w
CN.photo.shoot('suk-alt')                    // foceni/suk-alt-1600.webp (3:2)
CN.photo.ensemble(2400, true)                // soubor/souborovka-16x9-2400.webp
CN.photo('snimky/13-housle-tma-sekce-2560.webp')         // libovolný soubor
CN.photo.MEMBERS, CN.photo.MEMBER_ALTS, CN.photo.STILLS   // seznamy názvů
```

- **V HTML** stačí relativní cesta, např.:

```html
<img src="assets/img/clenove/plavec-480.webp"
     srcset="assets/img/clenove/plavec-480.webp 480w, assets/img/clenove/plavec-960.webp 960w"
     sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, 240px"
     width="480" height="600" loading="lazy" alt="Daniel Plavec s houslemi">
```

## Pravidla k obsahu (z briefu)

- **Snímky z videí** (`snimky/`) jsou z natáčení bez publika. **Nikdy je nepopisujte jako konkrétní koncert** a neuvádějte místo ani autora natáčení. U karet koncertů jsou jen ilustrační (alt: „Capella Nostra při hraní (ilustrační snímek z natáčení souboru)“).
- **Hosty** ve videích (flétnistka, hráčka na rámový buben) nejmenujeme ani neřešíme.
- **MgA. Michal Hanuš** fotku nemá a mít nebude. Žádná silueta ani zástupný avatar.
- **Společná fotka** je bez Michaela Stehna a Michala Hanuše – nepopisovat ji jako soubor v úplném složení.
- Alt texty: jméno + nástroj u portrétů, obecný popis děje u snímků.

---

## 1. Portréty členů – `clenove/` (výřez 4 : 5)

Výřez na střed z plné výšky originálu, hlava i nástroj zůstávají v záběru. Dvě šířky: **480 px** (mřížky, mobil) a **960 px** (retina, medailon). Limit pro 960 px je ~150 kB, skutečnost 30–60 kB.

| Soubor (`clenove/…`) | Kdo | Zdroj | Rozměry, velikost | Co je na fotce |
|---|---|---|---|---|
| `suk-480.webp`<br>`suk-960.webp` | Adam Suk – cembalo, umělecký vedoucí | `suk1.jpg` | 480 × 600, 13 kB<br>960 × 1200, 30 kB | uvolněný postoj, ruka v kapse, bez nástroje (cembalo se nepřenáší) |
| `plavec-480.webp`<br>`plavec-960.webp` | Daniel Plavec – housle, koncertní mistr | `plavec.jpg` | 480 × 600, 18 kB<br>960 × 1200, 40 kB | housle a smyčec u hrudi |
| `zdvihalova-480.webp`<br>`zdvihalova-960.webp` | Marie Zdvihalová – housle | `zdvihalova.jpg` | 480 × 600, 23 kB<br>960 × 1200, 58 kB | housle u ramene, úsměv |
| `majvaldova-480.webp`<br>`majvaldova-960.webp` | Tereza Majvaldová – housle | `majvaldova.jpg` | 480 × 600, 22 kB<br>960 × 1200, 52 kB | housle v náručí, krajkové šaty |
| `kabrt-480.webp`<br>`kabrt-960.webp` | Jiří Kábrt – housle, viola | `kabrt.jpg` | 480 × 600, 18 kB<br>960 × 1200, 43 kB | housle v rukou, úsměv |
| `janicek-480.webp`<br>`janicek-960.webp` | Adam Janíček – housle, viola | `janicek.jpg` | 480 × 600, 17 kB<br>960 × 1200, 39 kB | housle svisle před tělem |
| `jadrny-480.webp`<br>`jadrny-960.webp` | Tadeáš Jadrný – violoncello | `jadrny.jpg` | 480 × 600, 21 kB<br>960 × 1200, 50 kB | violoncello výrazně v popředí |
| `svetlikova-480.webp`<br>`svetlikova-960.webp` | Ema Světlíková – kontrabas | `svetlikova2.jpg` | 480 × 600, 22 kB<br>960 × 1200, 55 kB | standardní póza s kontrabasem |
| `rykr-480.webp`<br>`rykr-960.webp` | Tomáš Rykr – hoboj | `rykr.jpg` | 480 × 600, 18 kB<br>960 × 1200, 43 kB | úsměv, hoboj v ruce, celý obličej vidět |
| `linkova-480.webp`<br>`linkova-960.webp` | Amélie Linková – hoboj | `linkova.jpg` | 480 × 600, 23 kB<br>960 × 1200, 56 kB | ⚠️ kabát a kostkovaná šála – jediná fotka, kde není černé oblečení |
| `stehno-480.webp`<br>`stehno-960.webp` | Michael Stehno – trubka, management | `Stehno.jpg` | 480 × 600, 17 kB<br>960 × 1200, 44 kB | ⚠️ jiné focení (chodba s dřevěným obložením, oblek a bílá košile); barevně dorovnáno, viz níže |

**Kde se hodí:** stránka Členové (mřížka hráčů, medailon Adama Suka), ukázka členů na O souboru a na úvodu.

### Alternativní portréty (pro galerii)

| Soubor (`clenove/…`) | Kdo | Zdroj | Rozměry, velikost | Proč není hlavní |
|---|---|---|---|---|
| `suk-alt-480.webp`<br>`suk-alt-960.webp` | Adam Suk | `suk2.jpg` | 480 × 600, 15 kB<br>960 × 1200, 34 kB | založené ruce, působí odměřeněji |
| `rykr-alt-480.webp`<br>`rykr-alt-960.webp` | Tomáš Rykr | `rykr2.jpg` | 480 × 600, 16 kB<br>960 × 1200, 38 kB | hraje na hoboj, nástroj zakrývá ústa |
| `svetlikova-alt-480.webp`<br>`svetlikova-alt-960.webp` | Ema Světlíková | `svetlikova1.jpg` | 480 × 600, 19 kB<br>960 × 1200, 44 kB | hravá póza, kontrabas naležato, nakloněný záběr |

### Michael Stehno – barevné dorovnání

Fotka je z jiného focení (tmavší, plošší, teplé dřevo v pozadí). Webové verze jsou **jemně dorovnané** k hlavnímu focení: hlubší černá s lehce modravým nádechem jako u ostatních, jasnější světla, mírně prosvětlené středy a utlumené teplé tóny dřeva. Pleť ani tvar se nemění. Porovnání: `Podklady/snimky/_prehled/stehno-porovnani.jpg`. Pozadí (dřevěné obložení místo oken) zůstává jiné – úplně to sjednotí jen přefocení.

## 2. Celé záběry z focení – `foceni/` (3 : 2, šířka 1600 px)

Neoříznuté verze všech 14 portrétů (11 hlavních + 3 alternativy) pro **galerii a lightbox**, kde výřez 4 : 5 není potřeba. Názvy jako u portrétů, Stehno je i zde dorovnaný.

| Soubor (`foceni/…`) | Rozměry, velikost |
|---|---|
| `suk-1600.webp` | 1600 × 1067, 37 kB |
| `plavec-1600.webp` | 1600 × 1067, 47 kB |
| `zdvihalova-1600.webp` | 1600 × 1067, 58 kB |
| `majvaldova-1600.webp` | 1600 × 1067, 56 kB |
| `kabrt-1600.webp` | 1600 × 1067, 48 kB |
| `janicek-1600.webp` | 1600 × 1066, 44 kB |
| `jadrny-1600.webp` | 1600 × 1066, 52 kB |
| `svetlikova-1600.webp` | 1600 × 1067, 60 kB |
| `rykr-1600.webp` | 1600 × 1066, 46 kB |
| `linkova-1600.webp` | 1600 × 1066, 58 kB |
| `stehno-1600.webp` | 1600 × 1066, 52 kB |
| `suk-alt-1600.webp` | 1600 × 1067, 41 kB |
| `rykr-alt-1600.webp` | 1600 × 1067, 42 kB |
| `svetlikova-alt-1600.webp` | 1600 × 1067, 49 kB |

## 3. Společná fotka – `soubor/`

Zdroj `souborovka.jpg`. Deset členů v řadě ve světlém foyer s velkými okny, každý se svým nástrojem (chybí Michael Stehno a Michal Hanuš). Pozadí s okny a cihlovou budovou je trochu rušivé.

| Soubor (`soubor/…`) | Poměr | Rozměry, velikost | Kde se hodí |
|---|---|---|---|
| `souborovka-1200.webp` | 3 : 2 | 1200 × 800, 103 kB | O souboru, Členové (v šířce obsahu) |
| `souborovka-2400.webp` | 3 : 2 | 2400 × 1600, 258 kB | totéž pro retina displeje |
| `souborovka-16x9-1200.webp` | 16 : 9 | 1200 × 675, 98 kB | pás přes šířku, náhled, mobil |
| `souborovka-16x9-2400.webp` | 16 : 9 | 2400 × 1350, 245 kB | pás přes celou šířku na velkých displejích |
| `souborovka-kruh-600.webp`<br>`souborovka-kruh-1200.webp` | 1 : 1 | 600 × 600, 38 kB<br>1200 × 1200, 93 kB | kruhový rámeček (úvod, sekce Členové): celý soubor včetně kontrabasu. Strop a podlaha jsou nahoře a dole prodloužené, aby se celá řada vešla do kruhu; lidí se úprava netýká. Skript [`docs/scripts/make_souborovka_kruh.py`](../../docs/scripts/make_souborovka_kruh.py). |

Výřez 16 : 9 bere celou šířku a ubírá jen strop a podlahu; hlavy ani nohy uříznuté nejsou. Širší panorama by už řezalo.

## 4. Snímky z videí – `snimky/` (16 : 9)

33 snímků (01–15 a 16–34 níže, číslo 19 je vyřazené). Prvních 15 vybraných momentů z natáčení (z 4K, vždy nejostřejší snímek z okolí ±0,6 s). Tři šířky: **960** (karty, mobil), **1600** (obsah, notebook), **2560** (celoplošné pozadí, retina) = 960 × 540, 1600 × 900, 2560 × 1440 px. Limit pro 2560 px je ~400 kB, skutečnost 87–357 kB. Názvy: `<číslo>-<popis>-<šířka>.webp`.

| Snímek (`snimky/…`) | Co je na něm | Kde se hodí | 960 / 1600 / 2560 |
|---|---|---|---|
| `01-hlavni-lod-siroky-celek-…` | Celek přes celou loď kostela od vstupu: řady dřevěných židlí, soubor malý na konci uličky, kamenné zdi, hodně světla. | Pozadí úvodu stránky Koncerty (hodně volného místa nahoře pro text). | 77 kB / 175 kB / 348 kB |
| `02-cembalo-suk-profil-…` | Adam Suk u zeleného zdobeného cembala z profilu, v pozadí kontrabas a violoncello. | Medailon Adama Suka (Členové), O souboru. | 40 kB / 73 kB / 122 kB |
| `03-cembalo-ruce-detail-…` | Detail rukou na klaviatuře cembala, zdobená deska s ornamentem, noty. | Detail, pozadí sekce, galerie. | 51 kB / 90 kB / 148 kB |
| `04-violoncello-kontrabas-skupina-…` | Basová skupina: violoncello a kontrabas v popředí, za nimi další hráči. ⚠️ V záběru je i hostující hráčka na rámový buben. | Galerie, Členové. | 58 kB / 107 kB / 181 kB |
| `05-housle-detail-sekce-…` | Houslová sekce zblízka, hráči v pohybu, kamenná zeď za nimi. | Galerie. | 44 kB / 78 kB / 132 kB |
| `06-hoboje-duo-…` | Hobojové duo (Tomáš Rykr a Amélie Linková) u pultů. | Galerie, Členové (hoboje). | 42 kB / 81 kB / 145 kB |
| `07-soubor-bocni-pohled-lod-…` | Celý soubor z boku, v popředí řady židlí, prostor kostela. | Pozadí sekce (soubor + prostor), karta koncertu. | 76 kB / 167 kB / 323 kB |
| `08-housle-rada-hloubka-…` | Řada houslistů do hloubky, ostrý první hráč. | Galerie, O souboru. | 57 kB / 106 kB / 185 kB |
| `09-soubor-cely-stredni-celek-…` | Celý soubor při hraní ve středním celku: housle vlevo, cembalo uprostřed, hoboje, violoncello a kontrabas vpravo. | **Hlavní fotka souboru při hraní** (O souboru, úvod, náhled videa). Z ní je i `og-cover.jpg`. | 76 kB / 158 kB / 285 kB |
| `10-housle-svetlo-okno-…` | Housle v protisvětle od okna, světlá kamenná zeď. | Galerie, pozadí. | 46 kB / 86 kB / 144 kB |
| `11-fletna-solistka-…` | Sólistka na flétnu zblízka. ⚠️ Hostující hráčka, není členkou souboru – nejmenovat a nepoužívat jako fotku člena. | Jen galerie (nebo vůbec). | 27 kB / 49 kB / 87 kB |
| `12-housle-tma-detail-…` | Housle nasvícené do tmy, černé pozadí, boční světlo, detail. | Tmavá sekce, výzva (CTA), náhled videa. | 26 kB / 48 kB / 91 kB |
| `13-housle-tma-sekce-…` | Tři houslisté ve tmě, boční světlo. | **Hero / tmavé pozadí s bílým textem** (statická varianta a poster pro video). | 28 kB / 53 kB / 96 kB |
| `14-kontrabas-violoncello-usmev-…` | Ema Světlíková (kontrabas, s úsměvem) a Tadeáš Jadrný (violoncello). | Galerie, Členové. | 50 kB / 93 kB / 165 kB |
| `15-soubor-slunecni-skvrny-…` | Soubor v presbytáři, na podlaze sluneční skvrny, v popředí židle. | Pozadí sekce, O souboru, karta koncertu. | 82 kB / 186 kB / 357 kB |

### Další snímky 16–34 (7. 10. 2026)

18 dalších momentů (číslo 19 bylo vyřazeno – nepovedený záběr), vybraných hlavně pro **karty koncertů** (archiv má výřez 4 : 3, nadcházející 16 : 10, obojí z 16 : 9 bere jen kraje). Vznikly skriptem [`docs/scripts/make_concert_stills.py`](../../docs/scripts/make_concert_stills.py): náhledové archy všech záběrů po střizích, ruční výběr bez záběrů s hosty (flétnistka, rámový buben), s rozmazanými hlavami v popředí nebo s mobilem na pultu, pak nejostřejší snímek z okolí ±0,2 s. Velikosti a limity jako u 01–15 (960: 22–84 kB, 1600: 45–195 kB, 2560: 83–386 kB). 4K originály jsou ve `Podklady/vybrane-snimky/`, přehled ve výřezu 4 : 3 je `Podklady/snimky/_prehled/snimky-16-34.jpg`.

| Snímek (`snimky/…`) | Co je na něm |
|---|---|
| `16-housle-u-pultu-…` | Pět houslistů ve stoje u pultů, polocelek, kamenná zeď a dveře. |
| `17-housle-trojice-…` | Tři houslisté zblízka, ostré obličeje. |
| `18-cembalo-kontrabas-…` | Cembalista u zeleného cembala z boku, v pozadí kontrabas. |
| `20-housle-sekce-pult-…` | Houslistky a houslista u pultu, paškál v pozadí. |
| `21-violoncello-kontrabas-hoboj-…` | Violoncello a kontrabas v popředí, hobojistka vzadu. |
| `22-pohled-od-cembala-…` | Pohled přes rameno cembalisty na soubor (housle, hoboj, kontrabas). |
| `23-housle-sekce-popredi-…` | Houslová sekce do hloubky, rozostřený hráč v popředí vlevo. |
| `24-violoncello-kontrabas-zblizka-…` | Violoncello zblízka, kontrabas a hobojistka za ním. |
| `25-soubor-za-cembalem-…` | Celý soubor zepředu, uprostřed cembalista zezadu. |
| `26-housle-hoboje-…` | Houslista a dva hobojisté u oltáře. |
| `27-kontrabas-violoncello-duo-…` | Kontrabasistka a violoncellista, hodně vzduchu, čistá kompozice. |
| `28-soubor-presbytar-zboku-…` | Celý soubor v presbytáři, v popředí řada židlí. |
| `29-housle-trojice-pohyb-…` | Tři houslisté v pohybu, rozmáchlé smyčce. |
| `30-housle-tma-dvojice-…` | Dva houslisté nasvícení do tmy (série z videa 04). |
| `31-housle-tma-trojice-…` | Tři houslisté ve tmě, boční světlo. |
| `32-cembalo-tma-…` | Cembalista v šeru, za ním houslisté. |
| `33-soubor-slunce-ulicka-…` | Soubor v presbytáři se slunečními skvrnami, dlouhý pohled přes židle. |
| `34-soubor-slunce-presbytar-…` | Totéž blíž, sluneční skvrny na podlaze. |

**Kde už se používají:** ilustrační obrázky karet koncertů v `js/data.js` – nadcházející 30 (Dušičkový koncert), 25, 24; archiv 22, 17, 26, 18 – každá karta jiný nástroj nebo pohled. Původně 09, 15, 07 a 08, 05, 04, 14 (04 má v záběru hostující hráčku na buben). Výměna = jen jiný slug u daného koncertu v `js/data.js`.

**Galerie (od 7. 10. 2026):** tři alba v `js/data.js` (obálky 09, galerie/cembalo-tma, foceni/zdvihalova); album Při hraní obsahuje i snímky 16, 20, 22, 24, 25, 26, 27, 29 a 30. Skoro stejné záběry (31 ≈ 13, 32 ≈ galerie/cembalo-tma, 34 ≈ 15, 28/33 ≈ galerie/soubor-celek-zepredu, 18 ≈ 02) v albech nejsou a 04 vypadl kvůli hostující hráčce na buben. Náhledy videí v `js/galerie.js`: Marche 16, Ouverture 28, Largo galerie/housle-tma-smycce.

## 5. Náhled pro sociální sítě – `assets/og-cover.jpg`

| Soubor | Rozměry, velikost | Co je na něm |
|---|---|---|
| `assets/og-cover.jpg` | 1200 × 630, 145 kB | Výřez ze snímku 09: celý soubor při hraní v kostele (housle, cembalo, hoboje, violoncello, kontrabas). |

Odkazují na něj `og:image` všech stránek (absolutní URL s předpokládanou doménou capellanostra.cz).

## Co chybí

- Fotka **MgA. Michala Hanuše** (nebude).
- **Fotky z koncertů** nejsou; archiv a galerie stojí na focení a snímcích z videí.
- Volitelně přefotit **Michaela Stehna** a **Amélii Linkovou** ve stejném prostředí a oblečení jako ostatní.
- Autor fotek a souhlas s jejich použitím na webu (otázka na klienta).
