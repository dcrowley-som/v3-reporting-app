import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'minutesToHours',
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(minutes: number): string {
    if (!minutes) { return '0'; }
    if (minutes <= 0) { return '0'; }
    const hours = Math.floor((minutes / 60));
    const mins = minutes % 60;
    const hStr = hours.toString().length === 1 ? '0' + hours : hours;
    const mStr = mins.toString().length === 1 ? '0' + mins : mins;
    return hStr + ':' + mStr;
  }

}
