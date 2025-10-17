import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './controls.html',
  styleUrl: './controls.scss'
})
export class ControlsComponent {
  score = input<number>(0);
  bestScore = input<number>(0);
  gameOver = input<boolean>(false);
  gameWon = input<boolean>(false);
  boardSize = input<number>(4);

  restart = output<void>();
  continueGame = output<void>();
  changeBoardSize = output<number>();

  selectedSize = 4;

  onRestart(): void {
    this.restart.emit();
  }

  onContinue(): void {
    this.continueGame.emit();
  }

  onSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value, 10);
    this.selectedSize = size;
    this.changeBoardSize.emit(size);
  }
}
