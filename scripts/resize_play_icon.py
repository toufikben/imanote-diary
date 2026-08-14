from pathlib import Path

from PIL import Image


SOURCE = Path("assets/images/icon.png")
TARGET = Path("docs/google-play/assets/private-diary-play-icon-512.png")


def main() -> None:
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as image:
        resized = image.convert("RGB").resize((512, 512), Image.Resampling.LANCZOS)
        resized.save(TARGET, format="PNG", optimize=True)


if __name__ == "__main__":
    main()
