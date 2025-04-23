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
    PickList
  ],
  templateUrl: './assignments.dailysnapshot.component.html',
  styleUrl: './assignments.dailysnapshot.component.scss',
  standalone: true,
  providers: [MessageService],
})
export class AssignmentsDailysnapshotComponent implements OnInit {
  public isLoading = false;
  public selectedProvider: MenuItem | undefined;
  public providersList = signal<any[]>([]);
  public results = signal<any[]>([]);
  public rangeDate: Date | undefined;
  public selectedProviders:MenuItem[] = [];

  constructor(
    private messageService: MessageService,
    private assignmentsService: AssignmentService,
    private episodeService: EpisodeService,
  ) {
  }

  ngOnInit() {
    this.getLists();
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
        this.results.set(data.result);
      });

  }
}
