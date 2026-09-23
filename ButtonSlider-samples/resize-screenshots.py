"""Convert Button Slider screenshots to exactly 1600x1200 PNG for AppSource.

Fits each source image onto a 1600x1200 canvas WITHOUT distortion:
  - scales the image down to fit within 1600x1200 preserving aspect ratio
  - centers it and pads the remaining space with a background color sampled
    from the image's top-left pixel (so the padding blends with the UI)
Originals (.jpg) are left untouched; new files are written as *-1600x1200.png
"""
import os
from PIL import Image

SRC_DIR = r"C:\Users\Naser.Daneshi\PBI\ButtonSlider-samples\screenshots"
TARGET = (1600, 1200)

sources = ["Button-Mode.jpg", "Slider-Mode.jpg"]

for name in sources:
    src_path = os.path.join(SRC_DIR, name)
    img = Image.open(src_path).convert("RGB")

    # Background = top-left pixel (usually the light UI background)
    bg = img.getpixel((0, 0))

    # Scale to fit within target, preserving aspect ratio
    scale = min(TARGET[0] / img.width, TARGET[1] / img.height)
    new_w = int(round(img.width * scale))
    new_h = int(round(img.height * scale))
    resized = img.resize((new_w, new_h), Image.LANCZOS)

    # Paste centered onto the padded canvas
    canvas = Image.new("RGB", TARGET, bg)
    offset = ((TARGET[0] - new_w) // 2, (TARGET[1] - new_h) // 2)
    canvas.paste(resized, offset)

    out_name = os.path.splitext(name)[0] + "-1600x1200.png"
    out_path = os.path.join(SRC_DIR, out_name)
    canvas.save(out_path, "PNG")
    print(f"{name} {img.size} -> {out_name} {canvas.size} (bg={bg}, scaled={new_w}x{new_h})")
