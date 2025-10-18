# 🎮 Angular 2048 Game
- Link: https://play-game-2048.netlify.app/


A fully functional implementation of the popular 2048 game built with **Angular 20.0.1**, featuring modern Angular features including Signals, Standalone Components, and functional programming principles.

## Features

- **Configurable Board Size** (3x3 to 8x8)
- **Score Tracking** with Best Score persistence
- **Keyboard Controls** (Arrow Keys)
- **Touch/Swipe Support** for mobile devices
- **GUI Button Controls** for accessibility
- **Win Detection** (2048 tile reached)
- **Game Over Detection** (no moves available)
- **Responsive Design** (Desktop, Tablet, Mobile)
- **Smooth Animations** and visual feedback
- **Continue After Winning** feature
- **Local Storage** for best score persistence

## Angular 20 Features Used

This project showcases the latest Angular 20 features:

- **Standalone Components** - No NgModule required
- **Signals** - Reactive state management with `signal()`, `computed()`, and `effect()`
- **New Control Flow Syntax** - `@if`, `@for` instead of `*ngIf`, `*ngFor`
- **inject() Function** - Modern dependency injection
- **Signal-based Inputs/Outputs** - `input()` and `output()` functions
- **Functional Programming** - Pure functions and immutable state
- **HostListener** - Keyboard event handling
- **ViewChild with Signals** - Component communication

## 📋 Requirements Coverage

All requirements from the problem statement are fully implemented:

### ✅ Board Initialization
- Default 4x4 board size
- Two random tiles (2 or 4) at start
- Configurable board size (3x3 to 8x8)

### ✅ Game Mechanics
- Keyboard controls (↑↓←→)
- GUI button controls
- Touch/swipe support for mobile
- Tile merging with correct sum
- Random tile spawning after each move
- Win condition (2048 reached)
- Loss condition (no moves possible)

### ✅ Technical Specifications
- Configurable board size (Y x Y)
- Functional programming principles
- Dynamic GUI updates
- Score tracking and display
- Best score persistence
- Game restart functionality
- Modular, reusable, readable code

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/angular-2048-game.git
   cd angular-2048-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200/`

## How to Play

### Objective
Combine tiles with the same number to reach the **2048** tile!

### Controls

**Desktop:**
- Use **Arrow Keys** (↑↓←→) to move tiles in any direction
- All tiles slide in the chosen direction until they hit the edge or another tile
- When two tiles with the same number collide, they merge into one

**Mobile:**
- **Swipe** in any direction (up, down, left, right)
- Use the **on-screen arrow buttons** for precise control

### Rules

1. After each move, a new tile (2 or 4) appears at a random empty position
2. Tiles with the same number merge when they collide
3. The merged tile's value is the sum of the two tiles
4. Your score increases by the value of each merged tile
5. Game ends when you reach 2048 (WIN) or no more moves are possible (GAME OVER)
6. You can continue playing after reaching 2048!

### Tips

- Plan ahead - think about where tiles will land
- Keep your highest tile in a corner
- Build tiles in a sequential order (2, 4, 8, 16...)
- Don't focus on the score - focus on building larger tiles

## Project Structure

```
angular-2048-game/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── game.model.ts           # TypeScript interfaces and types
│   │   ├── services/
│   │   │   └── game.service.ts         # Game logic and state management
│   │   ├── components/
│   │   │   ├── game-board/
│   │   │   │   ├── game-board.component.ts
│   │   │   │   ├── game-board.component.html
│   │   │   │   └── game-board.component.scss
│   │   │   ├── tile/
│   │   │   │   ├── tile.component.ts
│   │   │   │   ├── tile.component.html
│   │   │   │   └── tile.component.scss
│   │   │   └── controls/
│   │   │       ├── controls.component.ts
│   │   │       ├── controls.component.html
│   │   │       └── controls.component.scss
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.config.ts
│   ├── styles.scss
│   ├── main.ts
│   └── index.html
├── package.json
├── tsconfig.json
├── angular.json
└── README.md
```

### Functional Programming Principles

1. **Pure Functions** - All game logic functions are pure (no side effects)
2. **Immutability** - Board state is never mutated directly
3. **Function Composition** - Complex operations built from simple functions
4. **Declarative Code** - Focus on what to do, not how to do it

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

- GitHub: https://github.com/Vivek-Jain-13032
- Email: vivekjain13032@gmail.com
- LinkedIn: http://www.linkedin.com/in/vivekjain13032

---