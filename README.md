# Cat Game – 2D Retro Platformer

A pixel-art 2D platformer built with **JavaScript** and **Canvas API**.
The game features smooth **sprite animations**, custom-designed levels,
and a retro aesthetic inspired by classic arcade games.

## 🎮 Play the Game

Try it out [here!](https://game-iota-six.vercel.app/)

## ✨ Features

- 🎨 **Hand-drawn pixel-art** assets with smooth **sprite animations**.
- 🏃 **Platformer mechanics** – jump, move, and avoid obstacles.
- 🕹️ **Keyboard controls** for smooth movement.

## Controls

![Start Screen](https://i.postimg.cc/NjxqjmCJ/screencapture-game-iota-six-vercel-app-2025-02-25-18-29-21.png)

🕹 Controls

- ⬇ Down Arrow – Crouch
- ⬆ Up Arrow – Jump
- ⬅ Left / ➡ Right Arrow – Move left / right
- Spacebar – Attack
- Esc – Pause

---

## 🐈 Game Mechanics

🏙 The Main Character
You play as a cat running through the city, avoiding obstacles and fighting enemies.

❤️ Power-ups & Items

- Potion (+10 points when caught without attack, -5 if attacked)
- Heart (+1 life when collected)

👾 Enemies

- Spider, Ghost, and Fireball
- With attack: Defeating an enemy adds +1 point
- Without attack: Getting hit removes 1 life

---

## Music & sound

- **Background music** – Loops from the moment you press Play on the main menu.
- **SFX** – Jump, attack, hit (enemy/spider), potion, heart, game over, win.

---

## Game modes

| Mode            | Description                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Training**    | 5 levels in sequence. Win by level goal (hearts or score); lose if time runs out or lives reach 0. After level 5 you can switch to endless modes. |
| **Time attack** | Survive for a set time (1, 2, 5, or 10 minutes). Win when time is up; lose if lives reach 0.                                                      |
| **Score**       | Set a target score. Win when you reach it; lose when lives reach 0.                                                                               |

Training is for new players (main menu → Play → Start Level). Time attack and Score are for returning players (Already played → Play for time / Play for points).

---

## Training levels

| Level | Title            | Goal                                                                                       |
| ----- | ---------------- | ------------------------------------------------------------------------------------------ |
| 1     | First steps      | Collect 5 hearts in 30 s (no lives yet).                                                   |
| 2     | The plant        | 5 lives. Defeat ghost (ground enemy), score 10 in 30 s. Hearts restore lives.              |
| 3     | Plant and spider | 5 lives. Ghost + spider. Score 12 in 30 s.                                                 |
| 4     | The potion       | 5 lives. Potion (+10 without attack, −5 if attacked), ghost + spider. Score 15 in 30 s.    |
| 5     | All together     | 5 lives. All enemies (ghost, spider, fire) and friends (potion, hearts). Score 20 in 30 s. |

---

## Tech stack

- **Frontend:** JavaScript (ES6+), Canvas API, HTML5, CSS3
- **Graphics & Animation:** Sprite Sheets & Animation
- **Deployment:** Vercel

---

## Run locally

Open `index.html` in a modern browser, or run a local server (ES modules):

```bash
npx serve .
```

---
