# Project images

```
images/projects/
├── projects.json
├── alephium-ecosystem-suite/
│   ├── cover.jpg
│   ├── alephium-mirrors/
│   │   ├── cover.jpg          ← generated from first screenshot
│   │   ├── 01.alephium.mirrors.png
│   │   └── 02.alephium.mirrors.png
│   ├── abx-mirror/
│   │   ├── cover.jpg
│   │   └── 03.alphbanx.mirror.png
│   ├── ayin-retro/
│   │   ├── cover.jpg
│   │   └── 04.ayin.retro.png
│   └── alphscan.io/
│       ├── cover.jpg
│       └── FireShot Capture 016 - Alephium Explorer - [localhost].png
└── digital-marketplace-platform/
    ├── cover.jpg
    ├── mytroc-pro/
    │   ├── cover.jpg
    │   └── MyTrocpro.png
    └── custom-clients/
        ├── cover.jpg          ← generated from enedis.png
        ├── enedis.png
        ├── life2life.png
        └── sncf.png
```

- Each folder uses `cover.jpg` as the card/thumbnail image (regenerate with ImageMagick from the primary screenshot if deleted).
- Additional screenshots in the same folder are listed in `data/seed/projects.json` under `images`.
- Alt text and captions are defined in `projects.json` (FR/EN).

Regenerate a missing cover:

```bash
convert path/to/screenshot.png -quality 85 -resize '1920x>' path/to/cover.jpg
```
