import {Component, linkedSignal, OnDestroy, OnInit, signal} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Toolbar} from 'primeng/toolbar';
import {Toast} from 'primeng/toast';
import {AssignmentService} from '../../services/assignment.service';
import {finalize, forkJoin, map, take} from 'rxjs';
import {MultiSelect} from 'primeng/multiselect';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {DialogService, DynamicDialogModule, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AssignmentsCalendarEventModalComponent} from './assignments.calendar.event-modal.component';

@Component({
  selector: 'app-assignments.calendar',
  imports: [
    FullCalendarModule,
    ProgressSpinner,
    Toolbar,
    Toast,
    MultiSelect,
    FormsModule,
    Button,
    DynamicDialogModule
  ],
  templateUrl: './assignments.calendar.component.html',
  standalone: true,
  providers: [MessageService, DialogService],
})
export class AssignmentsCalendarComponent implements OnInit, OnDestroy {

  calEventModalRef: DynamicDialogRef | undefined;

  private colors: string[] = [
    '#193773',
    '#466fa6',
    '#84a9bf',
    '#f2c1ae',
    '#f28379',
    '#c17779',
    '#fdb7b9',
    '#f7e3db',
    '#badfd7',
    '#60bfc1',
    '#281942',
    '#d6d8d7',
    '#c3c5c4',
    '#5697ad',
    '#b2b2b2'
  ];
  public selectedSchedules: any[] = [];
  public selectedANames: any[] = [];
  public scheduleList: any[] = [];
  public aNameList = signal<any[]>([]);
  public isLoading = false;
  public calendarOptions = signal<CalendarOptions>({
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    datesSet: this.onDatesSet.bind(this),
    eventClick: this.onEventClick.bind(this),
    dateClick: this.onDateClick.bind(this),
  });
  public calEvents: any[] = [];
  public filteredEvents = signal<any[]>([]);

  onDatesSet(dateInfo: any) {
    this.fetchData(dateInfo.start, dateInfo.end);
  }

  constructor(
    private assignmentService: AssignmentService,
    private messageService: MessageService,
    public dialogService: DialogService,
  ) {
  }

  public refresh() {
    if (this.selectedSchedules.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Schedule', detail: 'Please select schedules.' });
      return;
    }
    if (this.selectedANames.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Assignments', detail: 'Please select assignments.' });
      return;
    }
    const testList = this.selectedANames.map(item => item.label);
    const getColorForAName = (aName: string): string => {
      const index = testList.findIndex((item: string) => {
        return item === aName;
      });
      const l = this.colors.length;
      let color = 'red';
      if (index < l) {
        color = this.colors[index];
      } else if (index < (l*2)) {
        color = this.colors[l - index];
      } else if (index > (l*3)){
        color = this.colors[(l*2) - index];
      }
      return color;
    }
    this.filteredEvents.set(
      this.calEvents.filter((item: any) => {
        return testList.indexOf(item.aName) >= 0;
      })
        .map((item: any, index: number) => {
          const color = getColorForAName(item.aName);
          return {
            title: item.aName + ' - ' + item.assignments.length,
            allDay: true,
            start: item.date,
            editable: false,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
              assignments: item.assignments,
              schedule: item.schedule
            }
          }
        })
    );
  }

  ngOnInit() {

  }

  public onSchedules() {
    const testList = this.selectedSchedules.map((item: any) => item.label);
    const aNames: string[] = this.calEvents.filter((item: any) => {
      return testList.indexOf(item.schedule) >= 0;
    }).map((row: any) => {
      return row.aName;
    });
    this.selectedANames = [];
    this.aNameList.set([...new Set(aNames)].map((item: string) => { return {label: item }}));
  }

  public onANames() {
    // console.log(this.selectedANames);
  }

  public clear() {
    this.selectedSchedules = [];
    this.selectedANames = [];
    this.filteredEvents.set([]);
  }

  private onDateClick(e: any) {
    console.log(e)
  }

  private onEventClick(e: any) {
    const date = e.event._instance.range.end;
    const ev = e.event._def;
    const title = ev.title;
    this.calEventModalRef = this.dialogService.open(AssignmentsCalendarEventModalComponent, {
      inputValues: {
        calEvent: {
          assignments: ev.extendedProps.assignments,
          date: date,
          schedule: ev.extendedProps.schedule
        },
      },
      header: title,
      focusOnShow: false,
      modal: true,
      closable: true,
      closeOnEscape: true,
    })
  }

  private fetchData(start: Date, end: Date) {
    this.isLoading = true;
    const sources = [
      this.assignmentService.assignmentsLimitedList(),
      this.assignmentService.calendar(start, end)
    ];
    forkJoin(sources)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .pipe(map(([_list, _rows,]) => {
        return {
          _list: _list,
          _rows: _rows,
        }
      }))
      .subscribe((sourcesData: any) => {
        this.scheduleList = sourcesData._list.result
          .map((row: any) => {
            return { label: row };
          });
        this.calEvents = sourcesData._rows.result;
        this.refresh();
      })
  }

  ngOnDestroy() {
    if (this.calEventModalRef) {
      this.calEventModalRef.close();
    }
  }
}
