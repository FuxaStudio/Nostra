# Handoff: Capella Nostra — Website (6 pages)

## Overview
Marketing website for Capella Nostra, a Czech chamber orchestra. Six pages: Home (Domů), Concerts (Koncerty), About (O nás), Members (Členové), Gallery (Galerie), Contact (Kontakt). Copy is in Czech; the site has a CZ/EN toggle in the header (only the flag+label actually switches today — no localized copy behind it yet, see Interactions).

## About the Design Files
The bundled `.dc.html` files are **design references built in an internal HTML prototyping tool** — not production code to copy verbatim. They use a custom templating syntax (`{{ }}` bindings, `<sc-for>`/`<sc-if>` loop/conditional tags, a `support.js` runtime) that only runs inside that tool. Treat every file as a high-fidelity, interactive mockup of layout, copy, and behavior. Rebuild it in the target codebase's real stack (e.g. React/Next.js, Vue/Nuxt, or plain templated HTML/CSS/JS — whichever the project already uses; if there is no existing codebase, choose the framework that best fits a marketing site with a few dynamic bits: a contact form, a gallery lightbox, a load-more list).

Do not try to run these files as-is or `<script src>` a runtime for them — reimplement the same DOM/CSS structure and the described interactions/state.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, and copy are final as shown. Reproduce pixel-accurately using the tokens below. Placeholder images are unsplash.com / rpo.co.uk stock photography used only to show composition — replace with the client's real photography before launch (see Assets).

## Design Tokens

**Color**
- Primary blue: `#003FFF` (headers, buttons, section backgrounds, active nav pill)
- Blue hover: `#0030c4`
- Near-black navy (text): `#111a44`
- Secondary text (navy-gray): `#3a4366`
- Muted text: `#5b6a9a`
- Faint muted text: `#7c86a8` / `#8a93b5`
- Cream/off-white section background: `#f7f5f2`
- Very dark navy (hero overlays): `#0a1330` / `rgba(8,12,40,…)`
- White: `#fff`
- Card borders: `#ececf4` / `#e7eaf4` / `#dfe2ee` / `#d7dbec`
- Error red: `#d83a3a`
- Archive/desaturated tone: `#a79a7e` / `#6b6253` (on `#e9e5dc` cards, photos at `grayscale(.42) contrast(.97)`)

**Typography**
- Font: Schibsted Grotesk (Google Fonts), weights 400/500/600/700/800. Fallback `system-ui, -apple-system, sans-serif`.
- H1 (page hero): `clamp(28px,3–4.4vw,40–56px)`, weight 700, letter-spacing `-.012em` to `-.014em`, line-height ~1.03–1.1
- H2 (section heading): `clamp(26px,2.6–3.4vw,32–46px)`, weight 700, same tracking
- H3 (card title): 16–24px, weight 700
- Body: 14–19px, weight 400–600, line-height 1.3–1.62
- Eyebrow/label (e.g. "O NÁS", "KONTAKT"): 13–15px, weight 700, letter-spacing `.02em`–`.16em`, often uppercase
- Footer wordmark: `clamp(46px,8.4vw,132px)`, weight 800, letter-spacing `-.025em`, line-height 0.9

**Spacing / radius / shadow**
- Section vertical padding: 76–110px desktop
- Content max-width: 1280–1320px (footer/hero sometimes 1180px), side padding 40px (24px on nav container)
- Card radius: 14–24px; pill buttons/nav: `border-radius: 30–48px` (fully rounded)
- Button padding: ~13–15px vertical, 22–32px horizontal
- Card shadow: `0 1px 3px rgba(17,26,68,.07)` resting, `0 14–18px 30–38px rgba(17,26,68,.14–.15)` on hover (with `translateY(-4/-5px)`)
- Hero/CTA shadow (floating white card on photo): `0 18–26px 50–70px rgba(0,0,0,.24–.34)`

## Shared Components (used on every page)

### Header / nav
Sticky (`position: sticky; top: 0`), white page background behind it, `padding: 18px 22px 0`. Inner bar: max-width 1320px, `background:#003FFF`, `border-radius: 48px`, flex row, `padding: 13px 22px 13px 26px`, `box-shadow: 0 6px 30px rgba(0,20,90,.18)`.
- Left: logo image (46×46px, `border-radius:8px`, `object-fit:cover`) + wordmark "Capella Nostra" (white, 800 weight, 13px).
- Nav links (right-aligned via `margin-left:auto`, `gap:26px`): Domů, Koncerty, O nás, Členové, Galerie, Kontakt — white, 15px, weight 500; the **current page's link** is styled as an active pill: weight 700, `background: rgba(255,255,255,.18)`, `padding:8px 15px`, `border-radius:30px`.
- CTA button "Poptat koncert →": white pill, blue text, links to `Kontakt.dc.html#poptavka`.
- Language toggle button: pill, `rgba(255,255,255,.16)` background, shows a small CZ or GB flag SVG (23×19px) + "CZ"/"EN" label; click toggles `isCs`/`isEn` state and swaps the flag+label only.

### Footer (identical on all 6 pages)
`background:#003FFF; color:#fff`. Max-width 1180px, `padding: 74px 44px 28px`, centered text.
- Giant wordmark "Capella Nostra" (footer type scale above).
- Tagline: "Hudba, která spojuje." (`#cdd7ff`, `clamp(17px,2vw,22px)`).
- Two circular social icons (Instagram, Facebook), 44×44px, `border:1.5px solid rgba(255,255,255,.55)`.
- Nav link row repeating the 6 page names.
- Contact line: `info@capellanostra.cz` · `+420 777 123 456` (mailto/tel links, underlined).
- `<hr>` divider (`rgba(255,255,255,.22)`).
- Bottom row: "Capella Nostra © 2026" (left), "Zásady ochrany osobních údajů" link (center), "Realizace webu: FuxaStudio" (right, bold+underlined studio name).

### Recurring visual motif
A faint SVG of layered wavy horizontal lines (`stroke: rgba(8,16,86,.26)`) is placed absolutely behind blue (`#003FFF`) CTA/feature sections across the site — use it as a decorative background texture on any full-bleed blue section.

## Screens / Pages

### 1. Home (`Home.dc.html`)
- **Hero**: full-bleed dark hero (min-height 760px) with an auto-rotating background photo (3 slides, 7s interval) and gradient overlay. Bottom-aligned content: 3-slide "now playing" carousel — the active slide renders as a white card (progress bar + 4s-easing race animation, thumbnail, title, date, location, "Detail koncertu →" button); the two inactive slides render as smaller frosted-glass "peek" buttons (`backdrop-filter: blur(9px)`) that activate on click and reset the timer.
- **Featured events**: cream background. Left: sticky (`top:100px`) large 663px-tall photo card with an overlaid white info panel (title, subtitle, date/location icons, CTA) for the top event. Right: vertical list of up to 8 event rows (thumbnail 104×104, title, subtitle, date/location icons).
- **Season / O nás teaser**: blue section, row-reverse layout — text column (eyebrow, headline, paragraph, white pill CTA "Více o souboru →") + circular photo on the other side.
- **Recommendations / Members teaser**: cream, text column + a photo inside a double-ring circular frame (two concentric outlined circles, photo in the center ring) — CTA "Poznat členy →".
- **Gallery teaser**: dark navy section with a dimmed background photo. Horizontally scrollable row of genre cards (300×300px photo + label) — currently populated with orchestra "genre" placeholders; CTA "Celá galerie →" links to Galerie.dc.html.
- Two more sections ("The Orchestra", "Support") exist in the markup with `display:none` — English RPO-sourced leftover content, not part of this design; **do not implement them**.
- Footer as above.

### 2. Concerts (`Koncerty.dc.html`)
- **Hero**: single full-bleed photo, dark gradient overlay, eyebrow "NEJBLIŽŠÍ KONCERT", white floating card (max-width 580px) with title, description, date/time + venue rows, "Vstupenky ↗" button.
- **Upcoming concerts grid**: eyebrow + "Sezóna 2026 / 2027" heading; responsive grid (`minmax(338px,1fr)`) of concert cards — photo (16:10) with a date-pill badge top-left, title, time/venue icon rows, description, outlined "Vstupenky ↗" pill (fills blue on hover). Grid shows an initial count (default 6, configurable) with a "Načíst další koncerty ↓" button to reveal the rest (no pagination reload — client-side reveal).
- **Archive section** (toggle-able, cream bg): "Proběhlé koncerty" grid of smaller cards, photos desaturated (`grayscale(.42) contrast(.97)`), a "proběhlo" checkmark badge, links out to Gallery.
- **Inquiry CTA** (toggle-able, blue, wave-texture bg): centered headline + "Poptat koncert →" button.
- Footer.

### 3. About (`O nás.dc.html`)
Eight stacked sections, alternating white/cream/blue backgrounds:
1. **Intro**: headline + intro paragraph + two CTAs, circular double-ring photo on the right; optional 4-column stat strip below (toggle-able) — "2014 rok založení", "120+ koncertů", "18 členů", "30+ míst".
2. **Our story**: photo + narrative text (2 paragraphs); optional horizontal timeline below (toggle-able) — 4 milestone dots with year + one-line description, connected by a horizontal rule.
3. **Mission** (blue, wave texture): headline + intro paragraph, then 3 equal feature cards ("Tradice", "Preciznost", "Zážitek") each with a circular icon badge, title, description.
4. **Artistic director**: circular photo (Jan Kohout) + name, role, bio paragraph, optional pull-quote in a blue left-border blockquote (toggle-able).
5. **Repertoire** (cream): text column + wrapping pill-tag list of genres (Klasicismus, Romantismus, Baroko, Sakrální hudba, Filmová hudba, Soudobá tvorba).
6. **Where we perform**: 4-column card grid (Historické kostely / Koncertní sály / Zámky a paláce / Kulturní festivaly), each with an icon, title, one-line subtitle.
7. **Members teaser** (cream): heading + description + "Poznat členy →" CTA, row of 8 circular member headshots (74px) plus a dashed "+10 dalších" circle linking to Členové.
8. **Inquiry CTA** (blue, wave texture) — same pattern as Concerts page.
Footer.

### 4. Members (`Členové.dc.html`)
- **Intro**: eyebrow "Soubor", H1 "Lidé za naším zvukem", lead paragraph.
- **Artistic leadership** (blue, wave texture, row-reverse): large circular photo (320px) of the conductor (Jan Kohout — "Dirigent & umělecký vedoucí") + name/role/bio; optional (toggle-able) row of 2 leadership chips (Koncertní mistryně, Sbormistr) each with a small round photo, name, role, in a translucent pill.
- **Musicians grid** (cream): heading "Členové souboru" + live count ("{{count}} hudebníků"), 5-column grid of circular portraits (24 members) with name + instrument role beneath; optional (toggle-able) thin blue ring overlay on each portrait; optional grayscale filter toggle.
- Footer.
- Member data: 24 named musicians grouped by section (1./2. housle, viola, violoncello, kontrabas, flétna, hoboj, klarinet, fagot, lesní roh, trubka, pozoun, harfa, klavír & cembalo, tympány & bicí) — full names are in the source file, reuse verbatim.

### 5. Gallery (`Galerie.dc.html`)
Two views toggled by client-side state (no separate URLs in the prototype — implement as routes/pages in production):

**A. Gallery index** (default view)
- Header block: eyebrow "Galerie", H1, intro paragraph.
- Filter pills: Vše / Koncerty / Zkoušky & zákulisí / Videa — active pill is filled blue, others outlined gray.
- Album grid (`minmax(340px,1fr)`): each card = 4:3 cover photo with a category badge (top-left) and a photo-count badge (bottom-right, e.g. "12 fotek"), then title + date below. 9 albums total, initial visible count 6 with a "Načíst další alba" reveal button.
- When filter = "Videa": grid switches to video cards (16:9 thumbnail, centered play-button circle, duration badge bottom-right, title below).
- "Videa" section below the grid (shown when filter = "all" and videos enabled): same video-card treatment, 3 clips.

**B. Album detail view** (opened by clicking an album card; "Zpět na galerii" link returns)
- Header: back link, eyebrow "Album · {category}", H1 album name, description, meta row (date/location/photo count icons).
- Responsive photo grid (`minmax(260px,1fr)`, square crops) — clicking a photo opens the lightbox.

**Lightbox** (overlay, `rgba(7,11,28,.95)`, fades in): 
- Photo mode: title/date top-left, counter ("3 / 12") + close button top-right, large centered photo with prev/next circular arrow buttons either side, a horizontal filmstrip of thumbnails at the bottom (click to jump). Keyboard: Esc closes, ←/→ navigate.
- Video mode: title + close button, centered 16:9 placeholder player (play icon, "YouTube · placeholder" label — wire up a real embed in production), a mock scrubber bar with elapsed/duration text.

Footer (present in both views).

### 6. Contact (`Kontakt.dc.html`)
Two-column split section (id `poptavka`, so header CTAs and other pages can deep-link `#poptavka`), cream background:
- **Left**: eyebrow "KONTAKT", H1 "Ozvěte se nám", intro paragraph, divider, then two icon+label rows (E-MAIL → `info@capellanostra.cz`, TELEFON → `+420 777 123 456`) each in its own rounded icon chip; optional (toggle-able) "SOCIÁLNÍ SÍTĚ" row of 4 circular icon buttons (Instagram, Facebook, YouTube, Spotify).
- **Right**: contact form card (white, rounded 24px, shadow) with fields — Jméno* (text), E-mail* (email), Telefon (tel), Zpráva* (textarea), a required GDPR consent checkbox with linked policy text, submit button "Odeslat poptávku →". Optional helper line "Odpovídáme zpravidla do dvou pracovních dnů." above the fields (toggle-able).
- Footer.

## Interactions & Behavior
- **CZ/EN toggle** (all pages): swaps only the header flag icon + "CZ"/"EN" label; no copy actually localizes today. Decide with the client whether real i18n is in scope — if so, all Czech copy in this handoff needs English equivalents.
- **Home hero carousel**: auto-advances every 7s; clicking a "peek" slide jumps to it and resets the 7s timer; the active card's progress bar is a 7s linear CSS animation synced to the interval.
- **Concerts "load more"**: reveals the remaining upcoming-concert cards in place (no pagination/route change).
- **Gallery filters**: client-side filtering by category (Vše/Koncerty/Zkoušky & zákulisí/Videa); switching filter resets the "load more" expanded state.
- **Gallery "load more albums"**: same reveal-in-place pattern as Concerts.
- **Gallery album open/close**: click a card → album detail view (scrolls to top); "Zpět na galerii" returns to index (scrolls to top).
- **Lightbox**: opens on photo/video click; closes on backdrop click, close button, or Esc; photo mode supports prev/next via buttons, thumbnail strip, and arrow keys; clicking the content area itself does not close it (only backdrop).
- **Contact form validation**: required — Jméno, E-mail (must match a basic email regex), Zpráva, and GDPR checkbox (checkbox requirement is itself toggle-able via a prop). Errors show inline below each invalid field in red (`#d83a3a`) on submit attempt; valid submit swaps the form for a success panel ("Děkujeme za zprávu!") with a "Odeslat další zprávu" reset button. **No backend wired up** — implement real submission (email/CRM/etc.) in production.
- **Hover states** throughout: buttons darken/invert fill, cards lift (`translateY(-4px to -5px)`) with a deeper shadow, outlined pills fill solid on hover — apply consistently to any new buttons/cards using the same easing (`.15s–.2s ease`).
- **Focus states**: form inputs get a blue border + `box-shadow: 0 0 0 3px rgba(0,63,255,.13)` on focus.

## State Management
- Language selection (`cs`/`en`) — currently local per-page component state, resets on navigation; centralize in production (e.g. context/store + persisted preference) if real i18n is added.
- Home: active hero-carousel index (0–2), auto-advance timer.
- Concerts: expanded/collapsed state for the upcoming-concerts list.
- Gallery: current view (`gallery`/`album`), active filter, expanded/collapsed album list, open album id, lightbox state (`null` / `{kind:'photo', albumId, i}` / `{kind:'video', video}`).
- Members: no interactive state beyond the language toggle.
- Contact: all form field values, per-field validation errors, submitted boolean.
- Several **content toggles are implemented as component props** in the prototype (booleans/enums controlling whether a section renders, e.g. show archive, show inquiry CTA, show stats/timeline/quote on About, show leadership row and grayscale on Members, show social/response-note on Contact, initial gallery filter and show-videos). Treat these as CMS/config flags worth carrying into production rather than hardcoding.

## Assets
- `logo-nostra-mqy3vj7u.png` — square logo mark, used at 40–46px in the header across all pages. Included in this bundle.
- All other imagery (hero photos, event photos, member portraits, gallery photos/thumbnails) are **temporary stock placeholders** pulled from unsplash.com and rpo.co.uk (Royal Philharmonic Orchestra's public site) for layout purposes only — every one of these must be replaced with Capella Nostra's own photography before launch. They are hot-linked, not bundled.
- All icons are inline SVG (chevrons, calendar, pin, social glyphs, flags, play button, checkmark, etc.) — recreate as an icon set/sprite in production rather than inline SVG per instance, for easier reuse.

## Files
- `Home.dc.html` — Home
- `Koncerty.dc.html` — Concerts
- `O nás.dc.html` — About
- `Členové.dc.html` — Members
- `Galerie.dc.html` — Gallery (index + album detail + lightbox)
- `Kontakt.dc.html` — Contact
- `logo-nostra-mqy3vj7u.png` — logo asset
- `support.js` — prototyping-tool runtime; **do not port this file**, it only exists to make the `.dc.html` files viewable outside the design tool
