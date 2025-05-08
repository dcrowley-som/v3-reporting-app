import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private headers = {
    basic: new HttpHeaders({'Content-Type': 'application/json'})
  };
  private env: any;
  constructor() {
    this.env = environment;
  }

  public get basicHeaders(): any {
    return { headers: this.headers.basic };
  }

  public get apiUrl(): string {
    return this.env.apiUrl;
  }

  public get appVersion(): string {
    return this.env.appVersion;
  }

  /**
   * Calculate the simple moving average from stock prices.
   * @param {Array} prices - The list of prices.
   * @param {number} interval - The number of periods to calculate.
   * @return {Array} The list of SMA value.
   */
  public simpleMovingAverage = (prices: number[], interval: number): number[] => {
    let index = interval - 1;
    const length = prices.length + 1;
    let results: number[] = [];

    while (index < length) {
      index = index + 1;
      const intervalSlice = prices.slice(index - interval, index);
      const sum = intervalSlice.reduce((prev, curr) => prev + curr, 0);
      results.push(sum / interval);
    }

    return results;
  }
}
