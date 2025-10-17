import { Component, HostListener, inject } from '@angular/core';
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

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Prevent default behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowUp':
        this.gameService.move(Direction.UP);
        break;
      case 'ArrowDown':
        this.gameService.move(Direction.DOWN);
        break;
      case 'ArrowLeft':
        this.gameService.move(Direction.LEFT);
        break;
      case 'ArrowRight':
        this.gameService.move(Direction.RIGHT);
        break;
    }
  }

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
