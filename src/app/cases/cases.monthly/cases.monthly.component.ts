import {Component, effect, linkedSignal, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EpisodeService} from '../../services/episode.service';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {EpisodeMonthly, EpisodeTable} from '../../models/episode-monthly';
import {forkJoin, map} from 'rxjs';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgForOf} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {MultiSelect} from 'primeng/multiselect';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {EpisodeMonthlyColumnPipe} from '../../pipes/episode-monthly-column.pipe';
import {Tag} from 'primeng/tag';
import {RadioButton} from 'primeng/radiobutton';
import {CasesParams} from '../../models/cases-params';

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
    MultiSelect,
    Panel,
    TableModule,
    NgForOf,
    EpisodeMonthlyColumnPipe,
    Tag,
    RadioButton
  ],
  templateUrl: './cases.monthly.component.html',
  styleUrl: './cases.monthly.component.scss',
  providers: [MessageService, ConfirmationService],
  standalone: true
})
export class CasesMonthlyComponent implements OnInit {
  public selectedResult = signal<EpisodeMonthly[]>([]);
  public prevResult = signal<EpisodeMonthly[]>([]);
  public tableResult = signal<EpisodeTable[]>([]);
  public prevTableResult = signal<EpisodeTable[]>([]);
  public categories = signal<any[]>([]);
  private queryParams: any;
  tableMetric = 'episodes';
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  selectedCategories: any[] = [];
  topChartOptions: any;
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
  public tableData = linkedSignal(() => {
    const ret = [
    ];

      for (const [i, v] of this.tableResult().entries()) {
        ret.push({
          selected: v,
          previous: this.prevTableResult()[i]
        });
      }
      return ret;
  });

  constructor(
    private route: ActivatedRoute,
    private episodeService: EpisodeService,
    private messageService: MessageService,
  ) {
    // effect(() => {
    //   // console.log( this.tableData() )
    // });
    this.topChartOptions = episodeService.topChartOptions;
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

  showDetails() {
    this.episodeService.casesParams = <CasesParams>{
      selectedRange: this.selectedDateRange!.label as string,
      dates: this.rangeDates ? this.rangeDates : undefined,
      categories: this.selectedCategories.map((row: any) => row.label)
    };
  }

  private parseCategoryParams() {
    if (this.queryParams.cat1) {
      this.selectedCategories = this.queryParams.cat1.split(',').map((row: string) => {
        return { label: row }
      });
    }
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  refresh() {
    const catStr = this.selectedCategories.map((row: any) => {
      return row.label;
    });
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
      this.episodeService.selectLists(),
      this.episodeService.monthly(this.selectedDateRange!.label as string, catStr, this.rangeDates),
      this.episodeService.monthly('PREV-' + this.selectedDateRange!.label as string, catStr, this.rangeDates),
      this.episodeService.table(this.selectedDateRange!.label as string, catStr, this.rangeDates),
      this.episodeService.table('PREV-' + this.selectedDateRange!.label as string, catStr, this.rangeDates)
    ];

    forkJoin(sources)
      .pipe(map(([_lists, _selected, _prev, _table, _table_prev]) => {
        return {
          _lists: _lists,
          _selected: _selected,
          _prev: _prev,
          _table: _table,
          _table_prev: _table_prev
        }
      }))
      .subscribe((all: any) => {
        this.categories.set(all._lists.cat1.map((row: any) => {
          return { label: row };
        }));
        // const prevMatch = [];
        // for (const row of all._selected.result) {
        //   const found = all._prev.result.find((item: any) => {
        //     return (item._id.year + 1) === row._id.year && item._id.month === row._id.month;
        //   });
        //   if (found) {
        //     prevMatch.push(found);
        //   } else {
        //     prevMatch.push({
        //       _id: row._id,
        //       episodes: 0,
        //       anMinutes: 0,
        //       inRoomMinutes: 0
        //     });
        //   }
        // }
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
        this.tableResult.set(all._table.result);
        this.prevTableResult.set(all._table_prev.result);
      });
  }

}
