import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'coloredPercChange',
})
export class ColoredPercChangePipe implements PipeTransform {

  transform(prev: number, curr: number, colored = false): string | number {
    if (!prev || prev === 0) {
      return '';
    }
    if (!curr || curr === 0) {
      return '';
    }
    const diff = curr - prev;
    const perc = (diff/prev) * 100;
    if (colored) {
      if (perc > 0) {
        return '<span class="font-bold text-green-700">' + perc.toFixed(2) + '</span>';
      } else if (perc < 0) {
        return '<span class="font-bold text-red-700">' + perc.toFixed(2) + '</span>';
      } else {
        return perc.toFixed(2);
      }
    } else {
      return perc.toFixed(2);
    }
    // return '';
  }

}
