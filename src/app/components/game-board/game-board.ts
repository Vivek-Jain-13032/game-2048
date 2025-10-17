import { Component, inject } from '@angular/core';
import { GameService } from '../../service/game';
import { TileComponent } from '../tile/tile';
import { CommonModule } from '@angular/common';
import { Direction } from '../../models/game';

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
    console.log('Move Up');
    this.gameService.move(Direction.UP);
  }

  moveDown(): void {
    console.log('Move Down');
    this.gameService.move(Direction.DOWN);
  }

  moveLeft(): void {
    console.log('Move Left');
    this.gameService.move(Direction.LEFT);
  }

  moveRight(): void {
    console.log('Move Right');
    this.gameService.move(Direction.RIGHT);
  }
}
