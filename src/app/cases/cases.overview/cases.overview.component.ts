import {Component, inject, linkedSignal, OnInit, signal, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {Toolbar} from 'primeng/toolbar';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {EpisodeService} from '../../services/episode.service';
import {Card} from 'primeng/card';
import {EpisodeOverview, EpisodeOverviewCategory} from '../../models/episode-overview';
import {DecimalPipe} from '@angular/common';
import {Toast} from 'primeng/toast';
import {UIChart} from 'primeng/chart';
import {forkJoin, map} from 'rxjs';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cases.overview',
  imports: [Toolbar, Select, FormsModule, DatePicker, FloatLabel, Button, Card, DecimalPipe, Toast, UIChart,
  ConfirmDialog],
  templateUrl: './cases.overview.component.html',
  standalone: true,
  styleUrl: './cases.overview.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class CasesOverviewComponent implements OnInit {
  @ViewChild(UIChart) categoriesChart: UIChart | undefined;
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  sortCols: any[] = [{
    id: 'episodes', label: 'Cases'
  }, {
    id: 'anMinutes', label: 'AN Minutes',
  }, {
    id: 'inRoomMinutes', label: "In Room Minutes"
  }];
  public sortCol = signal<any>(this.sortCols[0]);
  public sortColServices = signal<any>(this.sortCols[0]);
  public sortColProcedures = signal<any>(this.sortCols[0]);
  public sortColProviders = signal<any>(this.sortCols[0]);
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
      labels: this.categories()
        .sort((a: any, b: any) => {
          const aNum = a[this.sortCol().id];
          const bNum = b[this.sortCol().id];
          return bNum - aNum;
        })
        .map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.categories()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortCol().id];
              const bNum = b[this.sortCol().id];
              return bNum - aNum;
            })
            .map(cat => cat.episodes),
          hidden: this.sortCol().id !== 'episodes'
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.categories()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortCol().id];
              const bNum = b[this.sortCol().id];
              return bNum - aNum;
            })
            .map(cat => cat.anMinutes),
          hidden: this.sortCol().id !== 'anMinutes'
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.categories()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortCol().id];
              const bNum = b[this.sortCol().id];
              return bNum - aNum;
            })
            .map(cat => cat.inRoomMinutes),
          hidden: this.sortCol().id !== 'inRoomMinutes'
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
      labels: this.services()
        .sort((a: any, b: any) => {
          const aNum = a[this.sortColServices().id];
          const bNum = b[this.sortColServices().id];
          return bNum - aNum;
        })
        .slice(0,10).map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.services()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColServices().id];
              const bNum = b[this.sortColServices().id];
              return bNum - aNum;
            })
            .map(cat => cat.episodes),
          hidden: this.sortColServices().id !== 'episodes'
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.services()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColServices().id];
              const bNum = b[this.sortColServices().id];
              return bNum - aNum;
            })
            .map(cat => cat.anMinutes),
          hidden: this.sortColServices().id !== 'anMinutes'
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.services()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColServices().id];
              const bNum = b[this.sortColServices().id];
              return bNum - aNum;
            })
            .map(cat => cat.inRoomMinutes),
          hidden: this.sortColServices().id !== 'inRoomMinutes'
        }
      ]
    }
  });
  public providers = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.providersResult().categories;
  });
  public providersChartData = linkedSignal(() => {
    return {
      labels: this.providers()
        .sort((a: any, b: any) => {
          const aNum = a[this.sortColProviders().id];
          const bNum = b[this.sortColProviders().id];
          return bNum - aNum;
        })
        .map(cat => cat._id),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.providers()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProviders().id];
              const bNum = b[this.sortColProviders().id];
              return bNum - aNum;
            })
            .map(cat => cat.episodes),
          hidden: this.sortColProviders().id !== 'episodes',
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.providers()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProviders().id];
              const bNum = b[this.sortColProviders().id];
              return bNum - aNum;
            })
            .map(cat => cat.anMinutes),
          hidden: this.sortColProviders().id !== 'anMinutes',
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.providers()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProviders().id];
              const bNum = b[this.sortColProviders().id];
              return bNum - aNum;
            })
            .map(cat => cat.inRoomMinutes),
          hidden: this.sortColProviders().id !== 'inRoomMinutes',
        }
      ]
    }
  });
  public procedures = linkedSignal<EpisodeOverviewCategory[]>(() => {
    return this.proceduresResult().categories;
  });
  public proceduresChartData = linkedSignal(() => {
    return {
      labels: this.procedures()
        .sort((a: any, b: any) => {
          const aNum = a[this.sortColProcedures().id];
          const bNum = b[this.sortColProcedures().id];
          return bNum - aNum;
        })
        .slice(0,10).map(cat => cat._id.slice(0,20)),
      datasets: [
        {
          label: "Cases",
          backgroundColor: 'rgba(14, 165, 233, .8)',
          borderColor: 'rgb(14, 165, 233)',
          data: this.procedures()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProcedures().id];
              const bNum = b[this.sortColProcedures().id];
              return bNum - aNum;
            }).slice(0,10).map(cat => cat.episodes),
          hidden: this.sortColProcedures().id !== 'episodes',
        },
        {
          label: "AN Minutes",
          backgroundColor: 'rgba(20, 184, 166, .8)',
          borderColor: 'rgb(20, 184, 166)',
          data: this.procedures()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProcedures().id];
              const bNum = b[this.sortColProcedures().id];
              return bNum - aNum;
            })
            .slice(0,10).map(cat => cat.anMinutes),
          hidden: this.sortColProcedures().id !== 'anMinutes',
        },
        {
          label: "In Room Minutes",
          backgroundColor: 'rgba(99, 102, 241, .8)',
          borderColor: 'rgb(0,0,0)',
          data: this.procedures()
            .sort((a: any, b: any) => {
              const aNum = a[this.sortColProcedures().id];
              const bNum = b[this.sortColProcedures().id];
              return bNum - aNum;
            })
            .slice(0,10)
            .map(cat => cat.inRoomMinutes),
          hidden: this.sortColProcedures().id !== 'inRoomMinutes',
        }
      ]
    }
  });
  constructor(
    private episodeService: EpisodeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.dateRanges = this.episodeService.dateRanges;
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

  onCategoriesChart(ev: any) {
    const catStr = this.categories()[ev.element.index]._id;
    this.confirmationService.confirm({
      target: ev.target as EventTarget,
      message: 'View Details for ' + catStr,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary'
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        return this.router.navigate(['/', 'cases', 'monthly'], { queryParams: { cat1: catStr } });
      },
      reject: () => {
        // do nothing
      },
    })
  }

  testChart() {
    console.log(this.categoriesChart?.data);
  }
}
