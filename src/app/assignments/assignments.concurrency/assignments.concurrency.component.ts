import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {AssignmentService} from '../../services/assignment.service';
import {EpisodeService} from '../../services/episode.service';
import {forkJoin, map} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {Select} from 'primeng/select';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Panel} from 'primeng/panel';
import {Table, TableModule} from 'primeng/table';
import {DatePipe, NgClass} from '@angular/common';
import {CasesParams} from '../../models/cases-params';

@Component({
  selector: 'app-assignments.concurrency',
  imports: [
    FormsModule,
    Toast,
    Toolbar,
    Select,
    FloatLabel,
    Button,
    DatePicker,
    ProgressSpinner,
    Panel,
    TableModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './assignments.concurrency.component.html',
  standalone: true,
  styleUrl: './assignments.concurrency.component.scss',
  providers: [MessageService]
})
export class AssignmentsConcurrencyComponent implements OnInit {
  public isLoading = false;
  public selectedProvider: MenuItem | undefined;
  public selectedAssignment: MenuItem | undefined;
  public providersList = signal<any[]>([]);
  public assignmentsList = signal<any[]>([]);
  public results = signal<any[]>([]);
  public selectedRow: any | undefined;
  public downloadName = '';
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  @ViewChild('ct') myTable: Table | undefined;
  constructor(
    private messageService: MessageService,
    private assignmentsService: AssignmentService,
    private episodeService: EpisodeService,
  ) {
  }

  get totalMinutes(): number {
    if (!this.selectedAssignment) {
      return 0;
    }
    const nineHours = 9 * 60;
    switch (this.selectedAssignment!.label) {
      case 'GORDay':
        return nineHours;
    }
    return nineHours;
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  ngOnInit() {
    this.dateRanges = this.episodeService.dateRanges;
    this.selectedDateRange = this.dateRanges[0];
    this.getLists();
  }

  private getLists(): void {
    const sources = [
      this.episodeService.selectLists(),
      this.assignmentsService.assignmentsList()
    ];
    // this.episodeService.selectLists().subscribe((data: any) => {
    //   this.providersList.set(data.providers.map((row: any) => {
    //     row.searchable = row.last + ', ' + row.first;
    //     return row;
    //   }));
    //   this.refresh();
    // });
    forkJoin(sources)
      .pipe(map(([_selects, _assignments,]) => {
        return {
          _selects: _selects,
          _assignments: _assignments
        }
      }))
      .subscribe((allSources: any) => {
          this.providersList.set(allSources._selects.providers.map((row: any) => {
            row.searchable = row.last + ', ' + row.first;
            return row;
          }));
          this.assignmentsList.set(allSources._assignments.result.map((row: any) => {
            return {
              id: row._id,
              label: row._id
            }
          }));
      });
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
    if (!this.selectedProvider) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Parameter', detail: 'Please select a provider.' });
      return;
    }
    if (!this.selectedAssignment) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Parameter', detail: 'Please select an assignment.' });
      return;
    }
    this.isLoading = true;
    this.downloadName = this.selectedProvider!.label + ' ' + this.selectedDateRange!.label;
    // @ts-ignore
    this.assignmentsService.concurrency(this.selectedDateRange!.label, this.rangeDates, this.selectedProvider!._id, this.selectedAssignment!.label)
      .subscribe((data: any) => {
        this.isLoading = false;
        this.results.set(data.result);
      });
  }

  onRowSelect($event: any) {
    this.episodeService.casesParams = <CasesParams>{
      selectedRange: 'Custom',
      dates: [$event.data.date, $event.data.date],
      categories: [],
      user: this.selectedProvider!['_id']
    };
  }

}
