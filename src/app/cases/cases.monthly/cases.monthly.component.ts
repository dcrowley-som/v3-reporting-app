import {Component, linkedSignal, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EpisodeService} from '../../services/episode.service';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {EpisodeMonthly} from '../../models/episode-monthly';
import {forkJoin, map} from 'rxjs';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, JsonPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';

@Component({
  selector: 'app-cases.monthly',
  imports: [
    Button,
    ConfirmDialog,
    DatePicker,
    FloatLabel,
    Select,
    Toast,
    Toolbar,
    FormsModule,
    DecimalPipe,
    UIChart,
    JsonPipe
  ],
  templateUrl: './cases.monthly.component.html',
  styleUrl: './cases.monthly.component.scss',
  providers: [MessageService, ConfirmationService],
  standalone: true
})
export class CasesMonthlyComponent implements OnInit {
  public selectedResult = signal<EpisodeMonthly[]>([]);
  public prevResult = signal<EpisodeMonthly[]>([]);
  private queryParams: any;
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  selectedCategories: string[] = [];
  public totals = signal<any>({
    selected: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    },
    prev: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    }
  });
  private chartData(metric: string, r: number, g: number, b: number): any {
    return {
      labels: this.selectedResult()
        .map(row => row._id.month + '/' + row._id.year),
      datasets: [
        {
          label: this.selectedDateRange?.label,
          backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ', 0.8)',
          borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
          data: this.selectedResult()
            .map((row: any) => row[metric]),
          fill: false,
          tension: 0.4
        },
        {
          label: 'Previous',
          backgroundColor: 'rgba(254, 154, 0, .8)',
          borderColor: 'rgba(254, 154, 0)',
          data: this.prevResult()
            .map((row:any) => row[metric]),
          fill: false,
          tension: 0.4
        }
      ]
    }
  }

  public episodeData = linkedSignal(() => {
    return this.chartData('episodes', 14, 165, 233);
  });
  public anMinuteData = linkedSignal(() => {
    return this.chartData('anMinutes', 20, 184, 166);
  });
  public inRoomMinuteData = linkedSignal(() => {
    return this.chartData('inRoomMinutes', 99, 102, 241);
  });

  public topChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.5,
    plugins: {
      legend: {
        labels: {
          color: 'grey',
          font: {
            weight: 300
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'grey',
          font: {
            weight: 400,
            size: 9
          }
        },
        grid: {
          color: 'lightgray',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: 'grey',
          font: {
            weight: 400,
            size: 9
          }
        },
        grid: {
          color: 'lightgray',
          drawBorder: false
        }
      }
    }
  };



  constructor(
    private route: ActivatedRoute,
    private episodeService: EpisodeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.parseCategoryParams();
    });

    this.dateRanges = this.episodeService.dateRanges;
    this.selectedDateRange = this.dateRanges[0];
    this.refresh();
  }

  private parseCategoryParams() {
    if (this.queryParams.cat1) {
      this.selectedCategories = this.queryParams.cat1.split(',');
    }
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  refresh() {
    if (!this.selectedDateRange) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Parameters', detail: 'Please select a date range.' });
      return;
    }
    if (this.selectedDateRange!.label === 'Custom' && (
      !this.rangeDates || this.rangeDates.length < 2 || this.rangeDates[0] === null || this.rangeDates[1] === null
    )) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Parameters', detail: 'Custom date ranges require start and end dates.' });
      return;
    }
    const sources = [
      this.episodeService.monthly(this.selectedDateRange!.label as string, this.selectedCategories, this.rangeDates),
      this.episodeService.monthly('PREV-' + this.selectedDateRange!.label as string, this.selectedCategories, this.rangeDates)
    ];

    forkJoin(sources)
      .pipe(map(([_selected, _prev]) => {
        return {
          _selected: _selected,
          _prev: _prev
        }
      }))
      .subscribe((all: any) => {
        const t = {
          selected: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          },
          prev: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          }
        };
        for (const row of all._selected.result) {
          t.selected.episodes += row.episodes;
          t.selected.anMinutes += row.anMinutes;
          t.selected.inRoomMinutes += row.inRoomMinutes;
        }
        for (const row of all._prev.result) {
          t.prev.episodes += row.episodes;
          t.prev.anMinutes += row.anMinutes;
          t.prev.inRoomMinutes += row.inRoomMinutes;
        }
        this.totals.set(t);
        this.selectedResult.set(all._selected.result);
        this.prevResult.set(all._prev.result);


      });
  }

}
