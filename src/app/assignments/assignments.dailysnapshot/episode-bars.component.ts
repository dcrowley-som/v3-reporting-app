import {Component, computed, ElementRef, EventEmitter, Input, input, OnInit, Output} from '@angular/core';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'app-episode-bars',
  template: `

    <p-chart type="bar" [data]="allData()?.data" [options]="allData()?.options" [height]="allData()?.height" (onDataSelect)="onDataSelect($event)"/>
  `,
  styles: ``,
  imports: [
    UIChart
  ],
  standalone: true
})
export class EpisodeBarsComponent implements OnInit {
  @Input() ogLabels: string[] = [];
  @Output() onEpisode: EventEmitter<void> = new EventEmitter();
  episodes = input<any[]>();
  @Input() assignmentDate?: Date;
  documentStyle = getComputedStyle(document.documentElement);
  // chartData = {
  //   labels: ['red', 'blue', 'green', 'yellow'],
  //   datasets: [{
  //     label: 'One',
  //     data: [[5, 8], [2,6], [7,3], [5,10]]
  //   }]
  // }
  // chartData = {
  //   "labels": [
  //     "89283223",
  //     "89295636",
  //     "89238458",
  //     "89281404"
  //   ],
  //   "datasets": [
  //     {
  //       "label": "Episodes",
  //       "backgroundColor": "#06b6d4",
  //       "borderColor": "#06b6d4",
  //       "data": [
  //         [
  //           443,
  //           546
  //         ],
  //         [
  //           471,
  //           815
  //         ],
  //         [
  //           595,
  //           712
  //         ],
  //         [
  //           786,
  //           944
  //         ]
  //       ]
  //     }
  //   ]
  // };
  private getTimeFromMinutes(value: number): string {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    const fMins = mins.toString().length === 1 ? '0' + mins : mins;
    if (hours === 0) {
      return '12:' + fMins + 'a';
    } else if (hours < 12) {
      return hours + ':' + fMins + 'a';
    } else if (hours === 12) {
      return 12 + ':' + fMins + 'p';
    } else if (hours > 12 && hours < 24) {
      return (hours - 12) + ':' + fMins + 'p';
    } else if (hours === 24) {
      return 12 + ':' + fMins + 'a';
    } else if (hours > 24 && hours < 36) {
      return (hours - 24) + ':' + fMins + 'a';
    } else if (hours === 36) {
      return 12 + ':' + fMins + 'p';
    } else if (hours >= 36 && hours < 48) {
      return (hours - 36) + ':' + fMins + 'p';
    } else if (hours === 48) {
      return 12 + ':' + fMins + 'a';
    } else if (hours > 48) {
      return (hours - 48) + ':' + fMins + 'a';
    } else {
      return '';
    }
  }
  allData = computed(() => {
    if (!this.episodes()) { return }
    const textColor = this.documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = this.documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = this.documentStyle.getPropertyValue('--p-content-border-color');
    const chartOptions = {

      indexAxis: 'y',
      maintainAspectRatio: false,
      // aspectRatio: 0.8,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              if (!context) { return ''}
              const raw = context.raw;
              const s: string = this.getTimeFromMinutes(raw[0]);
              const e: string = this.getTimeFromMinutes(raw[1]);
              return s + '-' + e;
            }
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          min: 6*60,
          max: 31*60,
          ticks: {
            callback: (value: any) => {
              return this.getTimeFromMinutes(value);
            },
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    }
    const datasets = {
      labels: this.episodes()!.map((item: any) => {
        return item.episodeId;
      }),
      datasets: [
        {
          label: 'Episodes',
          backgroundColor: 'rgba(6, 182, 212, .4)',
          borderColor: this.documentStyle.getPropertyValue('--p-cyan-500'),
          borderRadius: 5,
          borderWidth: 2,
          borderSkipped: false,
          data: this.episodes()!.map((item: any) => {
            return [
              this.getMinutesFromDate(new Date(item.anesStart)),
              this.getMinutesFromDate(new Date(item.anesStop)),
            ];
          })
        }
      ]
    }
    // console.log(datasets);
    return {
      data: datasets,
      options: chartOptions,
      height: (this.episodes()!.length * 30 + 50) + 'px'
    };
  });

  private getMinutesFromDate(d: Date): number {
    const t = this.assignmentDate ? this.assignmentDate.getTime() : new Date().getTime();
    const dt = d.getTime();
    const diff = dt - t;
    return diff / 1000 / 60;
  }

  onDataSelect($event: any) {
    const episode = this.episodes()![$event.element.index];
    this.onEpisode.emit(episode);
  }

  ngOnInit() {


  }
}
