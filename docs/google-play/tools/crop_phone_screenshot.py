"""Crop a browser capture to the 405×720 phone canvas shown at its top-left."""

from pathlib import Path
import sys

from PIL import Image


if len(sys.argv) != 3:
    raise SystemExit("Usage: crop_phone_screenshot.py INPUT OUTPUT")

source = Path(sys.argv[1])
destination = Path(sys.argv[2])
destination.parent.mkdir(parents=True, exist_ok=True)

with Image.open(source) as image:
    image.crop((0, 0, 405, 720)).convert("RGB").save(destination, "PNG", optimize=True)
