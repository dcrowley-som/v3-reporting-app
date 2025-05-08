import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'movingAvg'
})
export class MovingAvgPipe implements PipeTransform {

  transform(arr: number[], metric: string = 'SMA', size: number = 1): number[] {
    if (!arr || !metric) {
      return [];
    }

    if (!arr || arr.length < 4) {
      return arr || [];
    }
    if (size > arr.length) {
      size = arr.length;
    }
    let resArr: any[] = [];
    let srcArr = arr.map(val => {
      return Number(val);
    });
    const srcIdx = 0;
    const srcLength = srcArr.length;
    const isSMA = (/SMA/i.test(metric));
    const isWMA = (/WMA/i.test(metric));
    const isEMA = (/EMA/i.test(metric));
    const isSMM = (/SMM/i.test(metric));
    const isSlope = (/Slope/i.test(metric));
    const isBalanced = (/^B/i.test(metric));
    let halfSize = 0;
    if (!isBalanced) {
      // classic moving average (financial)
      if (isSMA) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - size + 1);
          const end = Math.min(srcArr.length, idx + 1);
          val = srcArr.slice(start, end).reduce(function (acc, v) {
            return acc + v;
          }, 0);
          val = val / (end - start);
          resArr.push(val);
        });
      } else if (isWMA) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - size + 1);
          const end = Math.min(srcArr.length, idx + 1);
          const result = srcArr.slice(start, end).reduce(function (acc, v) {
            acc.i++;
            acc.v += acc.i * v;
            acc.d += acc.i;
            return acc;
          }, {i: 0, v: 0, d: 0});
          val = result.v / result.d;
          resArr.push(val);
        });
      } else if (isEMA) {
        const weight = 2 / (size + 1);
        let prevVal = srcArr[0];
        srcArr.forEach(function (val) {
          val = (val - prevVal) * weight + prevVal;
          resArr.push(val);
          prevVal = val;
        });
      } else if (isSMM) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - size + 1);
          const end = Math.min(srcArr.length, idx + 1);
          const half = Math.floor((end - start) / 2);
          val = srcArr.slice(start, end).sort()[half];
          resArr.push(val);
        });
      } else if (isSlope) {
        const stats = srcArr.reduce(function (acc, v, idx, arry) {
          if (idx < srcLength) {
            const next = arry[idx + 1];
            if (next != undefined) {
              acc.diff += next - v;
            }
            acc.sum += v;
          }
          return acc;
        }, {diff: 0, sum: 0});
        const average = stats.sum / srcLength;
        const slope = stats.diff / (srcLength - 1);
        let val = average - slope * (srcLength + 1) / 2;
        srcArr.forEach(function (v) {
          val += slope;
          resArr.push(val);
        });
      }
    } else {
      // balanced moving average (technical)
      halfSize = Math.floor(size / 2);
      // preparation: calculate slope and average for halfSize width on left and right
      const stats = srcArr.reduce(function (acc, v, idx, arry) {
        if (idx <= halfSize) {
          let next = arry[idx + 1];
          if (idx < halfSize && !Number.isNaN(next)) {
            acc.lDiff += next - v;
          }
          acc.lSum += v;
        }
        if (idx >= srcLength - halfSize - 1) {
          let prev = arry[idx - 1];
          if (idx >= srcLength - halfSize && !Number.isNaN(prev)) {
            acc.rDiff += v - prev;
          }
          acc.rSum += v;
        }
        return acc;
      }, {lDiff: 0, lSum: 0, rDiff: 0, rSum: 0});
      const lAverage = stats.lSum / (halfSize + 1);
      const lSlope = stats.lDiff / halfSize;
      const rAverage = stats.rSum / (halfSize + 1);
      const rSlope = stats.rDiff / halfSize;
      const lStartVal = lAverage - lSlope * halfSize / 2;
      const rStartVal = rAverage + rSlope * halfSize / 2 + rSlope;
      // preparation: extend srcArr on left and right side
      // extended array is assumed to be the extension of the slope of halfSize window
      const lSlopeArr = [];
      const rSlopeArr = [];
      for (let i = 0; i < halfSize; i++) {
        lSlopeArr.unshift(lStartVal - (i + 1) * lSlope);
        rSlopeArr.push(rStartVal + (i - 0) * rSlope);
      }
      srcArr = lSlopeArr.concat(srcArr, rSlopeArr);
      if (isSMA) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - halfSize);
          const end = Math.min(srcArr.length, idx + halfSize + 1);
          val = srcArr.slice(start, end).reduce(function (acc, v) {
            return acc + v;
          }, 0);
          val = val / (end - start);
          resArr.push(val);
        });
      } else if (isWMA) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - halfSize + 1);
          const end = Math.min(srcArr.length, idx + 1);
          const result = srcArr.slice(start, end).reduce(function (acc, v) {
            acc.i++;
            acc.v += acc.i * v;
            acc.d += acc.i;
            return acc;
          }, {i: 0, v: 0, d: 0});
          val = result.v / result.d;
          resArr.push(val);
        });
        srcArr.reverse().forEach(function (val, idx) {
          const start = Math.max(0, idx - halfSize + 1);
          const end = Math.min(srcArr.length, idx + 1);
          const result = srcArr.slice(start, end).reduce(function (acc, v) {
            acc.i++;
            acc.v += acc.i * v;
            acc.d += acc.i;
            return acc;
          }, {i: 0, v: 0, d: 0});
          val = result.v / result.d;
          const rIdx = srcArr.length - idx - 1;
          resArr[rIdx] = (resArr[rIdx] + val) / 2;
        });
      } else if (isEMA) {
        const weight = 2 / (halfSize + 1);
        let prevVal = srcArr[0];
        srcArr.forEach(function (val) {
          val = (val - prevVal) * weight + prevVal;
          resArr.push(val);
          prevVal = val;
        });
        prevVal = srcArr[srcArr.length - 1];
        for (let idx = srcArr.length - 1; idx >= 0; idx--) {
          let val = srcArr[idx];
          val = (val - prevVal) * weight + prevVal;
          resArr[idx] = (resArr[idx] + val) / 2;
          prevVal = val;
        }
        ;
      } else if (isSMM) {
        srcArr.forEach(function (val, idx) {
          const start = Math.max(0, idx - halfSize);
          const end = Math.min(srcArr.length, idx + halfSize + 1);
          const half = Math.floor((end - start) / 2);
          val = srcArr.slice(start, end).sort()[half];
          resArr.push(val);
        });
      } else if (isSlope) {
        // return expanded slope on left and right, with gap in middle
        for (let i = 0; i <= halfSize; i++) {
          lSlopeArr.push(lStartVal + i * lSlope);
          rSlopeArr.unshift(rStartVal - (i + 1) * rSlope);
        }
        if (srcLength === 2 * halfSize + 1) {
          resArr = lSlopeArr.concat(rSlopeArr.slice(1));
        } else if (srcLength < 2 * halfSize + 1) {
          resArr = lSlopeArr.slice(0, -1).concat(rSlopeArr.slice(1));
        } else {
          const nullArr: any[] = [];
          for (let i = 0; i < srcLength - (2 * halfSize) - 2; i++) {
            nullArr.push(null);
          }
          resArr = lSlopeArr.concat(nullArr, rSlopeArr);
        }
        return resArr;
      }
      resArr = resArr.slice(halfSize).slice(0, srcLength);
    }
    return resArr;
  }
}
