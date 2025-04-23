import {Component, OnInit, signal} from '@angular/core';

import {MenuItem, MessageService} from 'primeng/api';
import {EpisodeService} from '../../services/episode.service';
import {InvoiceService} from '../../services/invoice.service';


@Component({
  selector: 'app-unmatched',
  imports: [

  ],
  templateUrl: './unmatched.component.html',
  styleUrl: './unmatched.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class UnmatchedComponent implements OnInit {
  public rows = signal<any[]>([]);
  dateRanges: MenuItem[] | undefined;
  selectedDateRange: MenuItem | undefined;
  rangeDates: Date[] | undefined;
  isLoading = false;

  constructor(
    private episodeService: EpisodeService,
    private messageService: MessageService,
    private invoiceService: InvoiceService,
  ) {
  }

  get customDates():boolean {
    return !(this.selectedDateRange && this.selectedDateRange.label === 'Custom');
  }

  ngOnInit() {
    this.dateRanges = this.episodeService.dateRanges;
    this.selectedDateRange = this.dateRanges[0];
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
    this.isLoading = true;
    this.invoiceService.unmatched(this.selectedDateRange!.label as string, this.rangeDates)
    .subscribe((data: any) => {
      this.isLoading = false;
      this.rows.set(data.result);
    });
  }
}
