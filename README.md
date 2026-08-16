# Mariajosé Carvajal — Microbióloga

Academic landing page for a microbiology and yeast genetics researcher affiliated with the Pontificia Universidad Católica de Chile and the YeastLab. Canvas-based hero and bio animations, a curated research gallery, and a PWA-ready setup — built to communicate scientific credibility with a modern visual identity.

## Features

- Canvas animation in the hero section
- Canvas animation in the bio section
- Research image gallery with lightbox
- PWA ready: site.webmanifest + full favicon set (16x16, 32x32, 192x192, 512x512)
- Open Graph image included (og-image.jpg)
- Fully responsive, mobile-first layout
- No frameworks — pure HTML, CSS, and JavaScript

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom, no frameworks) |
| Logic | Vanilla JavaScript (ES6+) |
| Animations | Canvas API (hero + bio) |
| PWA | site.webmanifest + favicon set |
| Hosting | Cloudflare Pages |

## Project Structure

```
cote-carvajal/
├── index.html
├── .gitignore
├── site.webmanifest
├── img/
│   └── og-image.jpg
└── assets/
    ├── css/
    │   └── main.css
    ├── icons/
    │   ├── favicon.ico
    │   ├── favicon-16x16.png
    │   ├── favicon-32x32.png
    │   ├── apple-touch-icon.png
    │   ├── android-chrome-192x192.png
    │   └── android-chrome-512x512.png
    ├── img/
    │   ├── gallery/
    │   └── profile/
    └── js/
        ├── main.js
        ├── hero-canvas.js
        ├── bio-canvas.js
        └── gallery.js
```

## Local Development

```bash
git clone https://github.com/alvaro-veloz/cote-carvajal.git
cd cote-carvajal
# Open index.html in any browser — no build step required
```

## Live Site

[mariajose.andinawebstudio.com](https://cotecarvajal.andinawebstudio.com)

## License

MIT License. Built by [Andina Web Studio](https://andinawebstudio.com).
