"""Generate a 300x300 PNG icon for the Button Slider Power BI visual.

Depicts the two modes of the visual:
  - top: a row of segmented buttons (one highlighted = selected)
  - bottom: a slider track with a selected range and a handle
"""
from PIL import Image, ImageDraw

SIZE = 300
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Palette (Power BI-ish blues)
BG = (255, 255, 255, 255)
ACCENT = (17, 119, 187, 255)      # selected / accent blue
ACCENT_DK = (10, 87, 138, 255)    # darker blue
NEUTRAL = (214, 222, 230, 255)    # unselected button / track
HANDLE = (255, 255, 255, 255)

def rounded(xy, r, fill, outline=None, width=0):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

# Rounded white background card
rounded([12, 12, SIZE - 12, SIZE - 12], 40, BG)

# --- Button row (top half) ---
# Four segmented tiles; the second is "selected" (accent)
bx0, bx1 = 44, SIZE - 44
by0, by1 = 74, 134
n = 4
gap = 12
tile_w = (bx1 - bx0 - gap * (n - 1)) / n
for i in range(n):
    x0 = bx0 + i * (tile_w + gap)
    x1 = x0 + tile_w
    if i == 1:
        rounded([x0, by0, x1, by1], 14, ACCENT)
    else:
        rounded([x0, by0, x1, by1], 14, NEUTRAL)

# --- Slider (bottom half) ---
sy = 210
sx0, sx1 = 44, SIZE - 44
track_h = 12
# Base track
rounded([sx0, sy - track_h // 2, sx1, sy + track_h // 2], track_h // 2, NEUTRAL)
# Selected range portion
sel_x1 = sx0 + int((sx1 - sx0) * 0.62)
rounded([sx0, sy - track_h // 2, sel_x1, sy + track_h // 2], track_h // 2, ACCENT)
# Handle (circle) at the end of the selected range
hr = 22
d.ellipse([sel_x1 - hr, sy - hr, sel_x1 + hr, sy + hr], fill=HANDLE, outline=ACCENT_DK, width=6)

img.save(r"C:\Users\Naser.Daneshi\PBI\ButtonSlider\assets\icon.png", "PNG")
print("wrote 300x300 icon:", img.size)
