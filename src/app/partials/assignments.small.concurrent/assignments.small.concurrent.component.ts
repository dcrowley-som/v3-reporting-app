import {Component, input, linkedSignal} from '@angular/core';
@Component({
  selector: 'app-assignments-small-concurrent',
  imports: [

  ],
  templateUrl: './assignments.small.concurrent.component.html',
  standalone: true,
  styleUrl: './assignments.small.concurrent.component.scss'
})
export class AssignmentsSmallConcurrentComponent {
  public episodes = input<any[]>();

  public concurrents = linkedSignal<any>(() => {
    const res = {
      count: 0,
      minutes: 0,
      concurrentCount: 0,
      concurrentMinutes: 0,
      start: 0,
      stop: 0,
      concurrentCasesArr: <any[]>[]
    };
    if (!this.episodes() || !this.episodes()?.length) {
      return res;
    }
    // for (let i = 0; i < this.episodes()!.length; i++) {
    //   // populate count and minutes
    //   res.count += 1;
    //   res.minutes += this.episodes()![i].anMinutes;
    //   // then check concurrent with all after
    //   const a = new Date(this.episodes()![i].anesStart).getTime();
    //   const b = new Date(this.episodes()![i].anesStop).getTime();
    //   // console.log('test ' + i);
    //   for (let j = i + 1; j < this.episodes()!.length; j++) {
    //     // console.log('inner test: ' + j);
    //     const c = new Date(this.episodes()![i].anesStart).getTime();
    //     const d = new Date(this.episodes()![i].anesStop).getTime();
    //     const conc: number = Math.min(b, d) - Math.max(a, c);
    //     if (conc > 0) {
    //       res.concurrentCasesArr.push({
    //         a: i,
    //         b: j,
    //         minutes:  (conc / (1000 * 60))
    //       });
    //     }
    //   }
    // }
    // return res;

    const starts: number[] = this.episodes()!.map((row: any) => { return new Date(row.anesStart).getTime()});
    const stops: number[] = this.episodes()!.map((row: any) => { return new Date(row.anesStop).getTime()});
    const start = Math.min(...starts);
    res.start = start;
    const stop = Math.max(...stops);
    res.stop = stop;
    const size = stop - start;
    for (const episode of this.episodes()!) {
    const anesStart = new Date(episode.anesStart).getTime();
    const anesStop = new Date(episode.anesStop).getTime();
    const anesSize = anesStop - anesStart;
    const startSize = anesStart - start;
    const sizePerc = anesSize/size;
    const startPerc = startSize/size;
      res.concurrentCasesArr.push({
        episodeId: episode.episodeId,
        anMinutes: episode.anMinutes,
        anesStart,
        anesStop,
        anesSize,
        startSize,
        // sizePerc: ((1 - (sizePerc)) * 100).toFixed(0),
        sizePerc: (sizePerc * 100).toFixed(0),
        startPerc: (startPerc * 100).toFixed(0),
      });
    }
    return res;
  });
}
