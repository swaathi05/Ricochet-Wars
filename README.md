# Ricochet Wars

## Overview

Ricochet Titans is a strategic 2-player turn-based board game played on an 8x8 grid. Each player commands a set of unique pieces with the ultimate goal of destroying the opponent’s Titan by striking a bullet through a series of various ricochets. The game features Normal Mode for classic gameplay and HackerMode/HackerMode++ for advanced gameplay options.

## Game Features

- **5 Unique Pieces**: Titan, Tank, Ricochets, Semi Ricochets, and Cannon
- **Movement**: Each piece can move one tile or rotate once per turn
- **Shooting Mechanic**: The Cannon shoots bullets horizontally
- **Winning Condition**: Destroy the opponent’s Titan
- **Timers**: Each player has a specific amount of time per turn
- **Responsive Design**: Mobile-friendly gameplay
- **Pause/Resume/Reset**: Control game flow with ease

### HackerMode Features

- **Undo/Redo**: Revert and redo moves
- **Semi Ricochet Destruction**: Bullets destroy semi ricochets when hit on the non-reflecting surface
- **Move History**: Display and store the history of moves
- **Directional Bullet**: Enhanced cannon shooting mechanic
- **Ricochet Swap**: Ricochets can swap with any piece (except Titans)
- **Tank Pass-Through**: Tanks allow bullets to pass through from one side

### HackerMode++ Features

- **Game Replay**: Replay the stored game history
- **Randomized Starting Position**: Randomize the initial placement of pieces
- **Smooth Animations**: Animated movements for pieces and bullets
- **Single-Player Mode**: Play against a basic AI bot
- **Spells**: Cast spells to gain strategic advantages

## Setup Instructions

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/yourusername/ricochet-titans.git
    cd ricochet-titans
    ```

2. **Open the Game**:
    Open `index.html` in your preferred web browser to start playing the game.

## Gameplay Instructions

1. **Game Board**:
    - The game is played on an 8x8 grid.
    - Each player’s pieces are placed on their respective sides of the board.

2. **Pieces and Movement**:
    - **Titan**: The main piece that must be protected.
    - **Tank**: A robust piece that can allow bullets to pass through from one side.
    - **Ricochets**: Pieces that reflect bullets.
    - **Semi Ricochets**: Pieces that have one non-reflecting surface and can be destroyed by bullets.
    - **Cannon**: Only moves horizontally and shoots bullets to destroy the opponent’s pieces.
    - Pieces can move one tile in any direction or rotate once per turn.

3. **Winning the Game**:
    - The objective is to destroy the opponent's Titan by shooting bullets through a series of ricochets.

4. **Shooting Mechanic**:
    - The Cannon can shoot horizontally. The bullet travels until it hits another piece or the edge of the board.

5. **Time Limit**:
    - Each player has a set amount of time per turn. If the timer runs out, the other player wins by default.

## Advanced Features

- **Undo/Redo Moves**: Use keyboard shortcuts (`Ctrl+Z` for undo, `Ctrl+Y` for redo) or UI buttons to revert and redo moves.
- **Move History**: View the history of moves in the move history section.
- **Game Replay**: Replay the entire game from the stored move history.
- **Randomized Starting Positions**: Activate to start the game with pieces in randomized positions.
- **Single-Player Mode**: Toggle single-player mode to play against a basic AI bot.
- **Spells**: Cast spells to gain strategic advantages.
