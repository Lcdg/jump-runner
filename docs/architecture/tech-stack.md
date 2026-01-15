# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Language** | TypeScript | 5.x | Static typing | Error detection, autocomplete, maintainability |
| **Runtime** | HTML5 Canvas API | Native | 2D rendering | Web standard, performant, full control |
| **Build Tool** | Vite | 5.x | Dev server + bundling | Instant HMR, minimal config, optimized build |
| **Unit Testing** | Vitest | 1.x | Unit tests | Native Vite integration, Jest-compatible API |
| **E2E Testing** | Playwright | 1.x | End-to-end tests | Cross-browser, modern API, screenshots |
| **Linting** | ESLint | 8.x | Code quality | TypeScript standard, strict rules |
| **Formatting** | Prettier | 3.x | Consistent formatting | ESLint integration, simple config |
| **Package Manager** | npm | 10.x | Dependency management | Standard, available everywhere |
| **CI/CD** | GitHub Actions | - | Automated deployment | Native GitHub Pages integration |
| **Hosting** | GitHub Pages | - | Static hosting | Free, HTTPS, simple deployment |

## Technologies NOT Used

| Category | Typical Choice | Why Not Used |
|----------|---------------|--------------|
| UI Framework | React/Vue/Angular | Canvas game, no DOM manipulation |
| State Management | Redux/Zustand | Simple game state, centralized object suffices |
| Routing | React Router | Single page, no navigation |
| CSS Framework | Tailwind/CSS Modules | Minimal CSS for overlays only |
| Component Library | shadcn/MUI | No UI components, everything in Canvas |
| API Client | Axios/fetch | No backend API |

## Game-Specific Technologies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Game Loop** | `requestAnimationFrame` | 60 FPS loop synchronized with screen |
| **Delta Time** | Custom implementation | Frame-independent movement |
| **Collision** | AABB (Axis-Aligned Bounding Box) | Simple and performant detection |
| **Input** | Native `KeyboardEvent` / `MouseEvent` | Maximum responsiveness |

---
