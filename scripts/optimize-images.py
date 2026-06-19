#!/usr/bin/env python3
"""Losslessly resize and recompress raster assets under apps/web/public/."""

from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps/web/public"
IMAGES = PUBLIC / "images"

REF_FILES = [
    ROOT / "data/seed/projects.json",
    ROOT / "data/i18n/fr.json",
    ROOT / "data/i18n/en.json",
    ROOT / "apps/web/public/images/projects/projects.json",
    ROOT / "apps/web/src/components/sections/HeroShowcase.tsx",
]

RASTER_EXT = {".png", ".jpg", ".jpeg", ".webp"}


@dataclass(frozen=True)
class Rule:
    max_side: int
    jpeg_quality: int = 82
    png_to_jpeg: bool = False


def rule_for(path: Path) -> Rule | None:
    rel = path.relative_to(IMAGES).as_posix()

    if rel.startswith("timeline/"):
        return None
    if rel == "cv/j.decriem.jpg":
        return Rule(max_side=384, jpeg_quality=85)
    if rel.startswith("cv/education/"):
        return Rule(max_side=256, jpeg_quality=85, png_to_jpeg=True)
    if rel.endswith("hero.background.jpg") or rel == "hero/hero.background.jpg":
        return Rule(max_side=1920, jpeg_quality=80)
    if rel.startswith("hero/") and path.suffix.lower() in RASTER_EXT:
        return Rule(max_side=1440, jpeg_quality=85, png_to_jpeg=True)
    if rel.endswith("cover.jpg"):
        return Rule(max_side=1280, jpeg_quality=82)
    if "/custom-clients/" in rel and path.suffix.lower() == ".png":
        return Rule(max_side=640, jpeg_quality=85, png_to_jpeg=True)
    if rel.startswith("projects/") and path.suffix.lower() == ".png":
        return Rule(max_side=1440, jpeg_quality=85, png_to_jpeg=True)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        return Rule(max_side=1920, jpeg_quality=82)
    return None


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ("RGBA", "LA"):
        return img.getchannel("A").getextrema()[0] < 255
    if img.mode == "P":
        return "transparency" in img.info
    return False


def resize(img: Image.Image, max_side: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    scale = max_side / max(w, h)
    new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
    return img.resize(new_size, Image.LANCZOS)


def save_jpeg(img: Image.Image, dest: Path, quality: int) -> None:
    rgb = img.convert("RGB")
    rgb.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)


def save_png(img: Image.Image, dest: Path) -> None:
    img.save(dest, "PNG", optimize=True, compress_level=9)


def run_optipng(path: Path) -> None:
    subprocess.run(["optipng", "-quiet", "-o7", str(path)], check=False)


def run_jpegoptim(path: Path, quality: int) -> None:
    subprocess.run(
        ["jpegoptim", f"--max={quality}", "--strip-all", "--force", str(path)],
        check=False,
    )


def optimize_file(path: Path) -> tuple[int, int, str | None]:
    rule = rule_for(path)
    if rule is None:
        return 0, 0, None

    before = path.stat().st_size
    img = Image.open(path)
    img = resize(img, rule.max_side)

    opaque = not has_alpha(img)
    use_jpeg = path.suffix.lower() in {".jpg", ".jpeg"} or (rule.png_to_jpeg and opaque)

    if use_jpeg:
        dest = path.with_suffix(".jpg")
        save_jpeg(img, dest, rule.jpeg_quality)
        run_jpegoptim(dest, rule.jpeg_quality)
        if dest != path and path.exists():
            path.unlink()
        final_path = dest
    else:
        save_png(img, path)
        run_optipng(path)
        final_path = path

    after = final_path.stat().st_size
    old_public = f"/images/{path.relative_to(IMAGES).as_posix()}"
    new_public = f"/images/{final_path.relative_to(IMAGES).as_posix()}"
    rename = old_public if old_public == new_public else new_public
    return before, after, rename if old_public != new_public else None


def optimize_logos() -> None:
    """Site logos are already small — skip to avoid re-encoding bloat."""


def patch_references(renames: dict[str, str]) -> None:
    if not renames:
        return

    for ref_file in REF_FILES:
        text = ref_file.read_text()
        original = text
        for old, new in sorted(renames.items(), key=lambda item: len(item[0]), reverse=True):
            text = text.replace(old, new)
            old_name = Path(old).name
            new_name = Path(new).name
            if old_name != new_name:
                text = text.replace(old_name, new_name)
        if text != original:
            ref_file.write_text(text)
            print(f"  updated refs in {ref_file.relative_to(ROOT)}")


def main() -> None:
    total_before = 0
    total_after = 0
    renames: dict[str, str] = {}

    print("Logos:")
    optimize_logos()

    print("\nImages:")
    for path in sorted(IMAGES.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in RASTER_EXT:
            continue
        if path.name.startswith("."):
            continue

        before, after, rename = optimize_file(path)
        if before == 0:
            continue

        total_before += before
        total_after += after
        rel = path.relative_to(IMAGES)
        saved = 100 - (after * 100 // max(before, 1))
        line = f"  {rel}: {before // 1024}KB -> {after // 1024}KB ({saved}% saved)"
        if rename:
            old = f"/images/{rel.as_posix()}"
            renames[old] = rename
            line += f"  [{Path(old).name} -> {Path(rename).name}]"
        print(line)

    duplicate = IMAGES / "hero.background.jpg"
    if duplicate.exists():
        duplicate.unlink()
        print("\n  removed duplicate images/hero.background.jpg")

    patch_references(renames)

    print(
        f"\nTotal: {total_before // 1024}KB -> {total_after // 1024}KB "
        f"({100 - (total_after * 100 // max(total_before, 1))}% saved)"
    )


if __name__ == "__main__":
    main()
