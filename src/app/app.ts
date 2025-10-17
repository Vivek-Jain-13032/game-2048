import { Component } from '@angular/core';
import { TileComponent } from "./components/tile/tile";
import { GameBoard } from "./components/game-board/game-board";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [TileComponent, GameBoard]
})
export class App {
  protected title = 'game-2048';
}
