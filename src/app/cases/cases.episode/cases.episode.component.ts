import {Component, effect, input} from '@angular/core';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Drawer} from 'primeng/drawer';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-cases-episode',
  imports: [
    ScrollPanel,
    Drawer,
    DatePipe,
  ],
  templateUrl: './cases.episode.component.html',
  standalone: true,
  styleUrl: './cases.episode.component.scss'
})
export class CasesEpisodeComponent {
  showRow = false;
  selectedRow = input<any>()
  constructor() {
    effect(() => {
      if (this.selectedRow() !== undefined) {
        this.showRow = true;
      }
    });
  }
}
