# Configuración de Supabase

## Pasos para configurar la base de datos

1. **Ve a tu proyecto de Supabase**: https://wovfqdlfiaijsijqfbfj.supabase.co

2. **Abre el SQL Editor**:
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Haz clic en "New query"

3. **Copia y pega el contenido del archivo `supabase-schema.sql`**

4. **Ejecuta el script**:
   - Haz clic en "Run" o presiona `Cmd/Ctrl + Enter`

5. **Verifica que se crearon las tablas**:
   - Ve a "Table Editor" en el panel izquierdo
   - Deberías ver las tablas `students` y `exercises`

## Estructura de las tablas

### Tabla `students`
- `id`: UUID (Primary Key, auto-generado)
- `name`: TEXT (Nombre del crossfitero)
- `created_at`: TIMESTAMP (Fecha de creación)

### Tabla `exercises`
- `id`: UUID (Primary Key, auto-generado)
- `student_id`: UUID (Foreign Key a students)
- `name`: TEXT (Nombre del ejercicio)
- `rm`: NUMERIC (Peso máximo)
- `unit`: TEXT (kg o lb)
- `date`: DATE (Fecha del registro)
- `created_at`: TIMESTAMP (Fecha de creación)

## ¡Listo!

Una vez ejecutado el script SQL, tu aplicación estará conectada a Supabase y toda la data se guardará en la nube automáticamente.

## Nota de Seguridad

⚠️ Las políticas de RLS están configuradas para acceso público (sin autenticación). Esto es solo para desarrollo. En producción, deberías:
- Implementar autenticación de usuarios
- Crear políticas de RLS más restrictivas
- Usar variables de entorno para las credenciales

