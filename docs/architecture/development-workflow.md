# Development Workflow

## Local Setup

```bash
# Clone and install
git clone https://github.com/Lcdg/jump-runner.git
cd jump-runner
npm install

# Start development
npm run dev

# Run tests
npm run test        # Watch mode
npm run test:e2e    # E2E tests
```

## NPM Scripts

| Script | Usage | Description |
|--------|-------|-------------|
| `dev` | Daily | Dev server with HMR |
| `build` | Deploy | Production build |
| `lint` | Before commit | Check code |
| `test` | Development | Tests in watch mode |
| `test:run` | CI | Tests once |
| `test:e2e` | CI | Playwright tests |
| `ci` | Pipeline | Lint + types + tests + build |

## CI/CD Pipeline

```
PUSH TO MAIN
     │
     ▼
┌────┼────┬────────────┐
│    │    │            │
▼    ▼    ▼            │
LINT  UNIT  E2E        │
     TESTS TESTS       │
│    │    │            │
└────┼────┘            │
     ▼ (all pass)      │
   BUILD               │
     │                 │
     ▼                 │
  DEPLOY ──────────────┘
GitHub Pages

→ https://lcdg.github.io/jump-runner
```

---
