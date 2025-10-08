# Fuentes del Proyecto

Este directorio contiene las fuentes personalizadas utilizadas en el sitio web.

## Fuentes Disponibles

### 1. Book Antiqua
- **Variantes**: Regular, Bold
- **Formato**: TrueType (.ttf)
- **Uso en Tailwind**: `font-book-antiqua`

**Ejemplo**:
```html
<p className="font-book-antiqua">Texto con Book Antiqua</p>
<p className="font-book-antiqua font-bold">Texto en negrita</p>
```

### 2. Palatino Linotype
- **Variantes**: Roman, Italic, Bold, Bold Italic
- **Formato**: TrueType (.ttf)
- **Uso en Tailwind**: `font-palatino`

**Ejemplo**:
```html
<p className="font-palatino">Texto con Palatino Linotype</p>
<p className="font-palatino italic">Texto en cursiva</p>
<p className="font-palatino font-bold">Texto en negrita</p>
<p className="font-palatino font-bold italic">Texto en negrita cursiva</p>
```

### 3. TeX Gyre Pagella
- **Variantes**: Regular, Italic, Bold, Bold Italic
- **Formato**: OpenType (.otf)
- **Uso en Tailwind**: `font-pagella`

**Ejemplo**:
```html
<p className="font-pagella">Texto con TeX Gyre Pagella</p>
<p className="font-pagella italic">Texto en cursiva</p>
<p className="font-pagella font-bold">Texto en negrita</p>
<p className="font-pagella font-bold italic">Texto en negrita cursiva</p>
```

## Configuración

Las fuentes están configuradas en:
- **CSS**: `src/app/globals.css` (declaraciones @font-face)
- **Tailwind**: `tailwind.config.ts` (clases de utilidad)

## Uso en CSS

También puedes usar las fuentes directamente en CSS:

```css
.mi-clase {
  font-family: 'Book Antiqua', serif;
}

.otra-clase {
  font-family: 'Palatino Linotype', serif;
}

.clase-adicional {
  font-family: 'TeX Gyre Pagella', serif;
}
```


