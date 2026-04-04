#!/usr/bin/env python3
"""Process notebook drawings: remove lines, transparent bg, recolor to grey."""

import numpy as np
from PIL import Image
import os

ASSETS = "/Users/Nikita/.cursor/projects/Users-Nikita-github-arielle-letters/assets"
OUT = "/Users/Nikita/github/arielle_letters/public/drawings"
GREY = 65
BG_MARGIN = 0.05

MAPPINGS = {
    "coffee_cup.png": "Screenshot_2026-04-04_at_1.00.44_AM-04e160ab-3714-422d-aadd-1e208fa5cb9f.png",
    "cake_and_gift.png": "Screenshot_2026-04-04_at_1.06.34_AM-b0422557-d307-40b8-a4ae-05f3d38394ba.png",
    "twentyseventh.png": "Screenshot_2026-04-04_at_1.02.00_AM-eac34e18-50cc-4c63-9f31-ad98f04778c3.png",
}


def compute_luminance(rgb):
    return 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]


def remove_thin_dark_lines(rgb, lum):
    """Remove very dark notebook lines by detecting thin (≤4 row) horizontal
    dark bands that have bright backgrounds above and below.
    
    Unlike drawing strokes which extend many rows vertically, notebook lines
    are very thin. For each dark pixel, measure the vertical extent of the
    dark band and only correct if it's thin.
    """
    h, w = lum.shape
    dark_threshold = 0.45
    bright_threshold = 0.55
    max_line_width = 4
    required_bright_neighbors = 3

    # Precompute: for each (y, x), how tall is the contiguous dark band?
    dark_mask = lum < dark_threshold
    
    # For each column, compute the height of the dark run containing each pixel
    dark_run_height = np.zeros((h, w), dtype=np.int32)
    for x in range(w):
        col = dark_mask[:, x]
        run_start = -1
        runs = []
        for y in range(h):
            if col[y]:
                if run_start == -1:
                    run_start = y
            else:
                if run_start != -1:
                    runs.append((run_start, y))
                    run_start = -1
        if run_start != -1:
            runs.append((run_start, h))
        for start, end in runs:
            run_len = end - start
            dark_run_height[start:end, x] = run_len

    corrected = rgb.copy()
    n_fixed = 0

    # Only process pixels in thin dark bands
    candidates = (dark_run_height > 0) & (dark_run_height <= max_line_width)
    
    for y in range(h):
        for x in range(w):
            if not candidates[y, x]:
                continue

            # Check bright neighbors above and below
            bright_above = 0
            bright_below = 0
            rgb_above = []
            rgb_below = []
            
            for dy in range(1, required_bright_neighbors + 3):
                if y - dy >= 0 and lum[y - dy, x] > bright_threshold:
                    bright_above += 1
                    rgb_above.append(rgb[y - dy, x])
                    if bright_above >= required_bright_neighbors:
                        break
                elif y - dy >= 0 and lum[y - dy, x] < dark_threshold:
                    break

            for dy in range(1, required_bright_neighbors + 3):
                if y + dy < h and lum[y + dy, x] > bright_threshold:
                    bright_below += 1
                    rgb_below.append(rgb[y + dy, x])
                    if bright_below >= required_bright_neighbors:
                        break
                elif y + dy < h and lum[y + dy, x] < dark_threshold:
                    break

            if bright_above >= required_bright_neighbors and bright_below >= required_bright_neighbors:
                all_rgbs = rgb_above[:2] + rgb_below[:2]
                corrected[y, x] = np.mean(all_rgbs, axis=0)
                n_fixed += 1

    if n_fixed > 0:
        print(f"    Phase 1: fixed {n_fixed} thin dark line pixels")
    return corrected


def remove_notebook_lines(img_array):
    """Remove notebook lines in two phases:
    
    Phase 1: Remove very dark thin lines (≤4 px) via vertical interpolation
    Phase 2: Fix remaining brightness dips via vertical percentile reference
    """
    h, w = img_array.shape[:2]
    rgb = img_array[:, :, :3].astype(np.float64) / 255.0
    lum = compute_luminance(rgb)

    bg_threshold = 0.55
    half_win = 30

    # Phase 1: thin dark line removal
    rgb = remove_thin_dark_lines(rgb, lum)
    lum = compute_luminance(rgb)

    # Phase 2: lighter line correction via vertical percentile
    bg_lum = lum.copy()
    for y in range(h):
        bg_mask = lum[y] > bg_threshold
        if np.sum(bg_mask) > 5:
            row_bg_median = np.median(lum[y][bg_mask])
            bg_lum[y, ~bg_mask] = row_bg_median
        else:
            bg_lum[y, :] = np.median(lum[y])

    reference = np.zeros_like(lum)
    for y in range(h):
        lo = max(0, y - half_win)
        hi = min(h, y + half_win + 1)
        reference[y] = np.percentile(bg_lum[lo:hi], 85, axis=0)

    ink_cutoff = 0.40
    min_deficit = 0.008

    deficit = reference - lum
    correct_mask = (lum > ink_cutoff) & (deficit > min_deficit)

    target = reference + 0.003
    corrected_lum = np.minimum(lum + deficit, target)
    scale = np.ones_like(lum)
    safe = lum > 1e-6
    scale[safe & correct_mask] = corrected_lum[safe & correct_mask] / lum[safe & correct_mask]

    corrected = rgb.copy()
    for c in range(3):
        corrected[:, :, c] = np.where(correct_mask,
                                       np.minimum(corrected[:, :, c] * scale, 1.0),
                                       corrected[:, :, c])

    n_corrected = np.sum(correct_mask)
    print(f"    Phase 2: corrected {n_corrected} pixels ({n_corrected / (h * w) * 100:.1f}%)")

    result = img_array.copy()
    result[:, :, :3] = (np.clip(corrected, 0, 1) * 255).astype(np.uint8)
    return result


def to_transparent_grey(img_array):
    """Convert to transparent background with uniform dark grey ink."""
    rgb = img_array[:, :, :3].astype(np.float64) / 255.0
    lum = compute_luminance(rgb)

    bg_level = np.percentile(lum, 96)
    effective_bg = bg_level - BG_MARGIN

    ink_pixels = lum[lum < effective_bg]
    dark_ink = np.percentile(ink_pixels, 5) if len(ink_pixels) > 0 else 0.0

    ink = 1.0 - lum
    effective_bg_ink = 1.0 - effective_bg
    dark_ink_val = 1.0 - dark_ink

    alpha = np.power(
        np.clip((ink - effective_bg_ink) / (dark_ink_val - effective_bg_ink), 0, 1),
        0.7
    )

    h, w = img_array.shape[:2]
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[:, :, 0] = GREY
    out[:, :, 1] = GREY
    out[:, :, 2] = GREY
    out[:, :, 3] = (alpha * 255).astype(np.uint8)
    return out


def process_image(name, src_filename):
    src_path = os.path.join(ASSETS, src_filename)
    out_path = os.path.join(OUT, name)

    print(f"Processing {name} from {src_filename}...")
    img = Image.open(src_path).convert("RGB")
    arr = np.array(img)
    print(f"  Source size: {arr.shape[1]}x{arr.shape[0]}")

    corrected = remove_notebook_lines(arr)
    result = to_transparent_grey(corrected)

    out_img = Image.fromarray(result, "RGBA")
    out_img.save(out_path)
    print(f"  Saved {out_path} ({result.shape[1]}x{result.shape[0]})")


def fix_balloons():
    path = os.path.join(OUT, "balloons.png")
    print(f"\nFixing balloons.png top row...")
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    print(f"  Before: row 0 max alpha = {arr[0, :, 3].max()}")
    arr[0, :, 3] = 0
    out = Image.fromarray(arr, "RGBA")
    out.save(path)
    print(f"  After: row 0 alpha set to 0")


def check_twentyseventh():
    path = os.path.join(OUT, "twentyseventh.png")
    print(f"\nChecking twentyseventh.png for remaining full-width visible rows...")
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]

    visible_threshold = 10
    problem_rows = []
    for y in range(h):
        visible_frac = np.mean(arr[y, :, 3] > visible_threshold)
        if visible_frac > 0.60:
            problem_rows.append((y, visible_frac))

    if problem_rows:
        print(f"  WARNING: {len(problem_rows)} rows with >60% visible pixels:")
        for y, frac in problem_rows[:30]:
            print(f"    Row {y}: {frac*100:.1f}% visible")
    else:
        print(f"  OK: No rows with >60% visible pixels")


if __name__ == "__main__":
    for name, src in MAPPINGS.items():
        process_image(name, src)

    fix_balloons()
    check_twentyseventh()
    print("\nDone!")
