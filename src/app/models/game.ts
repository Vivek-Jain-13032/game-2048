export interface Tile {
    value: number;
    id: number;
    merged?: boolean;
}

export type Board = (Tile | null)[][];

export interface GameState {
    board: Board;
    socre: number;
    gameOver: boolean;
    gameWon: boolean;
    boardSize: number;
}

export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export interface MoveResult {
    board: Board;
    socreGained: number;
    moved: boolean;
}
