# AR.js Ionic Angular Dynamic AR App

## Descripción
Aplicación de Realidad Aumentada (AR.js + A-Frame) con Ionic/Angular. Un único componente AR renderiza dinámicamente distintos targets (pattern o NFT) y muestra imagen (preview) o modelo GLTF/GLB. Incluye autenticación Firebase y almacenamiento de assets en Supabase.

## Características
- Login / Registro con Firebase Auth.
- Subida de archivos a Supabase Storage (pattern .patt, imagen preview, modelo .glb/.gltf).
- Tabla `targets` en Supabase con campos dinámicos:
  - `name`, `description`
  - `marker_type` (`pattern` | `nft`)
  - `marker_url` (URL .patt o base NFT)
  - `preview_url` (PNG/JPG opcional)
  - `model_url` (GLTF/GLB opcional)
  - `model_scale`, `model_rotation`
  - `user_id`
- Componente AR único (`/ar`) que carga por `id` (deep link /ar?id=123).
- Render dinámico: imagen plana sobre marker, o modelo 3D si existe.
- Filtro por usuario en Home (opcional) y listado de targets.
- AuthGuard protegiendo rutas (`home`, `upload`, `ar`).

## Migraciones SQL sugeridas
```sql
alter table public.targets add column if not exists marker_type text default 'pattern';
alter table public.targets add column if not exists marker_url text;
alter table public.targets add column if not exists preview_url text;
alter table public.targets add column if not exists model_url text;
alter table public.targets add column if not exists model_scale text default '1.5 1.5 1.5';
alter table public.targets add column if not exists model_rotation text default '0 0 0';
alter table public.targets add column if not exists user_id text;
```

### Políticas RLS (ejemplo open read, restringir insert/update por usuario)
```sql
alter table public.targets enable row level security;

create policy "targets_select_all" on public.targets for select using (true);
create policy "targets_insert_owner" on public.targets for insert with check (auth.uid() = user_id);
create policy "targets_update_owner" on public.targets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Storage bucket `ar-assets`:
```sql
create policy "storage_select_ar_assets" on storage.objects for select using (bucket_id = 'ar-assets');
create policy "storage_insert_ar_assets" on storage.objects for insert with check (bucket_id = 'ar-assets');
```

## Flujo de Subida
1. Generar .patt desde: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Subir preview (PNG/JPG) y .patt a bucket `ar-assets`.
3. (Opcional) Subir modelo 3D `.glb`.
4. Insertar registro con `marker_type='pattern'`, `marker_url` apuntando al .patt público, y `preview_url` / `model_url` según corresponda.

Para NFT (image tracking): subir conjunto (`.fset`, `.fset3`, `.iset`, `.mind`) y usar `marker_type='nft'` y `marker_url` con base path sin extensión.

## Ejecución local
```bash
npm install
npm start
```
App visible en `http://localhost:8100`.

## Estructura clave
```
src/app/pages/ar/        # Componente AR único
src/app/pages/home/      # Home (listado targets)
src/app/upload/          # Subida de assets
src/app/services/        # Servicios Firebase, Supabase, AuthGuard
```

## Próximos pasos (opcionales)
- Animaciones en modelos (atributo animation).
- Ajuste automático de scale según dimensiones del modelo.
- Soporte NFT completo (UI para subir 4 archivos).

## Entregables del Taller
- Repositorio (este proyecto)
- Video demostrando: login, subida target, render dinámico en /ar con patrón Hiro y otro custom.

## Puntos Extra Sugeridos
- Filtro en Home (Mis Targets / Todos).
- Vista de detalle con edición de escala/rotación.
- Log de detecciones (markerFound) almacenado por usuario.

---
Cualquier duda: revisar `ar.page.ts` para cómo se construye la escena dinámica.
