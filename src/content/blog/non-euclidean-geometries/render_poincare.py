#!/usr/bin/env python3
"""
Disco de Poincaré: paralelas y triángulo hiperbólico.
Salida: public/non-euclidean-geometries/poincare.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).parents[4] / "public" / "non-euclidean-geometries"
OUT.mkdir(parents=True, exist_ok=True)

# ── helpers ───────────────────────────────────────────────────────────────────

def _circumcircle(p1, p2, p3):
    ax, ay = p1;  bx, by = p2;  cx, cy = p3
    D = 2*(ax*(by-cy) + bx*(cy-ay) + cx*(ay-by))
    if abs(D) < 1e-12:
        return None, None
    ux = ((ax**2+ay**2)*(by-cy) + (bx**2+by**2)*(cy-ay) + (cx**2+cy**2)*(ay-by)) / D
    uy = ((ax**2+ay**2)*(cx-bx) + (bx**2+by**2)*(ax-cx) + (cx**2+cy**2)*(bx-ax)) / D
    return np.array([ux, uy]), np.hypot(ax-ux, ay-uy)


def geodesic_pts(p1, p2, n=400):
    """Puntos a lo largo de la geodeésica hiperbólica de p1 a p2."""
    p1, p2 = np.asarray(p1, float), np.asarray(p2, float)

    # Si son colineales con el origen: diámetro
    if abs(p1[0]*p2[1] - p1[1]*p2[0]) < 1e-9:
        d = p2 - p1;  d /= np.linalg.norm(d)
        px, py = p1;  dx, dy = d
        b = px*dx + py*dy
        disc = max(0.0, b**2 - (px**2+py**2-1))
        t1, t2 = -b - np.sqrt(disc), -b + np.sqrt(disc)
        s, e = p1 + t1*d, p1 + t2*d
        return np.linspace(s[0], e[0], n), np.linspace(s[1], e[1], n)

    # Circunferencia ortogonal a la unitaria
    r2 = np.dot(p1, p1)
    C, R = _circumcircle(p1, p2, p1/r2)
    if C is None:
        return None, None
    ux, uy = C

    # Puntos ideales (intersección con el círculo unitario)
    dc = np.linalg.norm(C)
    foot = C / dc**2
    perp = np.array([-uy, ux]) / dc
    t = np.sqrt(max(0.0, 1 - 1/dc**2))
    e1, e2 = foot + t*perp, foot - t*perp

    a_e1 = np.arctan2(e1[1]-uy, e1[0]-ux)
    a_e2 = np.arctan2(e2[1]-uy, e2[0]-ux)
    a_o  = np.arctan2(-uy, -ux)   # dirección al origen

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


def ideal_endpoints(p1, p2):
    """Puntos ideales (en el borde unitario) de la geodésica por p1 y p2."""
    p1, p2 = np.asarray(p1, float), np.asarray(p2, float)
    cross = p1[0]*p2[1] - p1[1]*p2[0]
    if abs(cross) < 1e-9:  # diámetro
        d = p2 - p1; d /= np.linalg.norm(d)
        return -d, d
    r2 = np.dot(p1, p1)
    C, R = _circumcircle(p1, p2, p1/r2)
    if C is None:
        return None, None
    ux, uy = C
    dc = np.linalg.norm(C)
    foot = C / dc**2
    perp = np.array([-uy, ux]) / dc
    t = np.sqrt(max(0.0, 1 - 1/dc**2))
    return foot + t*perp, foot - t*perp


def geodesics_cross(a1, a2, b1, b2):
    """¿Se entrecruzan los pares de puntos ideales (a1,a2) y (b1,b2) en el borde?
    Dos geodésicas se cortan dentro del disco ↔ sus puntos ideales se entrelazan."""
    def angle(p): return np.arctan2(p[1], p[0])
    def in_ccw(θ, start, end):
        θ = (θ - start) % (2*np.pi)
        return 0 < θ < (end - start) % (2*np.pi)
    s = angle(a1)
    e = angle(a2)
    return in_ccw(angle(b1), s, e) != in_ccw(angle(b2), s, e)


def disk_bg(ax):
    θ = np.linspace(0, 2*np.pi, 400)
    ax.fill(np.cos(θ), np.sin(θ), color="#f7f7f9", zorder=0)
    ax.plot(np.cos(θ), np.sin(θ), color="#222", lw=2, zorder=10)
    ax.set_xlim(-1.22, 1.22); ax.set_ylim(-1.60, 1.22)
    ax.set_aspect("equal"); ax.axis("off")


# ── figura ────────────────────────────────────────────────────────────────────

BLUE   = "#3a86ff"
RED    = "#e63946"
TEAL   = "#2ec4b6"
ORANGE = "#f4a261"

# ── Imagen 1: paralelas ───────────────────────────────────────────────────────
fig1, ax1 = plt.subplots(figsize=(6, 6.5), facecolor="white")
disk_bg(ax1)

r1 = np.array([-0.75,  0.20])
r2 = np.array([ 0.55, -0.72])
draw_geo(ax1, r1, r2, color=BLUE, lw=2.8, zorder=4)

P = np.array([-0.10, 0.58])
ax1.plot(*P, "o", color=ORANGE, ms=9, zorder=8)
ax1.text(P[0]-0.07, P[1]+0.08, "$P$", fontsize=14, color=ORANGE, fontweight="bold")

ULTRA  = "#2ec4b6"   # ultraparalelas
HORO   = "#9b5de5"   # horoparalelas (límite)

# Puntos ideales de r
omega1, omega2 = ideal_endpoints(r1, r2)

# Horoparalelas: geodésicas de P exactamente a ω1 y ω2
draw_geo(ax1, P, omega1 * 0.999, color=HORO, lw=2.4, zorder=5)
draw_geo(ax1, P, omega2 * 0.999, color=HORO, lw=2.4, zorder=5)
ax1.plot(*omega1, "D", color=HORO, ms=7, zorder=12)
ax1.plot(*omega2, "D", color=HORO, ms=7, zorder=12)
ax1.text(omega1[0]+0.03, omega1[1]+0.06, "$\\omega_1$", fontsize=10, color=HORO)
ax1.text(omega2[0]-0.16, omega2[1]+0.06, "$\\omega_2$", fontsize=10, color=HORO)

# Ultraparalelas: geodésicas de P a q tales que (P→q) NO corta r
# Criterio exacto: los puntos ideales de (P→q) y de r no se entrelazan en el borde
N = 500
thetas_ultra = []
for theta in np.linspace(0, 2*np.pi, N, endpoint=False):
    q_borde = np.array([np.cos(theta), np.sin(theta)])
    # excluir vecindad inmediata de ω1 y ω2 (esas son las horoparalelas)
    if np.linalg.norm(q_borde - omega1) < 0.06 or np.linalg.norm(q_borde - omega2) < 0.06:
        continue
    q_inner = q_borde * 0.998
    α, β = ideal_endpoints(P, q_inner)
    if α is None:
        continue
    # Si los puntos ideales no se entrelazan → geodésicas paralelas
    if not geodesics_cross(omega1, omega2, α, β):
        thetas_ultra.append(theta)

# Fondo: muchas ultraparalelas tenues
for theta in thetas_ultra[::5]:
    q = np.array([np.cos(theta), np.sin(theta)]) * 0.998
    draw_geo(ax1, P, q, color=ULTRA, lw=0.7, alpha=0.20, zorder=3)

# 6 ultraparalelas destacadas
for i in np.linspace(0, len(thetas_ultra)-1, 6, dtype=int):
    q = np.array([np.cos(thetas_ultra[i]), np.sin(thetas_ultra[i])]) * 0.998
    draw_geo(ax1, P, q, color=ULTRA, lw=2.2, alpha=0.9, zorder=4)

# Etiqueta de r y leyenda
ax1.text(-0.20, -0.52, "$r$", fontsize=15, color=BLUE, fontweight="bold")

import matplotlib.patches as mpatches
legend = [
    mpatches.Patch(color=HORO,  label="Horoparalelas (pasan por $\\omega_1$ o $\\omega_2$)"),
    mpatches.Patch(color=ULTRA, label="Ultraparalelas (no alcanzan $\\omega_1$ ni $\\omega_2$)"),
]
ax1.legend(handles=legend, loc="lower center", fontsize=9,
           framealpha=0.95, edgecolor="#ccc", bbox_to_anchor=(0.5, -0.01))
ax1.set_title("Geometría hiperbólica — Paralelas por un punto",
              fontsize=12, fontweight="bold", pad=8)

fig1.savefig(OUT / "poincare_paralelas.png", dpi=150, bbox_inches="tight")
plt.close(fig1)
print(f"✓ {OUT / 'poincare_paralelas.png'}")

# ── Imagen 2: triángulo hiperbólico ───────────────────────────────────────────
fig2, ax2 = plt.subplots(figsize=(6, 6.5), facecolor="white")
disk_bg(ax2)

A = np.array([ 0.00,  0.72])
B = np.array([-0.63, -0.44])
C = np.array([ 0.63, -0.44])

draw_geo(ax2, A, B, color=RED, lw=2.5, zorder=4)
draw_geo(ax2, B, C, color=RED, lw=2.5, zorder=4)
draw_geo(ax2, C, A, color=RED, lw=2.5, zorder=4)

for pt, lbl, off in [(A, "$A$", (-0.10,  0.07)),
                      (B, "$B$", (-0.17,  0.04)),
                      (C, "$C$", ( 0.08,  0.04))]:
    ax2.plot(*pt, "o", color=RED, ms=8, zorder=8)
    ax2.text(pt[0]+off[0], pt[1]+off[1], lbl, fontsize=13, color=RED, fontweight="bold")

ax2.text(0, -1.28, r"$\alpha+\beta+\gamma < 180°$",
         fontsize=12, ha="center", va="top", color="#333",
         bbox=dict(boxstyle="round,pad=0.35", facecolor="white", edgecolor="#ccc", alpha=0.95))
ax2.text(0, -1.50, "Los lados son arcos ortogonales al borde del disco",
         fontsize=11, ha="center", va="top", color="#555")
ax2.set_title("Geometría hiperbólica — Triángulo hiperbólico",
              fontsize=12, fontweight="bold", pad=8)

fig2.savefig(OUT / "poincare_triangulo.png", dpi=150, bbox_inches="tight")
plt.close(fig2)
print(f"✓ {OUT / 'poincare_triangulo.png'}")
