#!/usr/bin/env python3
"""
Geometría elíptica: esfera con triángulo esférico de suma 270°.
Salida: public/non-euclidean-geometries/sphere.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401
from pathlib import Path

OUT = Path(__file__).parents[4] / "public" / "non-euclidean-geometries"
OUT.mkdir(parents=True, exist_ok=True)

RED  = "#e63946"
BLUE = "#3a86ff"
GRAY = "#adb5bd"


def great_arc(p1, p2, n=200):
    """Arco de círculo máximo entre p1 y p2 sobre la esfera unitaria."""
    p1 = np.asarray(p1, float); p1 /= np.linalg.norm(p1)
    p2 = np.asarray(p2, float); p2 /= np.linalg.norm(p2)
    omega = np.arccos(np.clip(np.dot(p1, p2), -1, 1))
    if abs(omega) < 1e-9:
        return np.tile(p1, (n, 1)).T
    ts = np.linspace(0, 1, n)
    pts = np.array([
        np.sin((1-t)*omega)/np.sin(omega)*p1 + np.sin(t*omega)/np.sin(omega)*p2
        for t in ts
    ])
    return pts[:, 0], pts[:, 1], pts[:, 2]


# ── figura ────────────────────────────────────────────────────────────────────

fig = plt.figure(figsize=(12, 5.5), facecolor="white")

# ── Vista 3D ──────────────────────────────────────────────────────────────────
ax3 = fig.add_subplot(121, projection="3d")
ax3.set_facecolor("white")

# Superficie de la esfera (translúcida)
u = np.linspace(0, 2*np.pi, 60)
v = np.linspace(0, np.pi, 40)
xs = np.outer(np.cos(u), np.sin(v))
ys = np.outer(np.sin(u), np.sin(v))
zs = np.outer(np.ones_like(u), np.cos(v))
ax3.plot_surface(xs, ys, zs, alpha=0.08, color=BLUE, zorder=0)

# Ecuador
t = np.linspace(0, 2*np.pi, 300)
ax3.plot(np.cos(t), np.sin(t), np.zeros_like(t), color=BLUE, lw=1.8, alpha=0.7)

# Meridianos de fondo
for lon in np.linspace(0, np.pi, 7):
    x = np.cos(lon)*np.cos(t); y = np.sin(lon)*np.cos(t); z = np.sin(t)
    ax3.plot(x, y, z, color=GRAY, lw=0.8, alpha=0.4)

# Triángulo: polo norte + E1(1,0,0) + E2(0,1,0)  →  ángulos = 90° cada uno
N  = [0, 0, 1]
E1 = [1, 0, 0]
E2 = [0, 1, 0]

for a, b in [(N, E1), (N, E2), (E1, E2)]:
    x, y, z = great_arc(a, b)
    ax3.plot(x, y, z, color=RED, lw=3, zorder=10)

for pt, lbl, off in [
    (N,  "$N$",  ( 0.08,  0.08,  0.13)),
    (E1, "$E_1$",( 0.13,  0.00, -0.16)),
    (E2, "$E_2$",( 0.00,  0.13, -0.16)),
]:
    ax3.scatter(*pt, color=RED, s=55, zorder=15)
    ax3.text(pt[0]+off[0], pt[1]+off[1], pt[2]+off[2], lbl,
             fontsize=11, color=RED, fontweight="bold")

ax3.set_xlim(-1.2, 1.2); ax3.set_ylim(-1.2, 1.2); ax3.set_zlim(-1.2, 1.2)
ax3.set_axis_off()
ax3.view_init(elev=22, azim=30)
ax3.set_title("Vista 3D\n$N$, $E_1$, $E_2$ forman un triángulo esférico",
              fontsize=11, pad=4)

# ── Vista esquemática cenital ─────────────────────────────────────────────────
ax2 = fig.add_subplot(122)
ax2.set_facecolor("#f7f7f9")
ax2.set_aspect("equal")

# Círculo exterior (ecuador visto desde arriba)
θ = np.linspace(0, 2*np.pi, 300)
ax2.plot(np.cos(θ), np.sin(θ), color=BLUE, lw=1.8, alpha=0.5)

# Los tres puntos en proyección cenital
# Polo norte → centro (0, 0), E1 → (1, 0), E2 → (0, 1) en el ecuador
N2  = np.array([0.0, 0.0])
E1_2 = np.array([1.0, 0.0])
E2_2 = np.array([0.0, 1.0])

# Los lados del triángulo esférico se curvan hacia afuera (curvatura positiva)
def curved_arc(p1, p2, bulge=0.22, n=120):
    """Bezier cuadrático curvado hacia afuera del centroide."""
    mid = (p1 + p2) / 2
    norm_dir = mid / (np.linalg.norm(mid) + 1e-9)
    ctrl = mid + bulge * norm_dir
    ts = np.linspace(0, 1, n)
    xs = (1-ts)**2*p1[0] + 2*(1-ts)*ts*ctrl[0] + ts**2*p2[0]
    ys = (1-ts)**2*p1[1] + 2*(1-ts)*ts*ctrl[1] + ts**2*p2[1]
    return xs, ys

# Lados del triángulo (curva hacia afuera)
for a, b in [(N2, E1_2), (N2, E2_2), (E1_2, E2_2)]:
    xs, ys = curved_arc(a, b)
    ax2.plot(xs, ys, color=RED, lw=2.8, zorder=4)

# Ángulos en cada vértice
angle_labels = [
    (N2,   "$\\gamma = 90°$", (0.00,  0.14), "center", "bottom"),
    (E1_2, "$\\alpha = 90°$", (0.13,  0.00), "left",   "center"),
    (E2_2, "$\\beta = 90°$",  (0.00,  0.13), "center", "bottom"),
]
for pt, lbl, off, ha, va in angle_labels:
    ax2.plot(*pt, "o", color=RED, ms=9, zorder=8)
    ax2.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=11,
             ha=ha, va=va, color="#333",
             bbox=dict(boxstyle="round,pad=0.25", facecolor="white", alpha=0.85, edgecolor="#ccc"))

ax2.text(0.32, 0.32,
         r"$\alpha+\beta+\gamma$" + "\n$= 270°$",
         fontsize=12, ha="center", color="#333", fontweight="bold",
         bbox=dict(boxstyle="round,pad=0.35", facecolor="white", edgecolor="#ccc"))

# Etiquetas de puntos
for pt, lbl, off in [(N2, "$N$ (polo)", (-0.15, -0.11)),
                      (E1_2, "$E_1$", (0.07, -0.11)),
                      (E2_2, "$E_2$", (-0.14, 0.06))]:
    ax2.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=10, color="#555")

ax2.set_xlim(-0.25, 1.35); ax2.set_ylim(-0.25, 1.35)
ax2.axis("off")
ax2.set_title("Proyección cenital\n(los lados se curvan hacia afuera)", fontsize=11, pad=4)

plt.suptitle("Geometría elíptica — Triángulo esférico con suma de ángulos $= 270°$",
             fontsize=13, fontweight="bold")
fig.tight_layout()
fig.savefig(OUT / "sphere.png", dpi=150, bbox_inches="tight")
print(f"✓ {OUT / 'sphere.png'}")
