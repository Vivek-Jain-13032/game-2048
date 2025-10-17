import { computed, Injectable, signal } from '@angular/core';
import { Board, Direction, GameState, MoveResult, Tile } from '../models/game';

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
    this.initializeGame();
  }

  /**
 * Initialize or restart the game with configurable board size
 */
  initializeGame(size: number = 4): void {
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

  public move(direction: Direction): void {
    const currentState = this.gameState();

    if (currentState.gameOver || currentState.gameWon) {
      return;
    }

    const moveResult = this.performMove(currentState.board, direction);

    if (!moveResult.moved) {
      return; // No tiles moved, do nothing
    }

    // Add a new random tile after
    const boardWithNewTile = this.addRandomTile(moveResult.board, 1);
    const newScore = currentState.socre + moveResult.scoreGained;

    const hasWon = this.checkWinCondition(boardWithNewTile);
    const isGameOver = this.checkGameOver(boardWithNewTile);

    this.gameState.set({
      board: boardWithNewTile,
      socre: newScore,
      gameOver: isGameOver,
      gameWon: hasWon,
      boardSize: currentState.boardSize
    });
  }

  private performMove(board: Board, direction: Direction): MoveResult {
    let newBoard = this.deepCloneBoard(board);
    let scoreGained = 0;
    let moved = false;

    // Rotate board based on direction for uniform processing
    newBoard = this.rotateBoard(newBoard, direction);

    // Process each row (now all moves are "left" after rotation)
    for (let row = 0; row < newBoard.length; row++) {
      const { newRow, score, rowMoved } = this.slideAndMergeRow(newBoard[row]);
      if (rowMoved) moved = true;
      newBoard[row] = newRow;
      scoreGained += score;
    }

    // Rotate back to original orientation
    newBoard = this.rotateBoard(newBoard, direction, true);
    return { board: newBoard, scoreGained, moved };
  }

  private slideAndMergeRow(row: (Tile | null)[]): { newRow: (Tile | null)[]; score: number; rowMoved: boolean } {
    const tiles = row.filter(tile => tile !== null) as Tile[];
    const newRow: (Tile | null)[] = [];
    let score = 0;
    let i = 0;

    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
        const mergedValue = tiles[i].value * 2;
        newRow.push({
          value: mergedValue,
          id: tiles[i].id,
        });
        score += mergedValue;
        i += 2;
      } else {
        newRow.push({ ...tiles[i] });
        i++;
      }
    }

    while (newRow.length < row.length) {
      newRow.push(null);
    }

    const rowMoved = !this.areRowsEqual(row, newRow);
    return { newRow, score, rowMoved };
  }

  private areRowsEqual(row1: (Tile | null)[], row2: (Tile | null)[]): boolean {
    return row1.every((tile, index) => {
      const tile2 = row2[index];
      if (tile === null && tile2 === null) return true;
      if (tile === null || tile2 === null) return false;
      // return tile.value === tile2.value && tile.id === tile2.id;
      return tile.value === tile2.value;
    })
  }

  private rotateBoard(board: Board, direction: Direction, reverse: boolean = false): Board {
    const size = board.length;
    if (direction === Direction.LEFT) {
      return board;
    }

    if (direction === Direction.RIGHT) {
      return board.map(row => [...row].reverse());
    }

    if (direction === Direction.UP) {
      const rotated: Board = Array(size).fill(null).map(() => Array(size).fill(null));
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // rotated[c][size - 1 - r] = board[r][c];
          rotated[c][r] = board[r][c];
        }
      }
      return rotated;
    }

    if (direction === Direction.DOWN) {
      const rotated: Board = Array(size).fill(null).map(() => Array(size).fill(null));
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // rotated[size - 1 - c][r] = board[r][c];
          rotated[c][size - 1 - r] = board[r][c];
        }
      }
      return rotated;
    }
    return board;
  }

  public changeBoardSize(size: number): void {
    if (size < 3 || size > 8) {
      window.alert('Board size must be between 3 and 8');
      return;
    }
    this.initializeGame(size);
  }

  private checkWinCondition(board: Board): boolean {
    return board.some(row =>
      row.some(tile => tile !== null && tile.value >= 2048)
    );
  }

  private checkGameOver(board: Board): boolean {
    // Check if there are empty cells
    if (this.getEmptyCells(board).length > 0) {
      return false;
    }

    // Check if any adjacent tiles can be merged
    const size = board.length;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const currentTile = board[row][col];
        if (currentTile === null) continue;

        // Check right neighbor
        if (col < size - 1) {
          const rightTile = board[row][col + 1];
          if (rightTile && rightTile.value === currentTile.value) {
            return false;
          }
        }

        // Check bottom neighbor
        if (row < size - 1) {
          const bottomTile = board[row + 1][col];
          if (bottomTile && bottomTile.value === currentTile.value) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
