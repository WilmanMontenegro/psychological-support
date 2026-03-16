# Tu Psico Ana

Sitio web minimalista de marca personal y blog de bienestar emocional.

## Características

- **Cuenta de Usuario Simple**: Registro/inicio de sesión para comentar en el blog.
- **Blog**: Recursos y lecturas para el bienestar emocional con sistema de comentarios y likes.
- **Privacidad**: Página de cumplimiento legal y tratamiento de datos personales.
- **Diseño**: Interfaz limpia y adaptada a móviles.

> Nota: el agendamiento de citas y el acompañamiento clínico están temporalmente pausados.

## Tecnologías

- Next.js 15 + TypeScript
- Tailwind CSS v4
- Supabase (Auth + DB)

## Versionado
Este proyecto sigue el estándar [Semantic Versioning](https://semver.org/).
- **CHANGELOG.md**: Registro de cambios.
- **package.json**: Fuente de verdad de la versión actual.

## Desarrollo

Ver [CONTEXT.md](./CONTEXT.md) para guías de desarrollo, estructura y flujo de trabajo.

## Configuración para agentes IA

El proyecto incluye personalización para mejorar el trabajo con agentes:

- **Instrucciones base**: `.github/copilot-instructions.md`
- **Instrucción de frontend**: `.github/instructions/frontend-design.instructions.md`
- **Instrucción de versionado**: `.github/instructions/version-control.instructions.md`
- **Instrucción de memoria Engram**: `.github/instructions/engram-memory.instructions.md`
- **Instrucción de optimización de costo**: `.github/instructions/agent-cost-optimization.instructions.md`
- **Skill reutilizable**: `.github/skills/frontend-versioning/SKILL.md`
- **MCP de workspace**: `.vscode/mcp.json` (servidor `engram`)

Objetivo: mantener cambios pequeños, frontend minimalista, commits limpios, memoria persistente para agentes y validación mínima (`lint` + `build`).

## Comandos Rápidos

```bash
npm run dev   # Iniciar local
npm run lint  # Verificar código
npm run build # Construir producción
```