# Development

## Requirements

- Modern browser (ES modules support).
- No build step; run from the project root.

## Run

Open `index.html` in the browser, or:

```bash
npx serve .
```

## Code layout

| Folder / file      | Role                                                     |
| ------------------ | -------------------------------------------------------- |
| `src/js/main.js`   | Entry: load assets, create `GameController`              |
| `src/js/core/`     | `GameController`, `Game`, `ScreenManager`, `AssetLoader` |
| `src/js/config/`   | `config.js`, `levels.js`, `audio.js`, `constants.js`     |
| `src/js/entities/` | Player, enemies, friends, hearts, player states          |
| `src/js/effects/`  | Particles, collision animation, floating messages        |
| `src/js/input/`    | Keyboard input                                           |
| `src/js/ui/`       | HUD (score, time, lives)                                 |
| `src/js/world/`    | Background                                               |
| `src/js/audio/`    | `AudioManager`                                           |

## Where to change what

| Task                           | File(s)                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| New level, win rules, timers   | `config/levels.js`                                                  |
| Canvas size, speeds, limits    | `config/config.js`                                                  |
| Add / change sound             | `config/audio.js`, then use in code via `AudioManager.playSfx(id)`  |
| Menu / screens layout, buttons | `core/ScreenManager.js`                                             |
| Game loop, win/lose logic      | `core/Game.js`                                                      |
| Start / restart / pause flow   | `core/GameController.js`                                            |
| Player behaviour, states       | `entities/player.js`, `entities/playerStates.js`                    |
| Enemy / friend types           | `config/constants.js` (ENEMY_TYPES, FRIEND_TYPES), then `entities/` |

See [ARCHITECTURE.md](ARCHITECTURE.md) for flow and [CONFIGURATION.md](CONFIGURATION.md) for config details.
