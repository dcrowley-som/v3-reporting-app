import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from './app.service';
import {EpisodeOverviewResult} from '../models/episode-overview';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private readonly apiUrl: string;
  private casesParamsSubject = new Subject<any>();
  casesParams$: Observable<any> = this.casesParamsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {
    this.apiUrl = appService.apiUrl;
  }

  set casesParams(data: any) {
    this.casesParamsSubject.next(data);
  }

  get topChartOptions() {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          labels: {
            color: 'grey',
            font: {
              weight: 300
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'grey',
            font: {
              weight: 400,
              size: 9
            }
          },
          grid: {
            color: 'lightgray',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: 'grey',
            font: {
              weight: 400,
              size: 9
            }
          },
          grid: {
            color: 'lightgray',
            drawBorder: false
          }
        }
      }
    };
  }

  get dateRanges():any[] {
    return [
      {
        label: 'FY-YTD'
      },
      {
        label: 'CY-YTD'
      }, {
        label: 'Last CY'
      }, {
        label: 'MTD'
      }, {
        label: 'FY24'
      }, { label: 'Custom' }
    ];
  }

  overview(selectedRange: string, dates: Date[] | undefined, groupBy: string) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
      return this.http.post<EpisodeOverviewResult>(this.apiUrl + 'reporting/episodes/overview', {selectedRange, start, end, groupBy}, this.appService.basicHeaders);
  }

  monthly(selectedRange: string, categories: string[], dates: Date[] | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post<EpisodeOverviewResult>(this.apiUrl + 'reporting/episodes/monthly', {selectedRange, categories: { list: categories}, start, end}, this.appService.basicHeaders);
  }

  provider(selectedRange: string, categories: string[],  user: string, dates: Date[] | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post(this.apiUrl + 'reporting/episodes/provider', {selectedRange, user, start, end, categories: { list: categories}}, this.appService.basicHeaders);
  }

  details(selectedRange: string, categories: string[],  user: string | undefined, dates: Date[] | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post(this.apiUrl + 'reporting/episodes/details', {selectedRange, user, start, end, categories: { list: categories}}, this.appService.basicHeaders);
  }

  table(selectedRange: string, categories: string[], dates: Date[] | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post<EpisodeOverviewResult>(this.apiUrl + 'reporting/episodes/table', {selectedRange, categories: { list: categories}, start, end}, this.appService.basicHeaders);
  }

  selectLists() {
    return this.http.get<any>(this.apiUrl + 'reporting/episodes/select-lists', this.appService.basicHeaders);
  }
}
