import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'episodeMonthlyColumn'
})
export class EpisodeMonthlyColumnPipe implements PipeTransform {

  transform(obj: any): string {
    if (!obj) { return ''; }
    return obj._id.month + '/' + obj._id.year;
  }

}
