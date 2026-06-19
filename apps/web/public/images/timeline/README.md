# Timeline customer logos

Drop client/employer logos here — one folder per career step (matches timeline `id` in `data/i18n/fr.json`).

## Directory structure

```
public/images/timeline/
├── freelance-2025/     ← HODLIPOP / current freelance
├── mytroc-cto/         ← MyTroc + clients
├── cnrs-hotvolc/       ← CNRS HotVolc
├── harvest-rd/         ← Harvest SA
├── reykjavik-phd/      ← Reykjavik University
├── cea-cassini/        ← CEA / Cassini
├── cnes-mars-express/  ← CNES / Mars Express
├── arianespace/        ← ARIANESPACE / ESA
├── eads-fleximage/     ← EADS Fleximage
└── aerospatiale/       ← Aérospatiale
```

## Alt text & tooltips

Edit `logos.json` in this folder to set FR/EN labels (shown as `alt` + hover tooltip):

```json
{
  "mytroc-cto": {
    "01-mytroc.png": {
      "fr": "MyTroc Pro",
      "en": "MyTroc Pro"
    }
  }
}
```

If a file has no entry, a label is auto-generated from the filename.

## Naming convention

Use numbered kebab-case filenames to control display order:

```
01-mytroc.png
02-enedis.png
03-edf.png
04-sncf.svg
```

Run `python3 scripts/square-timeline-svgs.py` to convert any SVG logos to **128×128 px square PNGs** (letterboxed, nothing cropped).

Run `python3 scripts/process-timeline-logos.py` after adding raw files to normalize raster images.

## Current logos

| Folder | Files |
|--------|-------|
| `freelance-2025` | hodlipop, alephium |
| `mytroc-cto` | mytroc, enedis, edf, sncf, suez, veolia, paris-habitat, arts-et-metiers |
| `cnrs-hotvolc` | cnrs, uca |
| `harvest-rd` | harvest |
| `reykjavik-phd` | university-of-iceland, imo |
| `cea-cassini` | cea, nasa, cassini-huygens |
| `cnes-mars-express` | cnes, mars-express, omp |
| `arianespace` | arianespace, esa |
| `eads-fleximage` | eads |
| `aerospatiale` | aerospatiale |
