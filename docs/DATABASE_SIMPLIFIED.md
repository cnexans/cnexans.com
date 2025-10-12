# ✅ Base de Datos Simplificada

## Cambio Realizado

Hemos consolidado **12 archivos SQL** en un **solo archivo limpio**: `schema.sql`

### Antes ❌
```
src/db/
├── 000_create-comments-public-schema.sql
├── 001_configure-rls-policies.sql
├── 005_create-comments-public-schema.sql
├── 006_create-post-likes-table.sql
├── 007_configure-post-likes-rls.sql
├── 008_fix-post-likes-security.sql
├── 009_update-post-likes-for-auth.sql
├── 010_create-contacts-table.sql
├── 011_disable-rls-all-tables.sql
└── ... más archivos de documentación
```

### Ahora ✅
```
src/db/
├── schema.sql          ← TODO EL ESQUEMA AQUÍ
├── README.md           ← Documentación
└── POST_LIKES_README.md (opcional)
```

## Archivo Único: `schema.sql`

Este archivo contiene **todo** lo necesario:

### 1️⃣ Tabla de Comentarios
```sql
CREATE TABLE public.comments (
  id, content_id, locale, name, message,
  twitter, email, created_at, updated_at,
  likes, is_visible
)
```

### 2️⃣ Tabla de Contactos
```sql
CREATE TABLE public.contacts (
  id, email, subject, message, locale,
  created_at, is_read, response_sent, notes
)
```

### 3️⃣ Tabla de Likes
```sql
CREATE TABLE public.post_likes (
  id, content_id, user_id, created_at
)
```

### 4️⃣ Funciones
- `increment_comment_likes()` - Incrementar likes en comentarios
- `get_post_like_count()` - Contar likes de un post
- `has_user_liked_post()` - Verificar si usuario dio like
- `toggle_post_like()` - Agregar/quitar like
- `get_user_liked_posts()` - Obtener posts que usuario ha likeado

### 5️⃣ Permisos
- Sin RLS (simplicidad)
- Permisos completos para `anon` y `authenticated`
- Todos los índices necesarios

## Cómo Usar

### Para Nueva Instalación

1. Copia el contenido de `schema.sql`
2. Ve a Supabase Dashboard → SQL Editor
3. Pega y ejecuta
4. ¡Listo! 🎉

### Para Actualizar

Si ya tienes las tablas:
- No necesitas hacer nada
- El esquema ya está aplicado desde las migraciones anteriores
- Este archivo es para nuevas instalaciones

## Ventajas

### ✅ Simplicidad
- Un solo archivo para mantener
- Fácil de entender
- Sin orden de ejecución

### ✅ Portabilidad
- Copia y pega en cualquier proyecto
- Fácil de compartir
- Rápido de aplicar

### ✅ Claridad
- Todo el esquema visible de un vistazo
- No más buscar entre 12 archivos
- Documentación inline

### ✅ Menos Errores
- No hay dependencias entre migraciones
- No hay orden de ejecución incorrecto
- Idempotente (se puede ejecutar múltiples veces)

## Estructura del Archivo

```sql
-- 1. COMMENTS TABLE
CREATE TABLE...
CREATE INDEX...

-- 2. CONTACTS TABLE
CREATE TABLE...
CREATE INDEX...

-- 3. POST LIKES TABLE
CREATE TABLE...
CREATE INDEX...

-- 4. FUNCTIONS
CREATE FUNCTION increment_comment_likes...
CREATE FUNCTION get_post_like_count...
CREATE FUNCTION toggle_post_like...
CREATE FUNCTION get_user_liked_posts...

-- 5. PERMISSIONS
ALTER TABLE ... DISABLE ROW LEVEL SECURITY
GRANT SELECT, INSERT, UPDATE, DELETE...
```

## Archivos Eliminados

Los siguientes archivos fueron **eliminados** porque están consolidados en `schema.sql`:

- ❌ `000_create-comments-public-schema.sql`
- ❌ `001_configure-rls-policies.sql`
- ❌ `005_create-comments-public-schema.sql`
- ❌ `006_create-post-likes-table.sql`
- ❌ `007_configure-post-likes-rls.sql`
- ❌ `008_fix-post-likes-security.sql`
- ❌ `009_update-post-likes-for-auth.sql`
- ❌ `010_create-contacts-table.sql`
- ❌ `011_disable-rls-all-tables.sql`

## Para Desarrollo Local

Si usas Supabase local:

```bash
# Opción 1: psql
psql -h localhost -U postgres -d postgres -f src/db/schema.sql

# Opción 2: supabase CLI
supabase db reset --db-url "postgresql://postgres:postgres@localhost:54322/postgres"
cat src/db/schema.sql | supabase db --db-url "postgresql://postgres:postgres@localhost:54322/postgres" execute
```

## Para Producción

1. Backup primero (siempre):
```sql
pg_dump > backup.sql
```

2. Ejecuta en Supabase Dashboard
3. Verifica que todo funcione
4. ¡Listo!

## Verificar Instalación

```sql
-- Ver todas las tablas
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Debe mostrar:
-- comments
-- contacts  
-- post_likes

-- Verificar funciones
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Debe mostrar:
-- get_post_like_count
-- get_user_liked_posts
-- has_user_liked_post
-- increment_comment_likes
-- toggle_post_like
```

## Filosofía

> "Simplicidad es la máxima sofisticación" - Leonardo da Vinci

En lugar de mantener múltiples archivos de migración que se ejecutan en secuencia, preferimos:
- Un solo archivo autorativo
- Fácil de leer
- Fácil de modificar
- Fácil de aplicar

## Documentación Relacionada

- `schema.sql` - El esquema completo
- `README.md` - Cómo usar el esquema
- `NO_RLS_POLICY.md` - Por qué no usamos RLS
- `ENABLE_ANONYMOUS_AUTH.md` - Configuración de auth anónimo

---

**Todo consolidado en un solo archivo limpio.** 🎉
