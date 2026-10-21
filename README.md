# zestcollective.ro

Site-ul Zest Architecture & Design, copie a site-ului de pe Squarespace (oct. 2026).
GitHub Pages îl construiește automat (Jekyll) la fiecare modificare; durează 1–2 minute până apare online.

## Cum modifici un text

1. Deschide fișierul paginii pe github.com (lista de mai jos) și apasă creionul (**Edit this file**).
2. Schimbă doar textul dintre etichete, de ex. `<p>textul tău</p>`. Nu șterge `<` `>` și nici blocul dintre liniile `---` de sus decât dacă știi ce faci.
3. Jos, apasă **Commit changes**. Gata.

Dacă greșești ceva, în **History** se poate reveni oricând la versiunea anterioară.

| Pagina | Fișier |
|---|---|
| Prima pagină (RO / EN) | `index.html`, `ro/home.html`, `en/home.html` |
| Servicii / Services | `ro/servicii.html`, `en/services.html` |
| Echipa / Team | `ro/echipa.html`, `en/team.html` |
| Testimoniale / Testimonials | `ro/testimoniale.html`, `en/testimonials.html` |
| Noutăți / News | `ro/noutati.html`, `en/news.html` |
| #locsacresti / #placetogrow | `ro/locsacresti.html`, `en/placetogrow.html` |
| Contact | `ro/contact.html`, `en/contact.html` |
| Amenajări de birouri / Workspace Design | `ro/amenajari-de-birouri.html`, `en/workspace-design.html` |
| Design comercial / Commercial Design | `ro/design-comercial.html`, `en/commercial-design.html` |
| Proiecte (galerii) | câte un fișier per proiect, ex. `bat-atrium.html`, `my-hive.html` |
| Meniul de sus | `_data/nav.yml` |

## Galerii (proiecte)

Imaginile sunt în folderul `img/`. O galerie e o listă în capul fișierului:

```
images:
  - src: "0cd3420c_BAT_86.jpg"
    title: "BAT Atrium"          (doar pe paginile-categorie)
    link: "/bat-atrium"          (unde duce click-ul)
    text: "Birouri | Atrium"     (etichetele de sub titlu)
```

Pentru o imagine nouă: o încarci în `img/` (**Add file → Upload files**), lățime de cel mult 2500 px, apoi adaugi un rând `- src: "nume-fisier.jpg"` în lista paginii.

## Formularul de contact

Mesajele ajung la adresa din `_config.yml` (`form_email`), prin serviciul gratuit FormSubmit (formsubmit.co).
La primul mesaj trimis de pe site, FormSubmit trimite un mail de activare la acea adresă: trebuie apăsat o singură dată butonul **Activate Form**.

## Tehnic

- Stiluri: `assets/css/site.css`; efecte (slideshow, galerie, lightbox, meniu mobil, cookies, formular): `assets/js/site.js`.
- Șabloane: `_layouts/` (pagini de text, galerii, prima pagină) și `_includes/` (antet, iconițe, banner cookies).
- Fonturi: Open Sans și Jost (Google Fonts); Jost înlocuiește fontul futura-pt de pe Squarespace.
- Originalele imaginilor și arhiva completă a site-ului vechi nu sunt aici, ci în arhiva Zest (`_arhiva-squarespace`).
