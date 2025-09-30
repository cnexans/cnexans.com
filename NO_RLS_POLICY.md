# Política de No RLS (Row Level Security)

## Decisión de Diseño

Este proyecto **NO usa RLS (Row Level Security)** en ninguna tabla. Esta es una decisión consciente para simplificar la arquitectura.

## ¿Por qué no RLS?

1. **Simplicidad**: RLS agrega complejidad innecesaria para este caso de uso
2. **Control en la aplicación**: El control de acceso se maneja en el código de la aplicación
3. **Moderación manual**: Los comentarios y contactos se moderan manualmente
4. **Menos debugging**: Sin RLS, es más fácil debuggear problemas de permisos

## Tablas Afectadas

Todas las tablas públicas tienen RLS **DESHABILITADO**:

- ✅ `public.comments` - RLS disabled
- ✅ `public.contacts` - RLS disabled  
- ✅ `public.post_likes` - RLS disabled (cuando se cree)

## Permisos Otorgados

Todas las tablas tienen permisos completos para `anon` y `authenticated`:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{table} TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.{table} TO authenticated;
```

## Control de Acceso

El control de acceso se implementa mediante:

### 1. Comentarios
- `is_visible = false` por defecto
- Solo comentarios aprobados se muestran públicamente
- Moderación manual en Supabase Dashboard

### 2. Contactos
- Todos los contactos se guardan
- Solo admin puede verlos en Supabase Dashboard
- No hay UI pública para leer contactos

### 3. Likes
- Cualquiera puede dar like (requiere auth anónimo)
- User ID de Supabase previene duplicados
- Constraint UNIQUE(content_id, user_id)

## Seguridad

### Protecciones Implementadas:
- ✅ Validación de inputs en el cliente
- ✅ Supabase API valida tipos de datos
- ✅ Foreign keys garantizan integridad referencial
- ✅ Constraints UNIQUE previenen duplicados

### Protecciones Recomendadas (TODO):
- ⚠️ Rate limiting (prevenir spam)
- ⚠️ CAPTCHA en formularios públicos
- ⚠️ IP blocking para abusadores

## Migraciones Relevantes

- `001_configure-rls-policies.sql` - Desactiva RLS en comments
- `005_create-comments-public-schema.sql` - Crea comments sin RLS
- `007_configure-post-likes-rls.sql` - Renamed, no configura RLS
- `010_create-contacts-table.sql` - Crea contacts sin RLS
- `011_disable-rls-all-tables.sql` - Desactiva RLS en todas las tablas

## Si Necesitas Cambiar Esto

Si en el futuro decides activar RLS:

```sql
-- 1. Activar RLS en la tabla
ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;

-- 2. Crear políticas específicas
CREATE POLICY "nombre_politica"
ON public.{table}
FOR {SELECT|INSERT|UPDATE|DELETE}
TO {anon|authenticated|public}
USING (condition);

-- 3. Revocar permisos directos
REVOKE ALL ON public.{table} FROM anon;
REVOKE ALL ON public.{table} FROM authenticated;
```

## Verificar Estado de RLS

```sql
-- Ver todas las tablas y su estado de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Ver políticas existentes
SELECT * FROM pg_policies
WHERE schemaname = 'public';
```

## Conclusión

**No usar RLS es una decisión válida** para proyectos donde:
- El control de acceso es simple
- La moderación es manual
- La simplicidad es preferida sobre granularidad de permisos
- El equipo es pequeño y confía en el código de la aplicación

Esta arquitectura es más fácil de entender, mantener y debuggear.

---

**Última actualización**: 2025-09-30  
**Estado actual**: RLS deshabilitado en todas las tablas ✅
