import {Component, input} from '@angular/core';

@Component({
  selector: 'app-episode-bars',
  template: ``,
  styles: ``,
  standalone: true
})
export class EpisodeBarsComponent {
  episodes = input<any[]>();
}
