# Architecture

## Entry point

```
main.js (on load)
  → loadCriticalImages() [AssetLoader]
  → new GameController(canvas)
```

`GameController` creates `ScreenManager`, binds DOM, shows main menu, attaches event listeners, then runs the game loop when the user starts a level.

## Module roles

| Module             | Responsibility                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **GameController** | Lifecycle (start, restart, pause), animation frame loop, game-over/win handling, delegates screens to ScreenManager |
| **ScreenManager**  | All UI screens (main menu, level start, pause, game over, mode select); creates DOM and holds `dom` refs            |
| **Game**           | Level state (player, enemies, friends, score, time); `update()` and `draw()` each frame                             |
| **Entities**       | Player (and states), enemies, friends, hearts — movement, collision, draw                                           |
| **Config**         | `levels.js`, `config.js`, `audio.js`, `constants.js` — data only                                                    |

## Start-level flow

1. User clicks **Start Level N** → `GameController.startGame(levelIndex)`.
2. `_startGame(levelConfig, isEndless)` hides screens, shows canvas, creates `new Game(…)`, then `animate(lastTime)`.
3. Each frame: `Game.update(deltaTime)`, `Game.draw(ctx)`; if game over, show game-over screen and stop loop.

```
[User] → Start button
          → GameController.startGame(index)
            → _startGame(LEVELS[index], false)
              → new Game(width, height, levelConfig, audioManager)
              → requestAnimationFrame(animate)
                → game.update(deltaTime)
                → game.draw(ctx)
```

## Data flow

- **GameController** owns `canvas`, `ctx`, `game`, `dom` (from ScreenManager), `audioManager`.
- **Game** owns `player`, `enemies`, `friends`, background, UI; reads `levelConfig` and `CONFIG`.
- **ScreenManager** owns screen elements and shows/hides them; callbacks use `controller` to start game or show menu.
