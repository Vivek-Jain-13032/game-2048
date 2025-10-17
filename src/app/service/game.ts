import { Injectable, signal, computed } from '@angular/core';
import { GameState, Board, Tile, Direction, MoveResult } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private tileIdCounter = 0;

  private readonly gameState = signal<GameState>({
    board: [],
    score: 0,
    gameOver: false,
    gameWon: false,
    boardSize: 4
  });

  // Computed signals for derived state
  readonly board = computed(() => this.gameState().board);
  readonly score = computed(() => this.gameState().score);
  readonly gameOver = computed(() => this.gameState().gameOver);
  readonly gameWon = computed(() => this.gameState().gameWon);
  readonly boardSize = computed(() => this.gameState().boardSize);

  constructor() {
    this.initializeGame();
  }

  initializeGame(size: number = 4): void {
    const emptyBoard = this.createEmptyBoard(size);
    const boardWithTiles = this.addRandomTiles(emptyBoard, 2);

    this.gameState.update(state => ({
      ...state,
      board: boardWithTiles,
      score: 0,
      gameOver: false,
      gameWon: false,
      boardSize: size
    }));
  }

  private createEmptyBoard(size: number): Board {
    return Array(size).fill(null).map(() => Array(size).fill(null));
  }

  private addRandomTiles(board: Board, count: number): Board {
    let newBoard = this.deepCloneBoard(board);
    const emptyCells = this.getEmptyCells(newBoard);

    for (let i = 0; i < count && emptyCells.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4

      newBoard[row][col] = {
        value,
        id: this.tileIdCounter++
      };

      emptyCells.splice(randomIndex, 1);
    }

    return newBoard;
  }

  private getEmptyCells(board: Board): { row: number; col: number }[] {
    const emptyCells: { row: number; col: number }[] = [];

    board.forEach((row: (Tile | null)[], rowIndex: number) => {
      row.forEach((cell: Tile | null, colIndex: number) => {
        if (cell === null) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    return emptyCells;
  }

  private deepCloneBoard(board: Board): Board {
    return board.map((row: (Tile | null)[]) =>
      row.map((cell: Tile | null) => cell ? { ...cell, merged: false } as Tile : null)
    );
  }

  public move(direction: Direction): void {
    const currentState = this.gameState();

    if (currentState.gameOver) {
      return;
    }

    const moveResult = this.performMove(currentState.board, direction);

    if (!moveResult.moved) {
      return;
    }

    // Add new random tile
    const boardWithNewTile = this.addRandomTiles(moveResult.board, 1);
    const newScore = currentState.score + moveResult.scoreGained;

    const hasWon = !currentState.gameWon && this.checkWinCondition(boardWithNewTile);
    const isGameOver = this.checkGameOver(boardWithNewTile);

    this.gameState.update(state => ({
      ...state,
      board: boardWithNewTile,
      score: newScore,
      gameWon: hasWon || state.gameWon,
      gameOver: isGameOver
    }));
  }

  private performMove(board: Board, direction: Direction): MoveResult {
    let newBoard = this.deepCloneBoard(board);
    let scoreGained = 0;
    let moved = false;

    const size = newBoard.length;

    if (direction === Direction.LEFT) {
      // Process each row left
      for (let row = 0; row < size; row++) {
        const { newRow, score, rowMoved } = this.slideAndMergeRow(newBoard[row]);
        if (rowMoved) moved = true;
        newBoard[row] = newRow;
        scoreGained += score;
      }
    } else if (direction === Direction.RIGHT) {
      // Process each row right (reverse, slide left, reverse back)
      for (let row = 0; row < size; row++) {
        const reversed = [...newBoard[row]].reverse();
        const { newRow, score, rowMoved } = this.slideAndMergeRow(reversed);
        if (rowMoved) moved = true;
        newBoard[row] = [...newRow].reverse();
        scoreGained += score;
      }
    } else if (direction === Direction.UP) {
      // Process each column upward
      for (let col = 0; col < size; col++) {
        const column: (Tile | null)[] = newBoard.map((row: (Tile | null)[]) => row[col]);
        const { newRow, score, rowMoved } = this.slideAndMergeRow(column);
        if (rowMoved) moved = true;
        for (let row = 0; row < size; row++) {
          newBoard[row][col] = newRow[row];
        }
        scoreGained += score;
      }
    } else if (direction === Direction.DOWN) {
      // Process each column downward (reverse, slide up, reverse back)
      for (let col = 0; col < size; col++) {
        const column: (Tile | null)[] = newBoard.map((row: (Tile | null)[]) => row[col]);
        const reversed = [...column].reverse();
        const { newRow, score, rowMoved } = this.slideAndMergeRow(reversed);
        if (rowMoved) moved = true;
        const finalColumn = [...newRow].reverse();
        for (let row = 0; row < size; row++) {
          newBoard[row][col] = finalColumn[row];
        }
        scoreGained += score;
      }
    }

    return {
      board: newBoard,
      scoreGained: scoreGained,
      moved
    };
  }

  private slideAndMergeRow(row: (Tile | null)[]): {
    newRow: (Tile | null)[];
    score: number;
    rowMoved: boolean
  } {
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
          merged: true
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
      return tile.value === tile2.value;
    });
  }

  private checkWinCondition(board: Board): boolean {
    return board.some((row: (Tile | null)[]) =>
      row.some((tile: Tile | null): boolean => tile !== null && tile.value >= 2048)
    );
  }

  private checkGameOver(board: Board): boolean {
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

  changeBoardSize(size: number): void {
    if (size < 3 || size > 8) {
      console.warn('Board size must be between 3 and 5');
      return;
    }
    this.initializeGame(size);
  }
}