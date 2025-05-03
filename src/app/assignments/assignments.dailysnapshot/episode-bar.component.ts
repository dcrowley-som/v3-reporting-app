import {Component, computed, input, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-episode-bar',
  template: `
    <div class="episode-bar" [style]="{marginLeft: marginLeftPerc(), width: widthPerc()}">
    </div>
  `,
  styles: `
    .episode-bar {
      width: 100%;
      height: 10px;
      background-color: lightgray;

    }
  `,
  standalone: true
})
export class EpisodeBarComponent {
  episode = input<any>();
  start = 0;
  stop = (24 * 60) + (7 * 60);
  tot = this.stop - this.start;
  marginLeftPerc = computed(() => {
    // if (!this.episode()) { return '0%'}
    const startDate = new Date(this.episode().anesStart);
    const mins = startDate.getMinutes() + (startDate.getHours() * 60);
    const diff = mins - this.start;
    console.log('diff ' + diff);
    const per = diff/this.tot * 100;
    console.log('per ' + per);
    return per + '%';

  });

  widthPerc = computed(() => {
    const widthPerc = this.episode().anMinutes/this.tot * 100;
    return widthPerc + '%';
  });
}
