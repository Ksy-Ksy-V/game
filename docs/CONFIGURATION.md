# Configuration

All tunable values live in `src/js/config/`. Paths are relative to the project root (where `index.html` is).

---

## config.js

**CONFIG** – canvas size, game balance, player physics.

| Section           | Keys                                                                                                                                                                                                       | Use                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `canvas`          | `width`, `height`                                                                                                                                                                                          | Canvas dimensions                             |
| `game`            | `groundMargin`, `maxSpeed`, `maxParticles`, `enemyInterval`, `friendInterval`, `heartsFriendInterval`, `winningScore`, `maxTime`, `initialHearts`, `maxEnemiesOnScreen`, `maxFriendsOnScreen`, `maxHearts` | Defaults; overridden per level in `levels.js` |
| `player`          | `width`, `height`, `maxSpeed`, `weight`, `fps`                                                                                                                                                             | Sprite and movement                           |
| `background`      | `width`, `height`                                                                                                                                                                                          | Parallax layer size                           |
| `floatingMessage` | `targetX`, `targetY`                                                                                                                                                                                       | Score float target                            |

---

## levels.js

**LEVELS** – array of level configs. Each level can override game defaults.

| Field                                                     | Type           | Meaning                                                          |
| --------------------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `index`                                                   | number         | Level index (0-based)                                            |
| `name`, `title`, `rules`                                  | string         | UI text                                                          |
| `initialHearts`                                           | number \| null | Starting lives                                                   |
| `heartsToCollectToWin`                                    | number \| null | Win condition (e.g. level 1: collect 5 hearts)                   |
| `maxTime`                                                 | number \| null | Time limit (ms)                                                  |
| `winningScore`                                            | number \| null | Score to win (when not hearts-based)                             |
| `speedModifier`                                           | number         | Multiplier for scroll speed                                      |
| `enemies`                                                 | string[]       | Use `ENEMY_TYPES.FLYING`, `CLIMBING`, `GROUND`                   |
| `friends`                                                 | string[]       | Use `FRIEND_TYPES.FLYING`, `HEARTS`                              |
| `enemyInterval`, `friendInterval`, `heartsFriendInterval` | number         | Spawn intervals (ms)                                             |
| `hint`                                                    | string \| null | In-game hint text                                                |
| `mode`                                                    | string \| null | Set by code for endless: `MODES.TIME_ATTACK`, `MODES.UNTIL_LOSE` |

**getEndlessConfig()** – returns a level-like config for endless modes (same content as last level, `mode` and limits set when starting).

---

## constants.js

Use these instead of string literals:

- **MODES** – `TIME_ATTACK`, `UNTIL_LOSE` (endless modes).
- **ENEMY_TYPES** – `FLYING`, `CLIMBING`, `GROUND`.
- **FRIEND_TYPES** – `FLYING`, `HEARTS`.

Referenced in `levels.js`, `Game.js`, `GameController.js`, `UI.js`.

---

## audio.js

**AUDIO** – paths to audio files.

- **music** – `background` → `audio/background-music.mp3`.
- **sfx** – keys: `enemyHit`, `spiderHit`, `playerHit`, `jump`, `potion`, `potionHit`, `heart`, `gameOver`, `win`. Values are paths under project root.

Play via `audioManager.playSfx(id)` or `audioManager.playMusic(id)`.
