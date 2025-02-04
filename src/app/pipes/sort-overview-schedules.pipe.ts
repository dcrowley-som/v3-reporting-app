import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'sortOverviewSchedules'
})
export class SortOverviewSchedulesPipe implements PipeTransform {

  transform(schedules: any[]): any[] {
    if (!schedules || !schedules.length) {
      return [];
    }
    return schedules.sort((a: any, b:any) => {
      return a._id.schedule.name.toLowerCase() > b._id.schedule.name.toLowerCase() ? -1 : 1;
    });
  }

}
