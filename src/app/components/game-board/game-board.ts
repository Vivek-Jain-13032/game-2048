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
  private touchStartX = 0;
  private touchStartY = 0;

  /**
 * Handle keyboard events for game controls
 */
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

  /**
 * Handle touch/swipe events for mobile
 */
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches.length) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.gameService.move(Direction.RIGHT);
        } else {
          this.gameService.move(Direction.LEFT);
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          this.gameService.move(Direction.DOWN);
        } else {
          this.gameService.move(Direction.UP);
        }
      }
    }
  }

  trackByTileId(index: number, item: any): string | number {
    // Use the tile's id when present. For empty cells return a distinct
    // string key so it cannot collide with numeric tile ids (which start at 0).
    return item ? item.id : `empty-${index}`;
  }
}
