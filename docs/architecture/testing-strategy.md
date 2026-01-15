# Testing Strategy

## Testing Pyramid

| Level | Framework | Target | Estimated Count |
|-------|-----------|--------|-----------------|
| **Unit** | Vitest | Pure functions, calculations | ~30 tests |
| **Integration** | Vitest | System interactions | ~10 tests |
| **E2E** | Playwright | Complete user journeys | 5 tests |

## Test Coverage Goals

| Category | Target | Rationale |
|----------|--------|-----------|
| **Overall** | 70% | Reasonable for a game with visual components |
| **Systems** | 90% | Pure logic, easy to test |
| **Entities** | 80% | Some rendering mixed in |
| **Core** | 70% | State machine has side effects |
| **Rendering** | Excluded | Visual, tested via E2E screenshots |

## E2E Test Scenarios

1. **Attract Mode → Start**: Verify "Press Space" starts the game
2. **Complete game cycle**: Start → Play → Collision → Game Over → Restart
3. **Scoring**: Verify score increases during gameplay
4. **Variable jump**: Short press vs long press produces different heights
5. **Game Over**: Verify player disappears and background continues

---
