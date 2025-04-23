import {Component, inject, linkedSignal, OnInit, signal, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Toolbar} from 'primeng/toolbar';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {Toast} from 'primeng/toast';
import {UIChart} from 'primeng/chart';
import {finalize, forkJoin, map} from 'rxjs';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Router} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import {EpisodeService} from '../../services/episode.service';
import {EpisodeMonthly, EpisodeTable} from '../../models/episode-monthly';
import {MultiSelect} from 'primeng/multiselect';
import {RadioButton} from 'primeng/radiobutton';
import {EpisodeMonthlyColumnPipe} from '../../pipes/episode-monthly-column.pipe';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-cases.overview',
  imports: [Toolbar, Select, FormsModule, DatePicker, FloatLabel, Button, Card, DecimalPipe, Toast, UIChart,
    ConfirmDialog, ProgressSpinner, MultiSelect, RadioButton, EpisodeMonthlyColumnPipe, NgForOf, Panel, TableModule, NgClass],
  templateUrl: './cases.overview.component.html',
  standalone: true,
  styleUrl: './cases.overview.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class CasesOverviewComponent implements OnInit {
  public isLoading = false;
  public selectedCategories: any[] = [];
  public selectedMetric = signal<string>('episodes');
  topChartOptions: any;
  public categories = signal<any[]>([]);
  public fyResults = signal<EpisodeMonthly[]>([]);
  public prevFYResults = signal<EpisodeMonthly[]>([]);
  public rollingResults = signal<EpisodeMonthly[]>([]);
  public prevRollingResults = signal<EpisodeMonthly[]>([]);
  public tableFyResults = signal<EpisodeTable[]>([]);
  public tablePrevFyResults = signal<EpisodeTable[]>([]);
  public tableRollingResults = signal<EpisodeTable[]>([]);
  public tablePrevRollingResults = signal<EpisodeTable[]>([]);
  public totals = signal<any>({
    fy: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    },
    prevFy: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    },
    rolling: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    },
    prevRolling: {
      episodes: 0,
      anMinutes: 0,
      inRoomMinutes: 0,
    }
  });

  constructor(
    private episodeService: EpisodeService,
  ) {
    this.topChartOptions = episodeService.topChartOptions;
  }

  ngOnInit() {
    this.isLoading = true;
    this.episodeService.selectLists().subscribe((data: any) => {
      this.categories.set(data.cat1.map((row: any) => {
        return { label: row };
      }));
      this.selectedCategories = this.categories().slice();
      this.refresh();
    })
  }

  public tableData = linkedSignal(() => {
    // if (!this.tableFyResults()) {
    //   return [];
    // }
    const ret: any[] = [];
    for (const [i, v] of this.tableFyResults().entries()) {
      const cat = v._id.category;
      ret.push({
        category: cat,
        fy: this.tableFyResults()[i],
        prevFy: this.tablePrevFyResults()[i],
        rolling: this.tableRollingResults()[i],
        prevRolling: this.tablePrevRollingResults()[i]
      });
    }
    return ret;
  });

  public diffClass(prev: any, curr: any): string {
    const p = prev[this.selectedMetric()];
    const c = curr[this.selectedMetric()];
    if (c > p) {
      return '!bg-green-200';
    } else if (p > c) {
      return '!bg-red-200';
    } else {
      return '';
    }
  }

  private chartData(results: any[], prev: any[], dateLabel: string, metric: string, r: number, g: number, b: number): any {
    return {
      labels: results
        .map(row => row._id.month + '/' + row._id.year),
      datasets: [
        {
          label: dateLabel,
          backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ', 0.8)',
          borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
          data: results
            .map((row: any) => row[metric]),
          fill: false,
          tension: 0.4
        },
        {
          label: 'Previous',
          backgroundColor: 'rgba(254, 154, 0, .8)',
          borderColor: 'rgba(254, 154, 0)',
          data: prev
            .map((row:any) => row[metric]),
          fill: false,
          tension: 0.4
        }
      ]
    }
  }

  public topFyData = linkedSignal(() => {
    return this.chartData(this.fyResults(), this.prevFYResults(), 'FY-TD', this.selectedMetric(), 14, 165, 233);
  });

  public topRollingData = linkedSignal(() => {
    return this.chartData(this.rollingResults(), this.prevRollingResults(), 'Rolling-12', this.selectedMetric(), 14, 165, 233);
  });

  public refresh() {
    const catStr = this.selectedCategories.map((row: any) => {
      return row.label;
    });
    const sources = [
      this.episodeService.overview('FY-YTD', catStr, undefined),
      this.episodeService.overview('PREV-FY-YTD', catStr, undefined),
      this.episodeService.overview('ROLLING-12', catStr, undefined),
      this.episodeService.overview('PREV-ROLLING-12', catStr, undefined),
      this.episodeService.table('FY-YTD', catStr, undefined),
      this.episodeService.table('PREV-FY-YTD', catStr, undefined),
      this.episodeService.table('ROLLING-12', catStr, undefined),
      this.episodeService.table('PREV-ROLLING-12', catStr, undefined)
    ];
    this.isLoading = true;
    forkJoin(sources)
      .pipe(map(([_fy, _prevFy, _rolling, _prevRolling, _tableFy, _tablePrevFy, _tableRolling, _tablePrevRolling]) => {
        return {
          _fy, _prevFy, _rolling, _prevRolling, _tableFy, _tablePrevFy, _tableRolling, _tablePrevRolling
        }
      }))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((all: any) => {
        console.log(all);
        const t = {
          fy: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          },
          prevFy: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          },
          rolling: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          },
          prevRolling: {
            episodes: 0,
            anMinutes: 0,
            inRoomMinutes: 0,
          },
        };
        for (const row of all._fy.result) {
          t.fy.episodes += row.episodes;
          t.fy.anMinutes += row.anMinutes;
          t.fy.inRoomMinutes += row.inRoomMinutes;
        }
        for (const row of all._prevFy.result) {
          t.prevFy.episodes += row.episodes;
          t.prevFy.anMinutes += row.anMinutes;
          t.prevFy.inRoomMinutes += row.inRoomMinutes;
        }
        for (const row of all._rolling.result) {
          t.rolling.episodes += row.episodes;
          t.rolling.anMinutes += row.anMinutes;
          t.rolling.inRoomMinutes += row.inRoomMinutes;
        }
        for (const row of all._prevRolling.result) {
          t.prevRolling.episodes += row.episodes;
          t.prevRolling.anMinutes += row.anMinutes;
          t.prevRolling.inRoomMinutes += row.inRoomMinutes;
        }
        this.totals.set(t);
        this.fyResults.set(all._fy.result);
        this.prevFYResults.set(all._prevFy.result);
        this.rollingResults.set(all._rolling.result);
        this.prevRollingResults.set(all._prevRolling.result);
        this.tableFyResults.set(all._tableFy.result);
        this.tablePrevFyResults.set(all._tablePrevFy.result);
        this.tableRollingResults.set(all._tableRolling.result);
        this.tablePrevRollingResults.set(all._tablePrevRolling.result);
      });
  }
}
