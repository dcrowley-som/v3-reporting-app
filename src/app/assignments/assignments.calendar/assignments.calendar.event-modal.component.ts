import {Component, effect, input} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'assignments-calendar-event-modal',
  template: `
      <div class="mb-2 flex justify-between">
        <div class="me-5 font-bold">
          {{calEvent().date | date: 'shortDate'}}
        </div>
        <div class="font-bold">
          {{calEvent().schedule}}
        </div>
      </div>
      <table class="w-full text-left table-auto min-w-max">
        <thead>
        <tr>
          <th class="p-4 border-2 border-gray-100 bg-gray-50">
            First
          </th>
          <th class="p-4 border-2 border-gray-100 bg-gray-50">
            Last
          </th>
        </tr>
        </thead>
        <tbody>
          @for (ass of calEvent().assignments; track ass._id) {
            <tr>
              <td class="p-4 border-2 border-gray-100">{{ ass.fName }}</td>
              <td class="p-4 border-2 border-gray-100">{{ ass.lName }}</td>
            </tr>
          }
        </tbody>
      </table>
  `,
  imports: [
    DatePipe
  ],
  standalone: true
})
export class AssignmentsCalendarEventModalComponent {
  calEvent = input.required<any>();

  constructor(

  ) {
    // effect(() => {
    //   console.log(this.calEvents());
    // });
  }

}
