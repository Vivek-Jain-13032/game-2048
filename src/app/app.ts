import { Component } from '@angular/core';
import { GameBoard } from "./components/game-board/game-board";
import { ControlsComponent } from "./components/controls/controls";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [GameBoard, ControlsComponent]
})
export class App {
  protected title = 'game-2048';
}
