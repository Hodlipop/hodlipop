#!/usr/bin/env python3
"""Convert timeline SVG logos to letterboxed square PNGs (128×128)."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "apps/web/public/images/timeline"
METADATA = ROOT / "logos.json"
SIZE = 128


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


def update_metadata(svg_name: str, png_name: str, metadata: dict) -> None:
    for folder_logos in metadata.values():
        if svg_name in folder_logos:
            folder_logos[png_name] = folder_logos.pop(svg_name)


def main() -> None:
    metadata: dict = {}
    if METADATA.exists():
        metadata = json.loads(METADATA.read_text())

    converted = 0
    for svg in sorted(ROOT.rglob("*.svg")):
        png = svg.with_suffix(".png")
        print(f"  {svg.relative_to(ROOT)} -> {png.name}")
        square_svg(svg, png)
        svg.unlink()
        update_metadata(svg.name, png.name, metadata)
        converted += 1

    if metadata:
        METADATA.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n")

    print(f"\nConverted {converted} SVG(s).")


if __name__ == "__main__":
    main()
