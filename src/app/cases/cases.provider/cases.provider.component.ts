import {AfterViewInit, Component, linkedSignal, OnInit, signal} from '@angular/core';
import {Toolbar} from 'primeng/toolbar';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {UIChart} from 'primeng/chart';
import {DecimalPipe, NgForOf} from '@angular/common';
import {MenuItem, MessageService} from 'primeng/api';
import {EpisodeService} from '../../services/episode.service';
import {ActivatedRoute} from '@angular/router';
import {Toast} from 'primeng/toast';
import {forkJoin, map} from 'rxjs';
import {MultiSelect} from 'primeng/multiselect';
import {Tag} from 'primeng/tag';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {RadioButton} from 'primeng/radiobutton';
import {CasesParams} from '../../models/cases-params';


@Component({
  selector: 'app-cases.provider',
  imports: [Toolbar, Select, DatePicker, FormsModule, Button,
    FloatLabel, UIChart, DecimalPipe, Toast, MultiSelect, Tag, Panel, TableModule, NgForOf, RadioButton],
  templateUrl: './cases.provider.component.html',
  standalone: true,
  styleUrl: './cases.provider.component.scss',
  providers: [MessageService]
})
export class CasesProviderComponent implements OnInit, AfterViewInit {
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  private queryParams: any;
  public providerName: string = '';
  public categories = signal<any[]>([]);
  public providersList = signal<any[]>([]);
  public monthly = signal<any[]>([]);
  public previous = signal<any[]>([]);
  topChartOptions: any;
  selectedProvider: any | undefined;
  selectedCategories: any[] = [{label: 'UMMC-GOR'}];
  tableMetric = 'episodes';
  constructor(
    private route: ActivatedRoute,
    private episodeService: EpisodeService,
    private messageService: MessageService,
  ) {
    this.topChartOptions = episodeService.topChartOptions;
  }

  private chartData(metric: string, r: number, g: number, b: number): any {
    return {
      labels: this.monthly()
        .map(row => row._id.month + '/' + row._id.year),
      datasets: [
        {
          label: this.selectedDateRange?.label,
          backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ', 0.8)',
          borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
          data: this.monthly()
            .map((row: any) => row[metric]),
          fill: false,
          tension: 0.4
        },
        {
          label: 'Previous',
          backgroundColor: 'rgba(254, 154, 0, .8)',
          borderColor: 'rgba(254, 154, 0)',
          data: this.previous()
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
  public tableHeaders = linkedSignal(() => {
    return this.monthly().map((item: any) => {
      return item._id.month + '/' + item._id.year;
    });
  });
  public tableData = linkedSignal<any>(() => {
    return [{
      current: this.monthly(),
      previous: this.previous()
    }];
  });
  public totals: any = linkedSignal(() => {
    const t = {
      monthly: {
        episodes: 0,
        anMinutes: 0,
        inRoomMinutes: 0,
      },
      previous: {
        episodes: 0,
        anMinutes: 0,
        inRoomMinutes: 0,
      }
    }
    for (const m of this.monthly()) {
      t.monthly.episodes += m.episodes;
      t.monthly.anMinutes += m.anMinutes;
      t.monthly.inRoomMinutes += m.inRoomMinutes;
    }
    for (const m of this.previous()) {
      t.previous.episodes += m.episodes;
      t.previous.anMinutes += m.anMinutes;
      t.previous.inRoomMinutes += m.inRoomMinutes;
    }
    return t;
  });

  private showProviderError() {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Provider',
      detail: 'Please select a provider.'
    })
  }

  ngAfterViewInit(): void {
    if (this.providerName === '') {
      this.showProviderError();
    }
  }

  ngOnInit(): void {

    this.dateRanges = this.episodeService.dateRanges;
    this.selectedDateRange = this.dateRanges[0];
    this.getProviders();
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      if (params['provider']) {
        this.providerName = params['provider'];
      }
    });
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  showDetails() {
    this.episodeService.casesParams = <CasesParams>{
      selectedRange: this.selectedDateRange!.label as string,
      dates: this.rangeDates ? this.rangeDates : undefined,
      categories: this.selectedCategories.map((row: any) => row.label),
      user: this.selectedProvider._id
    };
  }

  private getProviders(): void {
    this.episodeService.selectLists().subscribe((data: any) => {
      this.categories.set(data.cat1.map((row: any) => {
        return { label: row };
      }));
      this.providersList.set(data.providers.map((row: any) => {
        row.searchable = row.last + ', ' + row.first;
        return row;
      }));
      if (this.providerName && this.providerName !== '' && !this.selectedProvider) {
        const found = this.providersList().find((row: any) => {
          return row.epicProvName === this.providerName;
        });
        if (found) {
          this.selectedProvider = found;
          this.providerName = found.last + ', ' + found.first;
          this.refresh();
        }
      }
    })
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
    const catStr = this.selectedCategories.map((row: any) => {
      return row.label;
    });
    if (!this.selectedProvider) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Provider',
        detail: 'Please select a provider.'
      });
      return;
    }
    const sources = [
      this.episodeService.provider(this.selectedDateRange!.label as string, catStr, this.selectedProvider._id, this.rangeDates),
      this.episodeService.provider('PREV-' + (this.selectedDateRange!.label as string), catStr, this.selectedProvider._id, this.rangeDates)
    ];

    forkJoin(sources)
      .pipe(map(([_monthly, _previous]) => {
        return {
          _monthly: _monthly,
          _previous: _previous,
        }
      }))
      .subscribe((all: any) => {
        this.monthly.set(all._monthly.result);
        this.previous.set(all._previous.result);
      });
  }
}
