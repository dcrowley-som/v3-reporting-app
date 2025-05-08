import {Component, OnInit, signal} from '@angular/core';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Toolbar} from 'primeng/toolbar';
import {MenuItem, MessageService} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {finalize, forkJoin, map} from 'rxjs';
import {AssignmentService} from '../../services/assignment.service';
import {EpisodeService} from '../../services/episode.service';
import {PickList} from 'primeng/picklist';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {MinutesToHoursPipe} from '../../pipes/minutes-to-hours.pipe';
import {Tooltip} from 'primeng/tooltip';
import {EpisodeBarComponent} from './episode-bar.component';
import {EpisodeBarsComponent} from './episode-bars.component';
//
// interface ExportColumn {
//   title: string;
//   dataKey: string;
// }
interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-assignments.dailysnapshot',
  imports: [
    FormsModule,
    Toast,
    Button,
    DatePicker,
    FloatLabel,
    ProgressSpinner,
    Toolbar,
    PickList,
    Panel,
    TableModule,
    MinutesToHoursPipe,
    Tooltip,
    EpisodeBarComponent,
    EpisodeBarsComponent
  ],
  templateUrl: './assignments.dailysnapshot.component.html',
  styleUrl: './assignments.dailysnapshot.component.scss',
  standalone: true,
  providers: [MessageService, MinutesToHoursPipe],
})

export class AssignmentsDailysnapshotComponent implements OnInit {
  public isLoading = false;
  public selectedProvider: MenuItem | undefined;
  public providersList = signal<any[]>([]);
  public results = signal<any[]>([]);
  public rangeDate: Date | undefined;
  public selectedProviders:MenuItem[] = [];
  private allCharts = false;
  public hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
  stringHours: string[];
  cols!: Column[];
  mth!: MinutesToHoursPipe;
  // exportCSV(dataTable: any) {
  //   console.log('foo')
  // }
  //
  // exportColumns: ExportColumn[] = [
  //   <ExportColumn>{
  //     title: 'foo',
  //     dataKey: 'foo'
  //   }
  // ];

  constructor(
    private messageService: MessageService,
    private assignmentsService: AssignmentService,
    private episodeService: EpisodeService,
    private minutesToHoursPipe: MinutesToHoursPipe,
  ) {
    this.mth = minutesToHoursPipe;
    this.stringHours = this.hours.map((num: number) => {
      return num.toString();
    })
  }

  ngOnInit() {
    this.getLists();
  }

  public toggleAllCharts() {
    this.allCharts = !this.allCharts;
    if (!this.results()) {return;}
    for (const row of this.results()) {
      row.showChart = this.allCharts;
    }
  }

  private getLists(): void {
    const sources = [
      this.episodeService.selectLists(),
    ];
    forkJoin(sources)
      .pipe(map(([_selects, _assignments,]) => {
        return {
          _selects: _selects
        }
      }))
      .subscribe((allSources: any) => {
        this.providersList.set(allSources._selects.providers.map((row: any) => {
          row.searchable = row.last + ', ' + row.first;
          return row;
        }));
      });
  }

  public refresh() {
    if (this.selectedProviders.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Providers', detail: 'Please select providers.' });
      return;
    }
    if (!this.rangeDate) {
      this.messageService.add({ severity: 'warn', summary: 'No Date', detail: 'Please select a date.' });
      return;
    }
    const providers: string[] = this.selectedProviders.map((item: MenuItem) => {
      return item['_id'];
    });
    this.isLoading = true;
    this.assignmentsService.dailySnapshot(providers, this.rangeDate)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((data: any) => {
        this.isLoading = false;
        if (data.result.length) {
          const row = data.result[0];
          const keys = Object.keys(row);
          this.cols = keys
            .filter((item: any) => {
              return true;
            })
            .map((item: any) => {
            return <Column>{
              field: item,
              header: item
            }
          })
        }
        this.results.set(data.result);
      });

  }

  onBarsEpisode($event: any) {
    this.episodeService.episodeRow = $event;
  }

  onExport($event: any) {
    let d = $event.data;
    if (!d) {
      return '';
    }
    switch ($event.field) {
      case 'count':
      case 'countSevenToFour':
      case 'countFourToSeven':
      case 'countSevenToEleven':
      case 'countElevenToSeven':
        d = this.mth.transform(d);
        break;
      case 'countPreSeven':
        d = 'not used';
        break;
      case 'date':
        const nd = new Date(d);
        d =  (nd.getMonth() + 1) + '/' + nd.getDate() + '/' + nd.getFullYear();
        break;
      case 'first':
      case 'last':
        const nd2 = new Date(d);
        d =  (nd2.getMonth() + 1) + '/' + nd2.getDate() + '/' + nd2.getFullYear() + ' ' + nd2.getHours() + ':' + nd2.getMinutes();
        break;
      case 'episodes':
        d = d.map((e: any) => { return e.episodeId;})
        break;
        default:
          //do nothing
    }
    return d;
  }
}
