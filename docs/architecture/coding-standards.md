# Coding Standards

## Critical Rules

- **Type everything**: No `any`, explicit return types
- **Constants centralized**: All gameplay values in `constants.ts`
- **Systems stateless**: Systems operate on entities, no internal state
- **Frame-independent**: All movement uses deltaTime
- **Object pooling**: Reuse obstacles to avoid GC spikes

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Entity class | PascalCase, singular | `Player`, `Obstacle` |
| System class | PascalCase + "System" | `CollisionSystem` |
| Sprite function | camelCase + "draw" | `drawPlayer()` |
| Constants | SCREAMING_SNAKE_CASE | `PHYSICS.GRAVITY` |
| Types/Interfaces | PascalCase | `Position`, `Hitbox` |

---
