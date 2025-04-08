import {AfterViewInit, Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {EpisodeService} from '../../services/episode.service';
import {AssignmentService} from '../../services/assignment.service';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {ProgressSpinner} from 'primeng/progressspinner';
import {DatePipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {
  AssignmentsSmallConcurrentComponent
} from '../../partials/assignments.small.concurrent/assignments.small.concurrent.component';

@Component({
  selector: 'app-assignments.provider',
  imports: [
    Select,
    Toast,
    Toolbar,
    FormsModule,
    Button,
    DatePicker,
    FloatLabel,
    ProgressSpinner,
    DatePipe,
    Panel,
    TableModule,
    Tag,
    AssignmentsSmallConcurrentComponent
  ],
  templateUrl: './assignments.provider.component.html',
  standalone: true,
  styleUrl: './assignments.provider.component.scss',
  providers: [MessageService]
})
export class AssignmentsProviderComponent implements OnInit, AfterViewInit {
  private queryParams: any | undefined;
  public providerParam: string = '';
  public selectedProvider: MenuItem | undefined;
  isLoading = false;
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  public providersList = signal<any[]>([]);
  public rows = signal<any[]>([]);
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private episodeService: EpisodeService,
    private assignmentService: AssignmentService
  ) {
  }

  ngOnInit() {
    this.dateRanges = this.episodeService.dateRanges;
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });
    this.getProviders();
  }

  ngAfterViewInit(): void {
    if (!this.queryParams) {
      this.showProviderError();
    }
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  private showProviderError() {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Provider',
      detail: 'Please select a provider.'
    });
  }

  private getProviders(): void {
    this.episodeService.selectLists().subscribe((data: any) => {
      this.providersList.set(data.providers.map((row: any) => {
        row.searchable = row.last + ', ' + row.first;
        return row;
      }));
      if (this.queryParams) {
        if (!this.selectedProvider) {
          this.selectedDateRange = this.episodeService.dateRanges[0];
        }
      }
      this.refresh();
     });
  }

  refresh() {
    if (!this.selectedProvider) {
      if (this.queryParams && this.queryParams.providerId) {
        const found = this.providersList().find((item: any) => {
          return item._id === this.queryParams.providerId;
        });
        if (found) {
          this.selectedProvider = found;
        }
      } else if (!this.queryParams || !this.queryParams.provider) {
        this.showProviderError();
        return;
      }
    }
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
    let first: string | undefined;
    let last: string | undefined
    if (this.queryParams.provider && !this.selectedProvider) {
      const spl: string[] = this.queryParams.provider.split("__");
      first = spl[0];
      last = spl[1];
    }
    let id = (this.selectedProvider ? this.selectedProvider['_id'] : undefined)
    this.isLoading = true;
    this.assignmentService.provider(this.selectedDateRange!.label as string, this.rangeDates!, id, first, last).subscribe((data: any) => {
      this.isLoading = false;
      if (!this.selectedProvider && data.result.length) {
        const found = this.providersList().find((item: any) => {
          return item._id === data.result[0]._id.user;
        });
        if (found) {
          this.selectedProvider = found;
        }
      }
      this.rows.set(data.result);
    })
  }

  onCase(episode: any) {
    this.episodeService.episodeRow = episode;
  }

}
