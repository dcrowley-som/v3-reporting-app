import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'minutesToHours',
})
export class MintutesToHoursPipe implements PipeTransform {

  transform(minutes: number): string {
    if (!minutes) { return '0'; }
    if (minutes <= 0) { return '0'; }
    const hours = Math.floor((minutes / 60));
    const mins = minutes % 60;
    return hours + ':' + mins;
  }

}
