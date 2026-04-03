#!/usr/bin/env python3
"""
Comparación de triángulos en las tres geometrías.
Salida: public/non-euclidean-geometries/comparison.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).parents[4] / "public" / "non-euclidean-geometries"
OUT.mkdir(parents=True, exist_ok=True)

RED  = "#e63946"
BG   = "#f7f7f9"
DARK = "#222233"


# ── Poincaré helpers (copiados para que el script sea autónomo) ───────────────

def _circumcircle(p1, p2, p3):
    ax, ay = p1;  bx, by = p2;  cx, cy = p3
    D = 2*(ax*(by-cy) + bx*(cy-ay) + cx*(ay-by))
    if abs(D) < 1e-12:
        return None, None
    ux = ((ax**2+ay**2)*(by-cy) + (bx**2+by**2)*(cy-ay) + (cx**2+cy**2)*(ay-by)) / D
    uy = ((ax**2+ay**2)*(cx-bx) + (bx**2+by**2)*(ax-cx) + (cx**2+cy**2)*(bx-ax)) / D
    return np.array([ux, uy]), np.hypot(ax-ux, ay-uy)

def geodesic_pts(p1, p2, n=400):
    p1, p2 = np.asarray(p1, float), np.asarray(p2, float)
    if abs(p1[0]*p2[1] - p1[1]*p2[0]) < 1e-9:
        d = p2 - p1;  d /= np.linalg.norm(d)
        px, py = p1;  dx, dy = d
        b = px*dx + py*dy
        disc = max(0.0, b**2 - (px**2+py**2-1))
        t1, t2 = -b - np.sqrt(disc), -b + np.sqrt(disc)
        s, e = p1 + t1*d, p1 + t2*d
        return np.linspace(s[0], e[0], n), np.linspace(s[1], e[1], n)
    r2 = np.dot(p1, p1)
    C, R = _circumcircle(p1, p2, p1/r2)
    if C is None:
        return None, None
    ux, uy = C
    dc = np.linalg.norm(C)
    foot = C / dc**2
    perp = np.array([-uy, ux]) / dc
    t = np.sqrt(max(0.0, 1 - 1/dc**2))
    e1, e2 = foot + t*perp, foot - t*perp
    a_e1 = np.arctan2(e1[1]-uy, e1[0]-ux)
    a_e2 = np.arctan2(e2[1]-uy, e2[0]-ux)
    a_o  = np.arctan2(-uy, -ux)
    def norm(a, base):
        while a < base:          a += 2*np.pi
        while a >= base+2*np.pi: a -= 2*np.pi
        return a
    a_e2n = norm(a_e2, a_e1)
    if norm(a_o, a_e1) <= a_e2n:
        thetas = np.linspace(a_e1, a_e2n, n)
    else:
        thetas = np.linspace(a_e2, norm(a_e1, a_e2), n)
    return ux + R*np.cos(thetas), uy + R*np.sin(thetas)

def draw_geo(ax, p1, p2, **kw):
    xs, ys = geodesic_pts(p1, p2)
    if xs is not None:
        ax.plot(xs, ys, **kw)


# ── bezier para triángulo esférico ────────────────────────────────────────────

def bulge_arc(p1, p2, bulge=0.28, n=120):
    """Bezier cuadrático curvado hacia afuera del centroide."""
    centroid = np.array([0.0, 0.0])
    mid = (p1 + p2) / 2
    out = mid - centroid
    norm = np.linalg.norm(out)
    ctrl = mid + (bulge / max(norm, 1e-9)) * out
    ts = np.linspace(0, 1, n)
    xs = (1-ts)**2*p1[0] + 2*(1-ts)*ts*ctrl[0] + ts**2*p2[0]
    ys = (1-ts)**2*p1[1] + 2*(1-ts)*ts*ctrl[1] + ts**2*p2[1]
    return xs, ys


# ── figura ────────────────────────────────────────────────────────────────────

fig, axes = plt.subplots(1, 3, figsize=(13, 5), facecolor="white")
fig.subplots_adjust(wspace=0.08)

θ = np.linspace(0, 2*np.pi, 300)

# Vértices comunes (escalados según el panel)
scale = 0.78
A_base  = np.array([ 0.00,  1.00]) * scale
B_base  = np.array([-0.87, -0.50]) * scale
C_base  = np.array([ 0.87, -0.50]) * scale

labels_offsets = [
    ("$A$", (-0.10,  0.09)),
    ("$B$", (-0.16, -0.12)),
    ("$C$", ( 0.06, -0.12)),
]

# ── Panel 1: Euclídea ─────────────────────────────────────────────────────────
ax = axes[0]
ax.set_facecolor(BG)
tri = plt.Polygon([A_base, B_base, C_base], fill=False, edgecolor=RED, lw=2.8, zorder=4)
ax.add_patch(tri)
for pt, (lbl, off) in zip([A_base, B_base, C_base], labels_offsets):
    ax.plot(*pt, "o", color=RED, ms=8, zorder=8)
    ax.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=13, color=RED, fontweight="bold")

ax.set_xlim(-1.2, 1.2); ax.set_ylim(-1.0, 1.15)
ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Geometría euclídea\n$K = 0$", fontsize=12, fontweight="bold", pad=6)
ax.text(0.5, -0.04, r"$\alpha+\beta+\gamma = 180°$",
        transform=ax.transAxes, fontsize=11, ha="center", va="top",
        bbox=dict(boxstyle="round,pad=0.3", facecolor="white", edgecolor="#ccc", alpha=0.9))

# ── Panel 2: Hiperbólica (disco de Poincaré) ──────────────────────────────────
ax = axes[1]
ax.set_facecolor(BG)
ax.fill(np.cos(θ), np.sin(θ), color="white", zorder=0)
ax.plot(np.cos(θ), np.sin(θ), color=DARK, lw=2, zorder=10)

A2 = np.array([ 0.00,  0.72])
B2 = np.array([-0.63, -0.44])
C2 = np.array([ 0.63, -0.44])

draw_geo(ax, A2, B2, color=RED, lw=2.5, zorder=4)
draw_geo(ax, B2, C2, color=RED, lw=2.5, zorder=4)
draw_geo(ax, C2, A2, color=RED, lw=2.5, zorder=4)

for pt, (lbl, off) in zip([A2, B2, C2], labels_offsets):
    ax.plot(*pt, "o", color=RED, ms=8, zorder=8)
    ax.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=13, color=RED, fontweight="bold")

ax.set_xlim(-1.22, 1.22); ax.set_ylim(-1.22, 1.22)
ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Geometría hiperbólica\n$K < 0$", fontsize=12, fontweight="bold", pad=6)
ax.text(0.5, -0.02, r"$\alpha+\beta+\gamma < 180°$",
        transform=ax.transAxes, fontsize=11, ha="center", va="top",
        bbox=dict(boxstyle="round,pad=0.3", facecolor="white", edgecolor="#ccc", alpha=0.9))

# ── Panel 3: Elíptica (triángulo curvo) ───────────────────────────────────────
ax = axes[2]
ax.set_facecolor(BG)

A3 = np.array([ 0.00,  0.88]) * 0.9
B3 = np.array([-0.76, -0.44]) * 0.9
C3 = np.array([ 0.76, -0.44]) * 0.9

for a, b in [(A3, B3), (B3, C3), (C3, A3)]:
    xs, ys = bulge_arc(a, b)
    ax.plot(xs, ys, color=RED, lw=2.5, zorder=4)

for pt, (lbl, off) in zip([A3, B3, C3], labels_offsets):
    ax.plot(*pt, "o", color=RED, ms=8, zorder=8)
    ax.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=13, color=RED, fontweight="bold")

ax.set_xlim(-1.2, 1.2); ax.set_ylim(-1.0, 1.15)
ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Geometría elíptica\n$K > 0$", fontsize=12, fontweight="bold", pad=6)
ax.text(0.5, -0.04, r"$\alpha+\beta+\gamma > 180°$",
        transform=ax.transAxes, fontsize=11, ha="center", va="top",
        bbox=dict(boxstyle="round,pad=0.3", facecolor="white", edgecolor="#ccc", alpha=0.9))

# Nota: los lados curvados hacia fuera = curvatura positiva
ax.text(0, -0.78, "Los lados se curvan\nhacia afuera",
        fontsize=9, ha="center", color="#666", style="italic")

plt.suptitle("Los triángulos en las tres geometrías planas",
             fontsize=14, fontweight="bold", y=1.01)
fig.savefig(OUT / "comparison.png", dpi=150, bbox_inches="tight")
print(f"✓ {OUT / 'comparison.png'}")
