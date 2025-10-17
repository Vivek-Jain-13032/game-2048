import { Component, inject } from '@angular/core';
import { GameBoard } from "./components/game-board/game-board";
import { ControlsComponent } from "./components/controls/controls";
import { GameService } from './service/game';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [GameBoard, ControlsComponent]
})
export class App {
  private readonly gameService = inject(GameService);

  readonly score = this.gameService.score;
  readonly gameOver = this.gameService.gameOver;
  readonly gameWon = this.gameService.gameWon;
  readonly boardSize = this.gameService.boardSize;

  onRestart(): void {
    this.gameService.initializeGame(this.boardSize());
  }

  onChangeBoardSize(size: number): void {
    this.gameService.changeBoardSize(size);
  }
}
