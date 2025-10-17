import { computed, Injectable, signal } from '@angular/core';
import { Board, GameState } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private tileIdCounter = 0;

  private readonly gameState = signal<GameState>({
    board: [],
    socre: 0,
    gameOver: false,
    gameWon: false,
    boardSize: 4
  })

  // Computed signals for derived state
  readonly board = computed(() => this.gameState().board);
  readonly score = computed(() => this.gameState().socre)
  readonly gameOver = computed(() => this.gameState().gameOver);
  readonly gameWon = computed(() => this.gameState().gameWon);
  readonly boardSize = computed(() => this.gameState().boardSize);

  constructor() {
    this.intializeGame();
  }

  /**
 * Initialize or restart the game with configurable board size
 */
  intializeGame(size: number = 4): void {
    const emptBoard = this.createEmptyBoard(size);
    const boardWithTiles = this.addRandomTile(emptBoard, 2);

    this.gameState.update(state => ({
      ...state,
      board: boardWithTiles,
      socre: 0,
      gameOver: false,
      gameWon: false,
      boardSize: size
    }));
  }

  /**
 * Create an empty board of given size
 */
  private createEmptyBoard(size: number): Board {
    return Array(size).fill(null).map(() => Array(size).fill(null));
  }

  /**
 * Add random tiles to the board
 */
  private addRandomTile(board: Board, count: number = 1): Board {
    let newBoard = this.deepCloneBoard(board);
    const emptyCells = this.getEmptyCells(newBoard);

    for (let i = 0; i < count && emptyCells.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

      newBoard[row][col] = {
        value,
        id: this.tileIdCounter++
      };

      emptyCells.splice(randomIndex, 1); // Remove the filled cell from emptyCells
    }

    return newBoard;
  }

  private deepCloneBoard(board: Board): Board {
    return board.map(row => row.map(cell => cell ? { ...cell, merged: false } : null));
  }

  private getEmptyCells(board: Board): { row: number; col: number }[] {
    const emptyCells: { row: number; col: number }[] = [];

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    return emptyCells;
  }

}
