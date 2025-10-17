import { Component } from '@angular/core';
import { TileComponent } from "./components/tile/tile";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [TileComponent]
})
export class App {
  protected title = 'game-2048';
}
