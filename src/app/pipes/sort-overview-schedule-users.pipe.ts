import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'sortOverviewScheduleUsers'
})
export class SortOverviewScheduleUsersPipe implements PipeTransform {

  transform(users: any[]): any[] {
    if (!users || !users.length) {
      return [];
    }
    return users.sort((a: any, b:any) => {
      const asort = a._id.lName + a._id.fName;
      const bsort = b._id.lName + b._id.fName;
      return asort.localeCompare(bsort);
    });
  }

}
