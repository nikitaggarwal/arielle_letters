#!/usr/bin/env python3
"""Diagnose notebook line removal effectiveness."""

import numpy as np
from PIL import Image

ASSETS = "/Users/Nikita/.cursor/projects/Users-Nikita-github-arielle-letters/assets"

files = {
    "coffee_cup": f"{ASSETS}/Screenshot_2026-04-04_at_1.00.44_AM-04e160ab-3714-422d-aadd-1e208fa5cb9f.png",
    "cake_and_gift": f"{ASSETS}/Screenshot_2026-04-04_at_1.06.34_AM-b0422557-d307-40b8-a4ae-05f3d38394ba.png",
    "twentyseventh": f"{ASSETS}/Screenshot_2026-04-04_at_1.02.00_AM-eac34e18-50cc-4c63-9f31-ad98f04778c3.png",
}

for name, path in files.items():
    img = Image.open(path).convert("RGB")
    arr = np.array(img).astype(np.float64) / 255.0
    h, w = arr.shape[:2]
    lum = 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]

    print(f"\n=== {name} ({w}x{h}) ===")
    print(f"  Lum range: {lum.min():.3f} - {lum.max():.3f}")
    print(f"  Lum mean: {lum.mean():.3f}")
    print(f"  Lum percentiles: 5th={np.percentile(lum, 5):.3f}, 50th={np.percentile(lum, 50):.3f}, 95th={np.percentile(lum, 95):.3f}")

    bg_thresh = 0.55
    row_means = []
    for y in range(h):
        bg_mask = lum[y] > bg_thresh
        n_bg = np.sum(bg_mask)
        if n_bg > w * 0.1:
            row_means.append((y, np.mean(lum[y][bg_mask]), n_bg / w))
        else:
            row_means.append((y, np.nan, n_bg / w))

    means_arr = np.array([m[1] for m in row_means])
    valid = ~np.isnan(means_arr)
    if np.any(valid):
        indices = np.arange(h)
        filled = np.interp(indices, indices[valid], means_arr[valid])

        window = 30
        expected = np.zeros(h)
        for y in range(h):
            lo = max(0, y - window)
            hi = min(h, y + window + 1)
            expected[y] = np.percentile(filled[lo:hi], 85)

        dips = expected - filled
        big_dips = [(y, dips[y], filled[y], expected[y]) for y in range(h) if dips[y] > 0.01]
        print(f"  Rows with dip > 0.01: {len(big_dips)}")
        for y, dip, mean, exp in big_dips[:30]:
            print(f"    Row {y}: dip={dip:.4f}, bg_mean={mean:.4f}, expected={exp:.4f}")

        if not big_dips:
            print("  No significant dips detected!")
            print("  Sample row bg means:")
            for y in range(0, h, max(1, h // 20)):
                print(f"    Row {y}: bg_mean={filled[y]:.4f}, expected={expected[y]:.4f}, dip={expected[y]-filled[y]:.4f}")

    # Check color channels separately for cake_and_gift (blue lines)
    if "cake" in name:
        print(f"\n  Color channel analysis (looking for blue lines):")
        for y in [0, h//4, h//2, 3*h//4, h-1]:
            bg_mask = lum[y] > bg_thresh
            if np.sum(bg_mask) > 10:
                r = np.mean(arr[y, bg_mask, 0])
                g = np.mean(arr[y, bg_mask, 1])
                b = np.mean(arr[y, bg_mask, 2])
                print(f"    Row {y}: R={r:.3f} G={g:.3f} B={b:.3f}")

        # Check all rows for blue tint
        print(f"\n  Rows with notable blue tint (B-G > 0.03 in bg pixels):")
        for y in range(h):
            bg_mask = lum[y] > bg_thresh
            if np.sum(bg_mask) > w * 0.1:
                r = np.mean(arr[y, bg_mask, 0])
                g = np.mean(arr[y, bg_mask, 1])
                b = np.mean(arr[y, bg_mask, 2])
                if b - g > 0.03:
                    print(f"    Row {y}: R={r:.3f} G={g:.3f} B={b:.3f}, B-G={b-g:.3f}")
