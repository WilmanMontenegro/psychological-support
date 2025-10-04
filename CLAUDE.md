# Proyecto de Apoyo Psicológico

Una aplicación web de Next.js para servicios de apoyo psicológico y terapia.

## Filosofía del Proyecto

**SIMPLICIDAD Y MINIMALISMO**
- Todo debe ser fácil de hacer y entender
- Sin complicaciones innecesarias
- Código limpio y directo
- Diseño minimalista y funcional

## Stack Tecnológico

- **Framework**: Next.js 15.5.3 con App Router
- **React**: 19.1.0
- **TypeScript**: Configuración estricta
- **Estilos**: Tailwind CSS v4
- **Iconos**: react-icons v5.5.0 (NO usar @heroicons)

## Comandos Importantes

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Iniciar en producción
npm run start
```

## Convenciones de Código

### Componentes
- Usar TypeScript para todos los componentes
- Componentes en PascalCase: `FAQ.tsx`, `AboutMe.tsx`
- Usar 'use client' cuando se necesite interactividad del lado del cliente
- Preferir functional components con hooks

### Iconos
- **USAR**: `react-icons` solamente
- **NO USAR**: @heroicons, lucide-react para iconos nuevos
- Importar desde familias específicas: `import { FaChevronDown } from 'react-icons/fa'`

### Estilos
- **USAR**: Tailwind CSS v4 exclusivamente con sus clases
- **NO USAR**: Estilos en línea con `style={{}}` (solo para casos específicos con `var()`)
- Responsive design: mobile-first
- Colores consistentes con la paleta del proyecto

### Paleta de Colores (ver globals.css)
```
--color-primary: #F2A2B1 (Rosa principal - para decoraciones)
--color-secondary: #BF88AC (Morado - para botones, líneas, iconos)
--color-tertiary: #9B9DBF (Morado/azul claro - para decoraciones)
--color-accent: #4982A6 (Azul - para títulos)
--color-pastel: #F2DCDC (Rosa pastel - para fondos y decoraciones)
--color-pastel-light: #FAF0F0 (Rosa muy claro - para fondos de secciones)
--color-tertiary-light: #E8E9F5 (Lavanda claro - para fondos de secciones)
```

### Uso de Colores
- **Fondos de secciones**: Usar colores claros (`bg-pastel-light`, `bg-tertiary-light`) alternando para crear contraste visual
- **Títulos principales**: `text-accent` con `font-libre-baskerville`
- **Iconos interactivos**: `style={{color: 'var(--color-secondary)'}}` (único caso aceptado de style inline)
- **Botones CTA**: `backgroundColor: 'var(--color-secondary)'` (único caso aceptado de style inline)
- **Elementos decorativos (bolitas)**: `bg-primary`, `bg-pastel`, `bg-secondary`, `bg-tertiary` con opacidades bajas (15-25%)
- **Líneas decorativas**: `bg-secondary`
- **Principio**: Los colores intensos para acentos, los colores claros para fondos

### Títulos y Decoración
- **TODOS los títulos deben tener línea decorativa**
- Formato: `<div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>`
- Posición: Inmediatamente después del título, antes del contenido/párrafo
- Consistencia: Usar en todas las secciones principales

### Estructura de Archivos
```
src/
├── app/              # App Router de Next.js
├── components/       # Componentes reutilizables
└── ...
```

## Funcionalidades del Proyecto

- **Carousel**: Carrusel de imágenes con navegación
- **AboutMe**: Sección sobre el profesional (parametrizable: showButton, bgColor)
- **WhyChooseMe**: Sección "¿Por Qué Elegirme?" con 3 características
- **TherapyServices**: Servicios terapéuticos con tarjetas
- **PhotoGallery**: Galería de fotos con lightbox y navegación
- **FAQ**: Preguntas frecuentes colapsables
- **Footer**: Enlaces sociales y información de contacto
- **Header/Navigation**: Navegación principal

## Principios de Diseño

1. **Minimalismo**: Menos es más - reducir elementos decorativos al mínimo necesario
2. **Espaciado**: Dar espacio para que el contenido respire
3. **Consistencia de colores**: Alternar fondos claros entre secciones para crear ritmo visual
4. **Jerarquía visual**: Títulos prominentes con líneas decorativas
5. **Bolitas decorativas**: Máximo 6-8 por sección, con opacidades bajas (15-25%)

## Idioma

- **Contenido visible completamente en español**
- Todos los textos, títulos y contenido que ve el usuario deben estar en español
- Código (nombres de variables, clases, funciones, archivos) en inglés
- URLs y rutas en español para mejor SEO (ej: `/sobre-mi`, `/servicios`)

## Mejores Prácticas

1. **Accesibilidad**: Incluir aria-labels en botones interactivos
2. **Performance**: Usar Next.js Image component para imágenes
3. **SEO**: Incluir alt text descriptivo
4. **Responsive**: Probar en móvil, tablet y desktop
5. **TypeScript**: Definir interfaces para props complejas
6. **Idioma**: Todo el contenido en español

## Verificación

Antes de finalizar cualquier cambio:
1. Ejecutar `npm run lint` para verificar código
2. Ejecutar `npm run build` para verificar compilación
3. Probar responsive design
4. Verificar accesibilidad básica