import {Component, OnInit, signal} from '@angular/core';
import {AssignmentService} from '../../services/assignment.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Toolbar} from 'primeng/toolbar';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Card} from 'primeng/card';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {SortOverviewSchedulesPipe} from '../../pipes/sort-overview-schedules.pipe';
import {SortOverviewScheduleUsersPipe} from '../../pipes/sort-overview-schedule-users.pipe';
import {Tag} from 'primeng/tag';
import {Router} from '@angular/router';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-assignments.overview',
  imports: [
    Button,
    DatePicker,
    Toolbar,
    FormsModule,
    DatePipe,
    Card,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    SortOverviewSchedulesPipe,
    SortOverviewScheduleUsersPipe,
    Tag,
    ConfirmDialog,
    Toast
  ],
  templateUrl: './assignments.overview.component.html',
  standalone: true,
  styleUrl: './assignments.overview.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class AssignmentsOverviewComponent implements OnInit {
  public rows = signal<any[]>([]);
  rangeDates: Date[] | undefined;

  constructor(
    private assignmentsService: AssignmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {
  }
  ngOnInit() {
    this.setDateRange();
  }

  private setDateRange(): void {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    start.setDate(start.getDate() - 2);
    end.setDate(end.getDate() + 2);
    this.rangeDates = [start, end];
    this.refresh();
  }

  private daysBetweenDates (date1: Date, date2: Date) {
    // Convert dates to milliseconds
    const date1Ms = date1.getTime();
    const date2Ms = date2.getTime();

    // Calculate the difference in milliseconds
    const diffMs = Math.abs(date2Ms - date1Ms);

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / millisecondsPerDay);
  }

  refresh() {
    if (!this.rangeDates || this.rangeDates.length < 2 || this.rangeDates[0] === null || this.rangeDates[1] === null)
    {
      this.messageService.add({ severity: 'warn', summary: 'Missing Parameters', detail: 'start and end dates are required.' });
    }
    const days = this.daysBetweenDates(this.rangeDates![1], this.rangeDates![0]);
    if (days > 4) {
      this.messageService.add({ severity: 'warn', summary: 'Too Many Days', detail: 'Max days is 5.' });
      return;
    }
    this.assignmentsService.overview(this.rangeDates!).subscribe((data: any) => {
      this.rows.set(data.result);
    });
  }

  onProvider(ev: any, user: any) {
    // console.log(user)
    this.confirmationService.confirm({
      target: ev.target as EventTarget,
      message: 'View Details for ' + user._id.fName + ' ' + user._id.lName,
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
        return this.router.navigate(['/', 'assignments', 'provider'], { queryParams: { provider: user._id.fName + '__' + user._id.lName } });
      },
      reject: () => {
        // do nothing
      },
    })
  }
}
