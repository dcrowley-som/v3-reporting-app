import {Component, inject, linkedSignal, OnInit, signal} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {Toolbar} from 'primeng/toolbar';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {EpisodeService} from '../../services/episode.service';
import {Card} from 'primeng/card';
import {EpisodeOverview, EpisodeOverviewCategory, EpisodeOverviewResult} from '../../models/episode-overview';
import {DecimalPipe} from '@angular/common';
import {Toast} from 'primeng/toast';
import {UIChart} from 'primeng/chart';
import {forkJoin, map, take} from 'rxjs';

@Component({
  selector: 'app-cases.overview',
  imports: [Toolbar, Select, FormsModule, DatePicker, FloatLabel, Button, Card, DecimalPipe, Toast, UIChart],
  templateUrl: './cases.overview.component.html',
  standalone: true,
  styleUrl: './cases.overview.component.scss',
  providers: [EpisodeService, MessageService]
})
export class CasesOverviewComponent implements OnInit {
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  public result = signal<EpisodeOverview>({
    _id: 'all',
    anMinutes: 0,
    inRoomMinutes: 0,
    episodes: 0,
    categories: []
  });
  public servicesResult = signal<EpisodeOverview>({
    _id: 'all',
    anMinutes: 0,
    inRoomMinutes: 0,
    episodes: 0,
    categories: []
  });
  public providersResult = signal<EpisodeOverview>({
    _id: 'all',
    anMinutes: 0,
    inRoomMinutes: 0,
    episodes: 0,
    categories: []
  });
  public proceduresResult = signal<EpisodeOverview>({
    _id: 'all',
    anMinutes: 0,
    inRoomMinutes: 0,
    episodes: 0,
    categories: []
  });
  // Categories
  public categories = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.result().categories;
  });
  public categoryChartData = linkedSignal(() => {
    return {
      labels: this.categories().map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.categories().map(cat => cat.episodes),
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.categories().map(cat => cat.anMinutes),
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.categories().map(cat => cat.inRoomMinutes),
        }
      ]
    }
  });
  public categoryChartOptions =  {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
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
            color: 'rgba(0,0,0,0)',
            drawBorder: false
          }
        }
      }
  };
  public services = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.servicesResult().categories;
  });
  public servicesChartData = linkedSignal(() => {
    return {
      labels: this.services().slice(0,10).map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.services().map(cat => cat.episodes),
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.services().map(cat => cat.anMinutes),
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.services().map(cat => cat.inRoomMinutes),
        }
      ]
    }
  });
  public providers = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.providersResult().categories;
  });
  public providersChartData = linkedSignal(() => {
    return {
      labels: this.providers().map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.providers().map(cat => cat.episodes),
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.providers().map(cat => cat.anMinutes),
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.providers().map(cat => cat.inRoomMinutes),
        }
      ]
    }
  });
  public procedures = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.proceduresResult().categories;
  });
  public proceduresChartData = linkedSignal(() => {
    return {
      labels: this.procedures().slice(0,10).map(cat => cat._id.slice(0,20)),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.procedures().map(cat => cat.episodes),
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.procedures().map(cat => cat.anMinutes),
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.procedures().map(cat => cat.inRoomMinutes),
        }
      ]
    }
  });
  constructor(
    private episodeService: EpisodeService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.dateRanges = [
      {
        label: 'YTD'
      }, {
        label: 'MTD'
      }, {
         label: 'Last Year'
      }, {
        label: 'FY 25'
      }, {
        label: 'FY 24'
      }, { label: 'Custom' }
    ];
    this.selectedDateRange = this.dateRanges[0];
    this.refresh();
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
    this.episodeService.overview(this.selectedDateRange!.label as string, this.rangeDates, 'cat1')
      .subscribe((data: any) => {
        this.result.set(data.result);
        this.refreshAll();
      });
  }

  private refreshAll() {
    const sources = [
      this.episodeService.overview(this.selectedDateRange!.label as string, this.rangeDates, 'service'),
      this.episodeService.overview(this.selectedDateRange!.label as string, this.rangeDates, 'responsibleProvName'),
      this.episodeService.overview(this.selectedDateRange!.label as string, this.rangeDates, 'procedure'),
    ];

    forkJoin(sources)
      .pipe(map(([_services, _providers, _procedures]) => {
        return {
          _services: _services,
          _providers: _providers,
          _procedures: _procedures
        }
      }))
      .subscribe((allSources: any) => {
        this.servicesResult.set(allSources._services.result);
        this.providersResult.set(allSources._providers.result);
        this.proceduresResult.set(allSources._procedures.result);
      });
  }
}
