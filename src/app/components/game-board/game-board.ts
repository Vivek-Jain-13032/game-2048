import { Component, inject } from '@angular/core';
import { GameService } from '../../service/game';

@Component({
  selector: 'app-game-board',
  imports: [],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoard {
  private readonly gameService = inject(GameService);

  readonly board = this.gameService.board;
  readonly boardSize = this.gameService.boardSize;
}
