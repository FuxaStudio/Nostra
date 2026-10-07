# -*- coding: utf-8 -*-
"""Vygeneruje /en/*.html (kromě en/404.html) z českých stránek: stejná struktura,
přeložené texty. Spouští se z kořene webu: python docs/scripts/build_en.py
Každá náhrada musí v české stránce existovat – když se český text změní,
upravte i dvojici (cs, en) níže, jinak skript skončí chybou NOT FOUND."""
import io, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
MAP = {
    'index.html': 'index.html', 'koncerty.html': 'concerts.html', 'o-nas.html': 'about.html',
    'clenove.html': 'members.html', 'galerie.html': 'gallery.html', 'kontakt.html': 'contact.html',
    'zasady-ochrany-osobnich-udaju.html': 'privacy-policy.html',
}
# en/404.html se udržuje ručně (cesty od kořene, vlastní .htaccess v /en/).
CZ_FLAG = ('<svg class="flag-cs" width="22" height="15" viewBox="0 0 60 30" aria-hidden="true">'
           '<rect width="60" height="15" fill="#fff"></rect><rect width="60" height="15" y="15" fill="#D7141A"></rect>'
           '<path d="M0,0 L30,15 L0,30 Z" fill="#11457E"></path></svg>')

COMMON = [
    ('<a class="skip-link" href="#obsah">Přeskočit na obsah</a>', '<a class="skip-link" href="#obsah">Skip to content</a>'),
    ('aria-label="Capella Nostra – domů"', 'aria-label="Capella Nostra – home"'),
    ('>Domů</a>', '>Home</a>'),
    ('>Koncerty</a>', '>Concerts</a>'),
    ('>O nás</a>', '>About us</a>'),
    ('>Členové</a>', '>Members</a>'),
    ('>Galerie</a>', '>Gallery</a>'),
    ('>Kontakt</a>', '>Contact</a>'),
    ('>Poptat koncert<', '>Book a concert<'),
    ('aria-label="Zavřít menu"', 'aria-label="Close menu"'),
    ('aria-label="Otevřít menu"', 'aria-label="Open menu"'),
    ('<p class="footer-tagline">Hudba, která spojuje.</p>', '<p class="footer-tagline">Music that brings people together.</p>'),
    ('<p class="footer-legal">Provozovatel: [DOPLNIT: název spolku, IČO, sídlo]</p>',
     '<p class="footer-legal">Operator: [TO BE COMPLETED: association name, company ID, registered office]</p>'),
    ('class="privacy">Zásady ochrany osobních údajů</a>', 'class="privacy">Privacy Policy</a>'),
    ('class="credit">Realizace webu: <strong>', 'class="credit">Website by: <strong>'),
]
INQUIRY = [
    ('<p class="eyebrow">Pro pořadatele</p>', '<p class="eyebrow">For organisers</p>'),
    ('<h2 class="h2" id="inquiryTitle">Chcete Capellu&nbsp;Nostru na své akci?</h2>',
     '<h2 class="h2" id="inquiryTitle">Would you like Capella&nbsp;Nostra at your event?</h2>'),
    ('<p class="inquiry-text">Hrajeme v&nbsp;kostelech i&nbsp;na festivalech. Napište, kdy a&nbsp;kde koncert chystáte. Ozveme se a&nbsp;program domluvíme spolu.</p>',
     '<p class="inquiry-text">We play in churches and at festivals. Tell us when and where you are planning the concert. We will get back to you and agree on the programme together.</p>'),
    ('<dt>Telefon</dt>', '<dt>Phone</dt>'),
    ('<small>Michael Stehno, manažer souboru</small>', '<small>Michael Stehno, ensemble manager</small>'),
]
OG_ALT = [
    ('content="Capella Nostra při hraní: housle, cembalo, hoboje, violoncello a kontrabas"',
     'content="Capella Nostra playing: violins, harpsichord, oboes, cello and double bass"'),
    ('content="Capella Nostra při hraní v kostele: housle, cembalo, hoboje, violoncello a kontrabas"',
     'content="Capella Nostra playing in a church: violins, harpsichord, oboes, cello and double bass"'),
    ('content="Capella Nostra při hraní v kostele"', 'content="Capella Nostra playing in a church"'),
]

PAGES = {}

PAGES['index.html'] = INQUIRY + [
    ('<title>Capella Nostra – barokní soubor z Konzervatoře Pardubice</title>',
     '<title>Capella Nostra – Baroque ensemble from the Pardubice Conservatory</title>'),
    ('<meta name="description" content="Capella Nostra je barokní soubor z Konzervatoře Pardubice, hraje hudbu 17. a 18. století historicky poučeně. Nejbližší koncerty, členové a poptávka.">',
     '<meta name="description" content="Capella Nostra is a Baroque ensemble from the Pardubice Conservatory playing music of the 17th and 18th centuries in a historically informed way. Upcoming concerts, members and booking.">'),
    ('<meta property="og:title" content="Capella Nostra – barokní soubor z Konzervatoře Pardubice">',
     '<meta property="og:title" content="Capella Nostra – Baroque ensemble from the Pardubice Conservatory">'),
    ('<meta property="og:description" content="Mladý barokní soubor z Konzervatoře Pardubice. Hudba 17. a 18. století, historicky poučeně. Program koncertů a poptávka pro pořadatele.">',
     '<meta property="og:description" content="A young Baroque ensemble from the Pardubice Conservatory. Music of the 17th and 18th centuries, historically informed. Concert programme and booking for organisers.">'),
    ('aria-label="Úvod"', 'aria-label="Introduction"'),
    ('<p class="hero-video__sub">Barokní soubor z&nbsp;Konzervatoře v&nbsp;Pardubicích</p>',
     '<p class="hero-video__sub">Baroque ensemble from the Pardubice Conservatory</p>'),
    ('>Nejbližší koncerty<', '>Upcoming concerts<'),
    ('<p class="eyebrow">Nadcházející koncerty</p>', '<p class="eyebrow">Upcoming concerts</p>'),
    ('>Přijďte si poslechnout Capellu Nostru naživo</h2>', '>Come and hear Capella Nostra live</h2>'),
    ('<p class="home-empty__title">Žádný koncert teď v&nbsp;programu nemáme.</p>',
     '<p class="home-empty__title">There are no concerts in the programme right now.</p>'),
    ('<p>Nové termíny zveřejníme tady a&nbsp;na <a', '<p>We will announce new dates here and on <a'),
    ('>Facebooku</a> a&nbsp;<a', '>Facebook</a> and <a'),
    ('>Instagramu</a>. Mezitím si můžete prohlédnout <a href="koncerty.html">proběhlé koncerty</a>, nebo nás <a href="kontakt.html#poptavka">pozvat na svou akci</a>.</p>',
     '>Instagram</a>. In the meantime you can look through our <a href="koncerty.html">past concerts</a> or <a href="kontakt.html#poptavka">invite us to your event</a>.</p>'),
    ('>Všechny koncerty<', '>All concerts<'),
    ('<p class="eyebrow eyebrow--onblue">O nás</p>', '<p class="eyebrow eyebrow--onblue">About us</p>'),
    ('>Barokní soubor z&nbsp;Konzervatoře Pardubice</h2>', '>A Baroque ensemble from the Pardubice Conservatory</h2>'),
    ('<p class="lede">Capella Nostra vznikla v&nbsp;roce 2024 na Konzervatoři Pardubice ze zájmu samotných studentů. Začínala jako komorní uskupení pěti hráčů, dnes má jedenáct hráčů a&nbsp;uměleckého garanta. Hraje hudbu 17. a&nbsp;18.&nbsp;století historicky poučeně: barokní triové sonáty, J.&nbsp;C.&nbsp;F.&nbsp;Fischera nebo Antonia Vivaldiho.</p>',
     '<p class="lede">Capella Nostra was founded in 2024 at the Pardubice Conservatory on the initiative of the students themselves. It started as a chamber group of five players; today it has eleven players and an artistic supervisor. It plays music of the 17th and 18th centuries in a historically informed way: Baroque trio sonatas, J.&nbsp;C.&nbsp;F.&nbsp;Fischer or Antonio Vivaldi.</p>'),
    ('>Více o&nbsp;souboru<', '>More about the ensemble<'),
    ('alt="Adam Suk u&nbsp;cembala, za ním kontrabas a&nbsp;violoncello"', 'alt="Adam Suk at the harpsichord, with double bass and cello behind him"'),
    ('<p class="eyebrow">Členové souboru</p>', '<p class="eyebrow">Members</p>'),
    ('>Jedenáct hráčů a&nbsp;umělecký garant</h2>', '>Eleven players and an artistic supervisor</h2>'),
    ('<p class="lede">Převážně studenti a&nbsp;absolventi Konzervatoře Pardubice: housle a&nbsp;viola, violoncello, kontrabas, dva hoboje, trubka a&nbsp;cembalo. Soubor vede cembalista Adam Suk, uměleckým garantem je MgA.&nbsp;Michal Hanuš.</p>',
     '<p class="lede">Mostly students and graduates of the Pardubice Conservatory: violins and viola, cello, double bass, two oboes, trumpet and harpsichord. The ensemble is led by harpsichordist Adam Suk; its artistic supervisor is MgA.&nbsp;Michal Hanuš.</p>'),
    ('>Poznat členy<', '>Meet the members<'),
    ('alt="Členové Capelly Nostry s&nbsp;nástroji"', 'alt="Members of Capella Nostra with their instruments"'),
    ('<p class="eyebrow eyebrow--onblue">Galerie</p>', '<p class="eyebrow eyebrow--onblue">Gallery</p>'),
    ('<h2 class="h2" id="galleryTitle">Z&nbsp;focení a&nbsp;natáčení souboru</h2>',
     '<h2 class="h2" id="galleryTitle">From the ensemble’s photo shoot and filming</h2>'),
    ('>Celá galerie<', '>Full gallery<'),
]

PAGES['o-nas.html'] = INQUIRY + [
    ('<title>O nás – Capella Nostra, barokní soubor</title>', '<title>About us – Capella Nostra, Baroque ensemble</title>'),
    ('<meta name="description" content="Mladý barokní soubor z Konzervatoře Pardubice. Vznikl v roce 2024 a hraje hudbu 17. a 18. století historicky poučeně – Fischera, Vivaldiho i triové sonáty.">',
     '<meta name="description" content="A young Baroque ensemble from the Pardubice Conservatory. Founded in 2024, it plays music of the 17th and 18th centuries in a historically informed way – Fischer, Vivaldi and trio sonatas.">'),
    ('<meta property="og:title" content="O nás – Capella Nostra, barokní soubor">', '<meta property="og:title" content="About us – Capella Nostra, Baroque ensemble">'),
    ('<meta property="og:description" content="Mladý barokní soubor z Konzervatoře Pardubice. Vznikl v roce 2024 a hraje hudbu 17. a 18. století historicky poučeně – Fischera, Vivaldiho i triové sonáty.">',
     '<meta property="og:description" content="A young Baroque ensemble from the Pardubice Conservatory. Founded in 2024, it plays music of the 17th and 18th centuries in a historically informed way – Fischer, Vivaldi and trio sonatas.">'),
    ('alt="Capella Nostra při hraní v&nbsp;kostele (snímek z&nbsp;natáčení souboru)"', 'alt="Capella Nostra playing in a church (still from the ensemble’s filming)"'),
    ('<p class="eyebrow">O nás</p>', '<p class="eyebrow">About us</p>'),
    ('<h1>Barokní soubor Capella Nostra</h1>', '<h1>The Baroque ensemble Capella Nostra</h1>'),
    ('<p class="hero-sub">Studenti a&nbsp;absolventi Konzervatoře Pardubice. Hrají hudbu 17.&nbsp;a&nbsp;18.&nbsp;století historicky poučeně.</p>',
     '<p class="hero-sub">Students and graduates of the Pardubice Conservatory playing music of the 17th and 18th centuries in a historically informed way.</p>'),
    ('<p class="eyebrow">Kdo jsme</p>', '<p class="eyebrow">Who we are</p>'),
    ('>Baroko hrané poučeně a&nbsp;s&nbsp;chutí</h2>', '>Baroque played with knowledge and relish</h2>'),
    ('<p class="lede">Capella Nostra je barokní soubor, který tvoří převážně studenti a&nbsp;absolventi Konzervatoře Pardubice. Věnuje se historicky poučené interpretaci hudby 17.&nbsp;a&nbsp;18.&nbsp;století.</p>',
     '<p class="lede">Capella Nostra is a Baroque ensemble made up mostly of students and graduates of the Pardubice Conservatory. It is devoted to the historically informed performance of music from the 17th and 18th centuries.</p>'),
    ('<p class="onas-text">Členy spojuje bohatá koncertní zkušenost a&nbsp;úspěchy v&nbsp;mezinárodních soutěžích.</p>',
     '<p class="onas-text">Its members share extensive concert experience and success in international competitions.</p>'),
    ('<p class="onas-award"><span class="n" aria-hidden="true">1.</span><strong><span class="sr-only">1.&nbsp;</span>cena v&nbsp;kategorii historicky poučené interpretace</strong><span>soutěž Camerata Teplice</span></p>',
     '<p class="onas-award"><span class="n" aria-hidden="true">1st</span><strong><span class="sr-only">1st </span>prize in the historically informed performance category</strong><span>Camerata Teplice competition</span></p>'),
    ('alt="Ema Světlíková s&nbsp;kontrabasem při hraní (snímek z&nbsp;natáčení souboru)"', 'alt="Ema Světlíková playing the double bass (still from the ensemble’s filming)"'),
    ('alt="Ruce na klaviatuře zdobeného cembala"', 'alt="Hands on the keyboard of a decorated harpsichord"'),
    ('<p class="eyebrow">Náš příběh</p>', '<p class="eyebrow">Our story</p>'),
    ('>Na začátku jich bylo pět</h2>', '>It started with five</h2>'),
    ('<p>Soubor vznikl v&nbsp;roce 2024 na Konzervatoři Pardubice, a&nbsp;to ze zájmu samotných studentů. Začínal jako komorní uskupení pěti hráčů.</p>',
     '<p>The ensemble was founded in 2024 at the Pardubice Conservatory, on the initiative of the students themselves. It began as a chamber group of five players.</p>'),
    ('<p>Postupně se rozrostl na jedenáct hráčů a&nbsp;uměleckého garanta. K&nbsp;principům barokní komorní hry se ale pořád vrací.</p>',
     '<p>It has since grown to eleven players and an artistic supervisor, but it keeps returning to the principles of Baroque chamber playing.</p>'),
    ('<p>V&nbsp;čele souboru stojí student, varhaník a&nbsp;cembalista Adam Suk jako umělecký vedoucí a&nbsp;profesor MgA.&nbsp;Michal Hanuš jako umělecký garant.</p>',
     '<p>The ensemble is led by Adam Suk, a student, organist and harpsichordist, as artistic director, and by professor MgA.&nbsp;Michal Hanuš as artistic supervisor.</p>'),
    ('alt="Capella Nostra při hraní v&nbsp;kostele, pohled z&nbsp;boku přes řady židlí (snímek z&nbsp;natáčení souboru)"',
     'alt="Capella Nostra playing in a church, side view across rows of chairs (still from the ensemble’s filming)"'),
    ('<p class="eyebrow">Kde a&nbsp;co hrajeme</p>', '<p class="eyebrow">What and where we play</p>'),
    ('<h2>Fischer, Vivaldi a&nbsp;triové sonáty</h2>', '<h2>Fischer, Vivaldi and trio sonatas</h2>'),
    ('<p class="kc-lead">Soubor hraje známější i&nbsp;méně uváděný barokní repertoár a&nbsp;hledá v&nbsp;něm nové zvukové možnosti.</p>',
     '<p class="kc-lead">The ensemble plays both well-known and less often performed Baroque repertoire and looks for new sound possibilities in it.</p>'),
    ('<span class="cm">Marche C&nbsp;dur · Ouverture</span>', '<span class="cm">March in C&nbsp;major · Ouverture</span>'),
    ('<span class="cm">Koncert pro flétnu a&nbsp;orchestr g&nbsp;moll RV&nbsp;439 · Koncert pro hoboj a&nbsp;housle</span>',
     '<span class="cm">Flute Concerto in G&nbsp;minor, RV&nbsp;439 · Concerto for oboe and violin</span>'),
    ('<span class="nm">Barokní triové sonáty</span><span class="cm">Dušičkový koncert, 1.&nbsp;listopadu 2026</span>',
     '<span class="nm">Baroque trio sonatas</span><span class="cm">All Souls’ concert, 1&nbsp;November 2026</span>'),
    ('<h3 class="kc-sub">Kde soubor hrál</h3>', '<h3 class="kc-sub">Where the ensemble has played</h3>'),
    ('<li>Trutnovský hudební festival</li>', '<li>Trutnov Music Festival</li>'),
    ('<li>Komorní řada Gočárovy galerie</li>', '<li>Chamber Series at the Gočár Gallery</li>'),
    ('<li>Mezinárodní hudební festival J.&nbsp;C.&nbsp;F.&nbsp;Fischera</li>', '<li>J.&nbsp;C.&nbsp;F.&nbsp;Fischer International Music Festival</li>'),
    ('<li>Bojanovské muzicírování</li>', '<li>Bojanovské muzicírování</li>'),
    ('<p class="kc-where">V&nbsp;roce 2026 hrál také v&nbsp;evangelickém kostele ve Dvakačovicích a&nbsp;ve Fabrice 1861 v&nbsp;Semilech.</p>',
     '<p class="kc-where">In 2026 it also played at the Evangelical church in Dvakačovice and at Fabrika 1861 in Semily.</p>'),
    ('>Program koncertů', '>Concert programme'),
    ('<p class="eyebrow">Členové</p>', '<p class="eyebrow">Members</p>'),
    ('>Kdo v&nbsp;souboru hraje</h2>', '>Who plays in the ensemble</h2>'),
    ('<p>Jedenáct hráčů a&nbsp;umělecký garant MgA.&nbsp;Michal Hanuš. Šest z&nbsp;nich vidíte tady, ostatní na stránce Členové.</p>',
     '<p>Eleven players and the artistic supervisor MgA.&nbsp;Michal Hanuš. Six of them are shown here, the rest on the Members page.</p>'),
    ('>Všichni členové<', '>All members<'),
    ('alt="Adam Suk, cembalo"', 'alt="Adam Suk, harpsichord"'),
    ('<span class="m-role">Cembalo, umělecký vedoucí</span>', '<span class="m-role">Harpsichord, artistic director</span>'),
    ('alt="Daniel Plavec s&nbsp;houslemi"', 'alt="Daniel Plavec with a violin"'),
    ('<span class="m-role">Housle, koncertní mistr</span>', '<span class="m-role">Violin, concertmaster</span>'),
    ('alt="Michael Stehno s&nbsp;trubkou"', 'alt="Michael Stehno with a trumpet"'),
    ('<span class="m-role">Trubka, management</span>', '<span class="m-role">Trumpet, management</span>'),
    ('alt="Tadeáš Jadrný s&nbsp;violoncellem"', 'alt="Tadeáš Jadrný with a cello"'),
    ('<span class="m-role">Violoncello</span>', '<span class="m-role">Cello</span>'),
    ('alt="Ema Světlíková s&nbsp;kontrabasem"', 'alt="Ema Světlíková with a double bass"'),
    ('<span class="m-role">Kontrabas</span>', '<span class="m-role">Double bass</span>'),
    ('alt="Tomáš Rykr s&nbsp;hobojem"', 'alt="Tomáš Rykr with an oboe"'),
    ('<span class="m-role">Hoboj</span>', '<span class="m-role">Oboe</span>'),
]

PAGES['koncerty.html'] = INQUIRY + [
    ('<title>Koncerty – Capella Nostra</title>', '<title>Concerts – Capella Nostra</title>'),
    ('<meta name="description" content="Kde a kdy hraje barokní soubor Capella Nostra: nadcházející koncerty s datem, místem a odkazem na pořadatele a přehled koncertů, které už proběhly.">',
     '<meta name="description" content="Where and when the Baroque ensemble Capella Nostra plays: upcoming concerts with date, venue and a link to the organiser, plus an overview of past concerts.">'),
    ('<meta property="og:title" content="Koncerty – Capella Nostra">', '<meta property="og:title" content="Concerts – Capella Nostra">'),
    ('<meta property="og:description" content="Kde a kdy hraje barokní soubor Capella Nostra: nadcházející koncerty s datem, místem a odkazem na pořadatele.">',
     '<meta property="og:description" content="Where and when the Baroque ensemble Capella Nostra plays: upcoming concerts with date, venue and a link to the organiser.">'),
    ('<p class="eyebrow">Program</p>', '<p class="eyebrow">Programme</p>'),
    ('<h1>Koncerty</h1>', '<h1>Concerts</h1>'),
    ('<p class="hero-sub">Kde nás v&nbsp;nejbližší době uslyšíte a&nbsp;kde jsme už hráli.</p>',
     '<p class="hero-sub">Where you can hear us soon and where we have already played.</p>'),
    ('<p class="eyebrow">Termíny</p>', '<p class="eyebrow">Dates</p>'),
    ('<h2 class="h2" id="upcomingTitle">Nadcházející koncerty</h2>', '<h2 class="h2" id="upcomingTitle">Upcoming concerts</h2>'),
    ('<p class="program-empty-title">Další koncerty zatím nejsou v&nbsp;programu.</p>',
     '<p class="program-empty-title">No further concerts are scheduled yet.</p>'),
    ('<p>Nové termíny zveřejňujeme na <a', '<p>We announce new dates on <a'),
    ('>Facebooku</a> a&nbsp;<a', '>Facebook</a> and <a'),
    ('>Instagramu</a>.</p>', '>Instagram</a>.</p>'),
    ('<p class="eyebrow">Proběhlé koncerty</p>', '<p class="eyebrow">Past concerts</p>'),
    ('<h2 class="h2" id="archiveTitle">Kde jsme hráli</h2>', '<h2 class="h2" id="archiveTitle">Where we have played</h2>'),
    ('<p class="archive-note">Mimo tento přehled soubor vystoupil také na Trutnovském hudebním festivalu a&nbsp;v&nbsp;Komorní řadě Gočárovy galerie.</p>',
     '<p class="archive-note">Apart from the concerts listed here, the ensemble has also performed at the Trutnov Music Festival and in the Chamber Series at the Gočár Gallery.</p>'),
]

PAGES['clenove.html'] = INQUIRY + [
    ('<title>Členové – Capella Nostra</title>', '<title>Members – Capella Nostra</title>'),
    ('<meta name="description" content="Kdo hraje v barokním souboru Capella Nostra: umělecký vedoucí Adam Suk (cembalo), umělecký garant MgA. Michal Hanuš a deset hráčů.">',
     '<meta name="description" content="Who plays in the Baroque ensemble Capella Nostra: artistic director Adam Suk (harpsichord), artistic supervisor MgA. Michal Hanuš and ten players.">'),
    ('<meta property="og:title" content="Členové – Capella Nostra">', '<meta property="og:title" content="Members – Capella Nostra">'),
    ('<meta property="og:description" content="Umělecký vedoucí Adam Suk, umělecký garant MgA. Michal Hanuš a deset hráčů barokního souboru Capella Nostra.">',
     '<meta property="og:description" content="Artistic director Adam Suk, artistic supervisor MgA. Michal Hanuš and ten players of the Baroque ensemble Capella Nostra.">'),
    ('<p class="eyebrow">Soubor</p>', '<p class="eyebrow">The ensemble</p>'),
    ('<h1>Členové</h1>', '<h1>Members</h1>'),
    ('<p class="hero-sub">Jedenáct hráčů a&nbsp;umělecký garant, převážně studenti a&nbsp;absolventi Konzervatoře Pardubice.</p>',
     '<p class="hero-sub">Eleven players and an artistic supervisor, mostly students and graduates of the Pardubice Conservatory.</p>'),
    ('<p class="eyebrow">Umělecký vedoucí</p>', '<p class="eyebrow">Artistic director</p>'),
    ('<p class="role">Cembalo</p>', '<p class="role">Harpsichord</p>'),
    ('<p>Adam Suk (*&nbsp;2005) je český varhaník a&nbsp;cembalista. Od roku 2021 studuje na Konzervatoři Pardubice ve varhanní třídě Pavla Svobody. Od roku 2024 je členem a&nbsp;uměleckým vedoucím barokního souboru Capella Nostra, který tvoří převážně studenti a&nbsp;absolventi Konzervatoře Pardubice.</p>',
     '<p>Adam Suk (b.&nbsp;2005) is a Czech organist and harpsichordist. Since 2021 he has been studying at the Pardubice Conservatory in the organ class of Pavel Svoboda. Since 2024 he has been a member and the artistic director of the Baroque ensemble Capella Nostra, made up mostly of students and graduates of the Pardubice Conservatory.</p>'),
    ('<p>V&nbsp;červnu 2026 patřil mezi první varhaníky, kteří rozezněli nové svatovítské varhany. V&nbsp;rámci Svatovítského varhanního oktávu provedl spolu s&nbsp;Orchestrem Národního divadla Janáčkovu Glagolskou mši.</p>',
     '<p>In June 2026 he was among the first organists to play the new organ of St Vitus Cathedral. As part of the St Vitus Organ Octave, he performed Janáček’s Glagolitic Mass with the National Theatre Orchestra.</p>'),
    ('<span class="cv-more__open">Celý životopis</span><span class="cv-more__close">Skrýt životopis</span>',
     '<span class="cv-more__open">Full biography</span><span class="cv-more__close">Hide biography</span>'),
    ('<p>Získal ocenění na mnoha hudebních soutěžích. V&nbsp;roce 2019 obdržel první cenu v&nbsp;juniorské kategorii Northern Ireland Organ Competition v&nbsp;Severním Irsku. Mezi jeho další úspěchy patří například první cena na soutěži Organum Regium, druhé místo na soutěži v&nbsp;polské Rumii (2021) nebo tituly absolutního vítěze na soutěži Pro Bohemia v&nbsp;Ostravě a&nbsp;Soutěži J.&nbsp;K.&nbsp;Vaňhala, která se konala na historických varhanách v&nbsp;Opočně (2023).</p>',
     '<p>He has won awards at many music competitions. In 2019 he received first prize in the junior category of the Northern Ireland Organ Competition. His other successes include first prize at the Organum Regium competition, second place at the competition in Rumia, Poland (2021), and the title of overall winner at the Pro Bohemia competition in Ostrava and at the J.&nbsp;K.&nbsp;Vaňhal Competition, held on the historic organ in Opočno (2023).</p>'),
    ('<p>V&nbsp;srpnu 2024 byl vybrán jako jeden ze třinácti varhaníků z&nbsp;celého světa k&nbsp;účasti v&nbsp;seniorské kategorii Northern Ireland International Organ Competition v&nbsp;Severním Irsku. Získal zde zvláštní ocenění&nbsp;– medaili Dame Gillian Weir&nbsp;– za interpretaci Finale z&nbsp;Nedělní hudby od Petra Ebena.</p>',
     '<p>In August 2024 he was selected as one of thirteen organists from around the world to take part in the senior category of the Northern Ireland International Organ Competition, where he received a special award – the Dame Gillian Weir Medal – for his interpretation of the Finale from Petr Eben’s Sunday Music.</p>'),
    ('<p>Pravidelně se účastní mistrovských kurzů pod vedením uznávaných varhaníků, jako jsou Jaroslav Tůma, Martin Schmeding, Nathan Laube, Thomas Ospital, Zuzana Ferjenčíková, Monika Melcová, Christoph Mantoux či Krzysztof Urbaniak.</p>',
     '<p>He regularly takes part in masterclasses led by renowned organists such as Jaroslav Tůma, Martin Schmeding, Nathan Laube, Thomas Ospital, Zuzana Ferjenčíková, Monika Melcová, Christoph Mantoux and Krzysztof Urbaniak.</p>'),
    ('<p>V&nbsp;prosinci 2022 vydal své první CD (Adam Suk&nbsp;– Organ Recital), které nahrál na varhanách v&nbsp;kostele Nanebevzetí Panny Marie v&nbsp;Brně. Druhé CD, jehož hlavní část tvoří varhanní koncerty od Poulenca a&nbsp;Brixiho, nahrál v&nbsp;roce 2025 společně s&nbsp;Komorní filharmonií Pardubice a&nbsp;dirigentem Stanislavem Vavřínkem. Vyjde v&nbsp;listopadu 2026.</p>',
     '<p>In December 2022 he released his first CD (Adam Suk – Organ Recital), recorded on the organ of the Church of the Assumption of the Virgin Mary in Brno. His second CD, built mainly around organ concertos by Poulenc and Brixi, was recorded in 2025 with the Pardubice Chamber Philharmonic and conductor Stanislav Vavřínek. It will be released in November 2026.</p>'),
    ('<p>Bohatá je i&nbsp;jeho koncertní činnost. Vystoupil na mnoha festivalech, mimo jiné na Pardubickém hudebním jaru, festivalu Zlatá Pecka, festivalu F.&nbsp;L.&nbsp;Věka, Vivat varhany, Dvořákově festivalu, festivalu J.&nbsp;C.&nbsp;F.&nbsp;Fischera, EuroArt Festivalu či na Mladé Praze v&nbsp;Rudolfinu.</p>',
     '<p>He also performs widely in concert and has appeared at many festivals, including Pardubice Music Spring, Zlatá Pecka, the F.&nbsp;L.&nbsp;Věk Festival, Vivat varhany, the Dvořák Festival, the J.&nbsp;C.&nbsp;F.&nbsp;Fischer Festival, the EuroArt Festival and Mladá Praha at the Rudolfinum.</p>'),
    ('<p>Spolupracoval s&nbsp;tělesy a&nbsp;orchestry jako Barocco sempre giovane, Filharmonie Hradec Králové, Český národní symfonický orchestr, Komorní filharmonie Pardubice nebo Severočeská filharmonie Teplice.</p>',
     '<p>He has worked with ensembles and orchestras such as Barocco sempre giovane, the Hradec Králové Philharmonic, the Czech National Symphony Orchestra, the Pardubice Chamber Philharmonic and the North Czech Philharmonic Teplice.</p>'),
    ('aria-label="Adam Suk na sociálních sítích"', 'aria-label="Adam Suk on social media"'),
    ('<h2 class="sr-only" id="boardTitle">Vedení souboru</h2>', '<h2 class="sr-only" id="boardTitle">Ensemble leadership</h2>'),
    ('<h2 class="sr-only" id="playersTitle">Hráči</h2>', '<h2 class="sr-only" id="playersTitle">Players</h2>'),
    ('alt="Deset členů Capelly Nostry se svými nástroji"', 'alt="Ten members of Capella Nostra with their instruments"'),
]

PAGES['galerie.html'] = [
    ('<title>Galerie – Capella Nostra</title>', '<title>Gallery – Capella Nostra</title>'),
    ('<meta name="description" content="Snímky z&nbsp;natáčení videí a&nbsp;portréty členů Capelly Nostry, barokního souboru z&nbsp;Konzervatoře Pardubice.">',
     '<meta name="description" content="Stills from video filming and portraits of the members of Capella Nostra, a Baroque ensemble from the Pardubice Conservatory.">'),
    ('<meta property="og:title" content="Galerie – Capella Nostra">', '<meta property="og:title" content="Gallery – Capella Nostra">'),
    ('<meta property="og:description" content="Snímky z&nbsp;natáčení videí a&nbsp;portréty členů Capelly Nostry, barokního souboru z&nbsp;Konzervatoře Pardubice.">',
     '<meta property="og:description" content="Stills from video filming and portraits of the members of Capella Nostra, a Baroque ensemble from the Pardubice Conservatory.">'),
    ('<p class="eyebrow">Galerie</p>', '<p class="eyebrow">Gallery</p>'),
    ('<h1>Soubor zblízka</h1>', '<h1>The ensemble up close</h1>'),
    ('<p class="hero-sub">Snímky z&nbsp;natáčení videí a&nbsp;portréty členů se svými nástroji.</p>',
     '<p class="hero-sub">Stills from video filming and portraits of the members with their instruments.</p>'),
    ('<h2 class="sr-only" id="albumsTitle">Alba</h2>', '<h2 class="sr-only" id="albumsTitle">Albums</h2>'),
    ('>Načíst další alba</button>', '>Load more albums</button>'),
    ('<p class="eyebrow">Videa</p>', '<p class="eyebrow">Videos</p>'),
    ('<h2>Fischer a&nbsp;Vivaldi z&nbsp;natáčení</h2>', '<h2>Fischer and Vivaldi on film</h2>'),
    ('</svg>Zpět na galerii</a>', '</svg>Back to gallery</a>'),
    ('aria-label="Zavřít"', 'aria-label="Close"'),
    ('aria-label="Předchozí"', 'aria-label="Previous"'),
    ('aria-label="Další"', 'aria-label="Next"'),
]

DESC_CONTACT = 'Contact the Baroque ensemble Capella Nostra: e-mail capellanostra@gmail.com and the ensemble manager’s phone number. Enquiry form for concert organisers.'
PAGES['kontakt.html'] = [
    ('<title>Kontakt – Capella Nostra</title>', '<title>Contact – Capella Nostra</title>'),
    ('<meta name="description" content="Kontakt na barokní soubor Capella Nostra: e-mail capellanostra@gmail.com a telefon na manažera souboru. Poptávkový formulář pro pořadatele koncertů.">',
     '<meta name="description" content="' + DESC_CONTACT + '">'),
    ('<meta property="og:title" content="Kontakt – Capella Nostra">', '<meta property="og:title" content="Contact – Capella Nostra">'),
    ('<meta property="og:description" content="Kontakt na barokní soubor Capella Nostra: e-mail capellanostra@gmail.com a telefon na manažera souboru. Poptávkový formulář pro pořadatele koncertů.">',
     '<meta property="og:description" content="' + DESC_CONTACT + '">'),
    ('<p class="eyebrow">Kontakt</p>', '<p class="eyebrow">Contact</p>'),
    ('>Ozvěte se nám</h1>', '>Get in touch</h1>'),
    ('<p class="lede">Máte dotaz, nebo chcete pozvat Capellu Nostru na svůj koncert? Napište nám, kdy a&nbsp;kde koncert chystáte. Ozveme se a&nbsp;program domluvíme spolu.</p>',
     '<p class="lede">Do you have a question, or would you like to invite Capella Nostra to play at your concert? Tell us when and where you are planning it. We will get back to you and agree on the programme together.</p>'),
    ('<span class="label">Telefon</span>', '<span class="label">Phone</span>'),
    ('<span class="note">Michael Stehno, manažer souboru</span>', '<span class="note">Michael Stehno, ensemble manager</span>'),
    ('<span class="label">Sociální sítě</span>', '<span class="label">Social media</span>'),
    ('<p class="eyebrow">Napište nám</p>', '<p class="eyebrow">Write to us</p>'),
    ('<h2>Pošlete nám zprávu</h2>', '<h2>Send us a message</h2>'),
    ('<p class="helper">Pole označená hvězdičkou jsou povinná.</p>', '<p class="helper">Fields marked with an asterisk are required.</p>'),
    ('<label for="cn-name">Jméno <span', '<label for="cn-name">Name <span'),
    ('placeholder="Vaše jméno"', 'placeholder="Your name"'),
    ('placeholder="vas@email.cz"', 'placeholder="you@example.com"'),
    ('<label for="cn-phone">Telefon</label>', '<label for="cn-phone">Phone</label>'),
    ('<label for="cn-message">Zpráva <span', '<label for="cn-message">Message <span'),
    ('placeholder="Termín, místo a&nbsp;typ akce…"', 'placeholder="Date, venue and type of event…"'),
    ('<span>Souhlasím se <a href="zasady-ochrany-osobnich-udaju.html" target="_blank">zpracováním osobních údajů</a> za účelem vyřízení mé poptávky.<span class="sr-only"> (otevře se v&nbsp;novém okně)</span></span>',
     '<span>I agree to the <a href="zasady-ochrany-osobnich-udaju.html" target="_blank">processing of my personal data</a> for the purpose of handling my enquiry.<span class="sr-only"> (opens in a new window)</span></span>'),
    ('>Odeslat poptávku<', '>Send enquiry<'),
    ('tabindex="-1">Děkujeme za zprávu!</h2>', 'tabindex="-1">Thank you for your message!</h2>'),
    ('<p>Vaše poptávka byla odeslána. Ozveme se vám co nejdříve.</p>', '<p>Your enquiry has been sent. We will get back to you as soon as possible.</p>'),
    ('>Odeslat další zprávu</button>', '>Send another message</button>'),
]

PAGES['zasady-ochrany-osobnich-udaju.html'] = [
    ('<title>Zásady ochrany osobních údajů – Capella Nostra</title>', '<title>Privacy Policy – Capella Nostra</title>'),
    ('<meta name="description" content="Informace o zpracování osobních údajů na webu barokního souboru Capella Nostra.">',
     '<meta name="description" content="Information on the processing of personal data on the website of the Baroque ensemble Capella Nostra.">'),
    ('<p class="eyebrow">Právní informace</p>', '<p class="eyebrow">Legal information</p>'),
    ('<h1 class="h1">Zásady ochrany osobních údajů</h1>', '<h1 class="h1">Privacy Policy</h1>'),
    ('<p class="updated">Poslední aktualizace: říjen 2026</p>', '<p class="updated">Last updated: October 2026</p>'),
    ('<h2>1. Správce osobních údajů</h2>', '<h2>1. Data controller</h2>'),
    ('<p>Správcem osobních údajů je Capella Nostra, [DOPLNIT: právní forma, sídlo a&nbsp;IČO]. V&nbsp;záležitostech ochrany osobních údajů nás můžete kontaktovat na e-mailu <a href="mailto:capellanostra@gmail.com">capellanostra@gmail.com</a>.</p>',
     '<p>The controller of personal data is Capella Nostra, [TO BE COMPLETED: legal form, registered office and company ID]. You can contact us about data protection matters at <a href="mailto:capellanostra@gmail.com">capellanostra@gmail.com</a>.</p>'),
    ('<h2>2. Jaké údaje zpracováváme</h2>', '<h2>2. What data we process</h2>'),
    ('<p>Prostřednictvím kontaktního formuláře na tomto webu zpracováváme pouze údaje, které nám sami poskytnete:</p>',
     '<p>Through the contact form on this website we process only the data you provide to us yourself:</p>'),
    ('<li>jméno a&nbsp;příjmení,</li>', '<li>your first name and surname,</li>'),
    ('<li>e-mailovou adresu,</li>', '<li>your e-mail address,</li>'),
    ('<li>telefonní číslo (pokud jej uvedete),</li>', '<li>your phone number (if you provide one),</li>'),
    ('<li>obsah vaší zprávy.</li>', '<li>the content of your message.</li>'),
    ('<h2>3. Účel a&nbsp;právní základ zpracování</h2>', '<h2>3. Purpose and legal basis of processing</h2>'),
    ('<p>Vaše údaje zpracováváme výhradně za účelem vyřízení vaší poptávky nebo dotazu a&nbsp;související komunikace. Právním základem zpracování je provedení opatření před uzavřením smlouvy na vaši žádost a&nbsp;náš oprávněný zájem na zodpovězení vašeho dotazu (čl.&nbsp;6 odst.&nbsp;1 písm.&nbsp;b) a&nbsp;f) nařízení GDPR).</p>',
     '<p>We process your data solely in order to handle your enquiry or question and for the related communication. The legal basis for the processing is taking steps at your request prior to entering into a contract, together with our legitimate interest in answering your question (Article 6(1)(b) and (f) GDPR).</p>'),
    ('<h2>4. Doba uchování</h2>', '<h2>4. Retention period</h2>'),
    ('<p>Údaje z&nbsp;poptávkového formuláře uchováváme po dobu nezbytnou k&nbsp;vyřízení poptávky a&nbsp;následné komunikace, nejdéle však [DOPLNIT: např. 2 roky] od posledního kontaktu. Poté je smažeme.</p>',
     '<p>We keep the data from the enquiry form for as long as is necessary to handle the enquiry and any follow-up communication, and for no longer than [TO BE COMPLETED: e.g. 2 years] from the last contact. After that we delete it.</p>'),
    ('<h2>5. Předávání údajů</h2>', '<h2>5. Sharing of data</h2>'),
    ('<p>Vaše osobní údaje nepředáváme žádným třetím stranám s&nbsp;výjimkou poskytovatelů technických služeb nezbytných pro provoz webu a&nbsp;e-mailové komunikace (např. webhosting). Údaje nepředáváme mimo Evropskou unii.</p>',
     '<p>We do not share your personal data with any third parties, except for providers of the technical services needed to run the website and our e-mail communication (web hosting, for example). We do not transfer data outside the European Union.</p>'),
    ('<h2>6. Cookies a&nbsp;analytika</h2>', '<h2>6. Cookies and analytics</h2>'),
    ('<p>Tento web nepoužívá analytické ani marketingové cookies a&nbsp;nesleduje vaše chování. Ukládají se pouze technické údaje nezbytné pro fungování stránek.</p>',
     '<p>This website uses no analytical or marketing cookies and does not track your behaviour. Only the technical data necessary for the site to function is stored.</p>'),
    ('<h2>7. Vaše práva</h2>', '<h2>7. Your rights</h2>'),
    ('<p>V&nbsp;souvislosti se zpracováním osobních údajů máte právo:</p>', '<p>In connection with the processing of personal data you have the right:</p>'),
    ('<li>na přístup ke svým osobním údajům,</li>', '<li>to access your personal data,</li>'),
    ('<li>na opravu nepřesných údajů,</li>', '<li>to have inaccurate data corrected,</li>'),
    ('<li>na výmaz údajů („právo být zapomenut“),</li>', '<li>to have your data erased (the “right to be forgotten”),</li>'),
    ('<li>na omezení zpracování,</li>', '<li>to restrict the processing,</li>'),
    ('<li>vznést námitku proti zpracování,</li>', '<li>to object to the processing,</li>'),
    ('<li>podat stížnost u&nbsp;Úřadu pro ochranu osobních údajů (<a', '<li>to lodge a complaint with the Czech Office for Personal Data Protection (<a'),
    ('<p>Pro uplatnění svých práv nás kontaktujte na <a', '<p>To exercise your rights, contact us at <a'),
    ('<!-- Před spuštěním doplnit údaje označené [DOPLNIT]: identifikaci správce a dobu uchování údajů. -->',
     '<!-- Before launch, fill in the items marked [TO BE COMPLETED]: the identity of the controller and the retention period. -->'),
]

PAGES['404.html'] = [
    ('<title>Stránka nenalezena – Capella Nostra</title>', '<title>Page not found – Capella Nostra</title>'),
    ('<p class="eyebrow">Chyba 404</p>', '<p class="eyebrow">Error 404</p>'),
    ('<h1 class="h1">Tahle stránka tu není</h1>', '<h1 class="h1">This page doesn’t exist</h1>'),
    ('<p class="lede">Odkaz je možná starý, nebo se v&nbsp;adrese objevil překlep. Zkuste to z&nbsp;úvodní stránky, případně se rovnou podívejte na program koncertů.</p>',
     '<p class="lede">The link may be out of date, or there may be a typo in the address. Try the home page, or go straight to the concert programme.</p>'),
    ('>Na úvodní stránku<', '>Go to the home page<'),
    ('>Program koncertů', '>Concert programme'),
]


def rep(t, a, b, page):
    n = t.count(a)
    if n == 0:
        raise SystemExit('%s: NOT FOUND: %s' % (page, a[:110]))
    return t.replace(a, b)


def build(cz, en):
    t = io.open(ROOT + '/' + cz, encoding='utf-8', newline='').read().replace(' ', '&nbsp;')
    absolute = cz == '404.html'
    pre = '/' if absolute else ''
    t = t.replace('<html lang="cs">', '<html lang="en">')
    t = t.replace('<meta property="og:locale" content="cs_CZ">', '<meta property="og:locale" content="en_GB">')
    t = t.replace('<!-- Absolutní adresy počítají s doménou capellanostra.com. Poběží-li web jinde, nahraďte „https://capellanostra.com“ ve všech HTML souborech, v sitemap.xml a robots.txt. -->',
                  '<!-- Absolute URLs assume the domain capellanostra.com. If the site runs elsewhere, replace “https://capellanostra.com” in all HTML files, sitemap.xml and robots.txt. -->')
    # canonical + og:url → anglická adresa (hreflang zůstává stejný v obou jazycích)
    can_cz = 'https://capellanostra.com/' + ('' if cz == 'index.html' else cz)
    can_en = 'https://capellanostra.com/en/' + ('' if en == 'index.html' else en)
    t = t.replace('<link rel="canonical" href="%s">' % can_cz, '<link rel="canonical" href="%s">' % can_en)
    t = t.replace('<meta property="og:url" content="%s">' % can_cz, '<meta property="og:url" content="%s">' % can_en)
    # přepínač jazyka → česká verze
    target = ('/' + cz) if absolute else ('../' + cz)
    t, n = re.subn(r'<a class="([^"]*lang-toggle)" href="[^"]*" hreflang="en" lang="en" aria-label="Switch to English" title="Switch to English">.*?</a>',
                   lambda m: '<a class="%s" href="%s" hreflang="cs" lang="cs" aria-label="Přepnout do češtiny" title="Přepnout do češtiny">\n          %s\n          <span class="lang-label">CZ</span>\n        </a>'
                   % (m.group(1), target, CZ_FLAG), t, flags=re.S)
    assert n == 1, (cz, 'lang toggle', n)
    # texty
    for a, b in PAGES[cz]:
        t = rep(t, a, b, cz)
    for a, b in COMMON:
        if a in t:
            t = t.replace(a, b)
    for a, b in OG_ALT:
        t = t.replace(a, b)
    # odkazy mezi stránkami
    for c, e in MAP.items():
        t = t.replace('href="%s%s' % (pre, c), 'href="%s%s' % ('/en/' if absolute else '', e))
    t = t.replace('#poptavka', '#enquiry').replace('id="poptavka"', 'id="enquiry"')
    if not absolute:
        t = re.sub(r'(?<=["\s,])(assets|css|js)/', r'../\1/', t)
        t = t.replace('href="favicon.ico"', 'href="../favicon.ico"')
    io.open(ROOT + '/en/' + en, 'w', encoding='utf-8', newline='').write(t)
    return t


cz_chars = re.compile('[ěščřžýáíéůúňťďĚŠČŘŽÝÁÍÉŮÚŇŤĎ]')
for cz, en in MAP.items():
    t = build(cz, en)
    # zbylá čeština mimo komentáře (k ruční kontrole)
    body = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    left = []
    for ln, line in enumerate(body.split('\n'), 1):
        if cz_chars.search(line):
            left.append('   %d: %s' % (ln, line.strip()[:150]))
    print('== en/%s  (řádky s diakritikou: %d)' % (en, len(left)))
    print('\n'.join(left))
