import { Component, inject } from '@angular/core';
import { GameService } from '../../service/game';
import { TileComponent } from '../tile/tile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule, TileComponent],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard {
  private readonly gameService = inject(GameService);

  readonly board = this.gameService.board;
  readonly boardSize = this.gameService.boardSize;

  trackByTileId(index: number, item: any): number {
    return item?.id ?? index;
  }

  moveUp(): void {
  }

  moveDown(): void {
  }

  moveLeft(): void {
  }

  moveRight(): void {
  }
}
