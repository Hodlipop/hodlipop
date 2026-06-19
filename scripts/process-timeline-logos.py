#!/usr/bin/env python3
"""Rename timeline logos and normalize raster images to square PNGs."""

from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "apps/web/public/images/timeline"
SIZE = 128

# old filename -> new filename (per folder)
RENAMES: dict[str, dict[str, str]] = {
    "freelance-2025": {
        "logo.png": "01-hodlipop.png",
        "Alephium-Logo-W-text.svg": "02-alephium.svg",
    },
    "mytroc-cto": {
        "reemploi-mytroc-logo-carre.png": "01-mytroc.png",
        "Logo_enedis_header.png": "02-enedis.png",
        "edf-home.png": "03-edf.png",
        "Logo_SNCF_(2011).svg": "04-sncf.svg",
        "960px-Logo_Suez_2016.png": "05-suez.png",
        "RGB_VEOLIA_HD.png": "06-veolia.png",
        "ParisHabitat.png": "07-paris-habitat.png",
        "Arts_et_métiers_Logo_couleur_FR-690x450.png": "08-arts-et-metiers.png",
    },
    "cnrs-hotvolc": {
        "Centre_national_de_la_recherche.png": "01-cnrs.png",
        "logo_UCA.jpg": "02-uca.png",
    },
    "harvest-rd": {
        "harvest_rgb2.webp": "01-harvest.png",
    },
    "reykjavik-phd": {
        "University_of_Iceland_logo.svg.png": "01-university-of-iceland.png",
        "Icelandic_Meteorological_Office_Logo.png": "02-imo.png",
    },
    "cea-cassini": {
        "LOGO_CEA_ORIGINAL_2022.svg": "01-cea.svg",
        "NASA-Logo.svg": "02-nasa.svg",
        "Cassini-Huygens_logo.png": "03-cassini-huygens.png",
    },
    "cnes-mars-express": {
        "CNES.svg": "01-cnes.svg",
        "Mars_Express_pillars.png": "02-mars-express.png",
        "Logo-OMP.png": "03-omp.png",
    },
    "arianespace": {
        "Arianespace.jpg": "01-arianespace.png",
        "ESA.jpg": "02-esa.png",
    },
    "eads-fleximage": {
        "EADS_logo.svg": "01-eads.svg",
    },
    "aerospatiale": {
        "aerospatiale.logo.jpg": "01-aerospatiale.png",
    },
}

RASTER_EXT = {".png", ".jpg", ".jpeg", ".webp"}


def square_svg(src: Path, dest: Path) -> None:
    subprocess.run(
        [
            "convert",
            "-background",
            "white",
            "-density",
            "300",
            str(src),
            "-resize",
            f"{SIZE}x{SIZE}>",
            "-gravity",
            "center",
            "-extent",
            f"{SIZE}x{SIZE}",
            str(dest),
        ],
        check=True,
    )


def square_image(src: Path, dest: Path) -> None:
    img = Image.open(src)
    if img.mode not in ("RGBA", "RGB"):
        img = img.convert("RGBA")

    w, h = img.size
    scale = min(SIZE / w, SIZE / h)
    new_w, new_h = max(1, int(w * scale)), max(1, int(h * scale))
    img = img.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 255))
    offset = ((SIZE - new_w) // 2, (SIZE - new_h) // 2)
    canvas.paste(img, offset, img if img.mode == "RGBA" else None)
    canvas.save(dest, "PNG", optimize=True)


def process_folder(folder: Path, renames: dict[str, str]) -> None:
    staging = folder / "_staging"
    staging.mkdir(exist_ok=True)

    for old_name, new_name in renames.items():
        src = folder / old_name
        if not src.exists():
            print(f"  skip missing: {old_name}")
            continue

        dest = staging / new_name
        ext = Path(new_name).suffix.lower()

        if ext in RASTER_EXT or ext == ".png":
            square_image(src, dest if dest.suffix == ".png" else dest.with_suffix(".png"))
            if dest.suffix != ".png":
                dest = dest.with_suffix(".png")
        elif ext == ".svg":
            tmp_png = staging / f"{Path(new_name).stem}.png"
            square_svg(src, tmp_png)
            dest = tmp_png
        else:
            shutil.copy2(src, dest)

        print(f"  {old_name} -> {dest.name}")

    # Remove old files (except .gitkeep, README)
    for item in folder.iterdir():
        if item.name in (".gitkeep", "README.md", "_staging"):
            continue
        if item.is_file():
            item.unlink()

    # Move staged files back
    for item in staging.iterdir():
        shutil.move(str(item), str(folder / item.name))
    staging.rmdir()


def main() -> None:
    for folder_id, renames in RENAMES.items():
        folder = ROOT / folder_id
        if not folder.exists():
            print(f"missing folder: {folder_id}")
            continue
        print(f"\n{folder_id}/")
        process_folder(folder, renames)

    print("\nDone.")


if __name__ == "__main__":
    main()
