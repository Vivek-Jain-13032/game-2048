import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Tile } from '../../models/game';

@Component({
  selector: 'app-tile',
  imports: [CommonModule],
  templateUrl: './tile.html',
  styleUrl: './tile.scss'
})
export class TileComponent {
  tile = input<Tile | null>();

  getTileClass(): string {
    const tileValue = this.tile();
    if (!tileValue) return 'tile-empty';
    return `tile-${tileValue.value}`;
  }

  getTileValue(): string {
    const tileValue = this.tile();
    return tileValue ? tileValue.value.toString() : '';
  }

}
