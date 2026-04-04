#!/usr/bin/env python3
"""Check what's happening before and after correction."""

import numpy as np
from PIL import Image

ASSETS = "/Users/Nikita/.cursor/projects/Users-Nikita-github-arielle-letters/assets"
OUT = "/Users/Nikita/github/arielle_letters/public/drawings"

src = f"{ASSETS}/Screenshot_2026-04-04_at_1.00.44_AM-04e160ab-3714-422d-aadd-1e208fa5cb9f.png"
img = Image.open(src).convert("RGB")
arr = np.array(img).astype(np.float64) / 255.0
h, w = arr.shape[:2]
lum = 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]

print(f"Coffee cup: {w}x{h}")
print(f"\nRow-by-row background brightness (first 20 rows):")
for y in range(min(20, h)):
    bg_mask = lum[y] > 0.55
    n = np.sum(bg_mask)
    if n > 0:
        mean = np.mean(lum[y][bg_mask])
        mn = np.min(lum[y][bg_mask])
        mx = np.max(lum[y][bg_mask])
        print(f"  Row {y}: bg_mean={mean:.4f}, min={mn:.4f}, max={mx:.4f}, n_bg={n}/{w}")
    else:
        print(f"  Row {y}: no bg pixels")

# Check the output file alpha values in line regions
out_path = f"{OUT}/coffee_cup.png"
out_img = Image.open(out_path).convert("RGBA")
out_arr = np.array(out_img)

print(f"\nOutput alpha analysis for line rows (rows 8-15):")
for y in range(8, 16):
    alphas = out_arr[y, :, 3]
    print(f"  Row {y}: mean_alpha={alphas.mean():.1f}, max_alpha={alphas.max()}, "
          f"frac_visible={np.mean(alphas > 5)*100:.1f}%, "
          f"frac_a>20={np.mean(alphas > 20)*100:.1f}%")

print(f"\nOutput alpha analysis for non-line rows near lines (rows 0-7):")
for y in range(0, 8):
    alphas = out_arr[y, :, 3]
    print(f"  Row {y}: mean_alpha={alphas.mean():.1f}, max_alpha={alphas.max()}, "
          f"frac_visible={np.mean(alphas > 5)*100:.1f}%, "
          f"frac_a>20={np.mean(alphas > 20)*100:.1f}%")

# Compare line row 70 vs nearby non-line row 65
print(f"\nComparing line row 70 vs non-line row 65:")
for y in [65, 70]:
    alphas = out_arr[y, :, 3]
    print(f"  Row {y}: mean_alpha={alphas.mean():.1f}, max_alpha={alphas.max()}, "
          f"frac_a>5={np.mean(alphas > 5)*100:.1f}%, "
          f"frac_a>20={np.mean(alphas > 20)*100:.1f}%")

# Also look at the broader picture - which rows have highest mean alpha
# (excluding rows with actual drawing content)
print(f"\nAll rows sorted by mean alpha (top 30):")
row_alphas = [(y, out_arr[y, :, 3].mean()) for y in range(h)]
row_alphas.sort(key=lambda x: -x[1])
for y, ma in row_alphas[:30]:
    print(f"  Row {y}: mean_alpha={ma:.1f}")
