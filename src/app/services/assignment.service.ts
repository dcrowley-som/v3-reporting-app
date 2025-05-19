import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {
    this.apiUrl = appService.apiUrl;
  }

  overview(dates: Date[]) {
    let start = null;
    let end = null;
      start = dates[0];
      end = dates[1];
    return this.http.post(this.apiUrl + 'reporting/assignments/overview', {start, end}, this.appService.basicHeaders);
  }

  provider(range: string, dates: Date[], user: string | undefined, first: string | undefined, last: string | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post(this.apiUrl + 'reporting/assignments/provider', {selectedRange: range, start, end, user, first, last}, this.appService.basicHeaders);
  }

  assignmentsList() {
    return this.http.get(this.apiUrl + 'reporting/assignments/list', this.appService.basicHeaders);
  }

  assignmentsLimitedList() {
    return this.http.get(this.apiUrl + 'reporting/assignments/limited-list', this.appService.basicHeaders);
  }

  concurrency(range: string, dates: Date[] | undefined, provider: string, assignment: string) {

    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post(this.apiUrl + 'reporting/assignments/concurrency', {selectedRange: range, start, end, user: provider, assignment}, this.appService.basicHeaders);
  }

  dailySnapshot(providers: string[], date: Date) {
    return this.http.post(this.apiUrl + 'reporting/assignments/daily-snapshot', {providers: {list: providers}, date}, this.appService.basicHeaders);
  }

  calendar(start: Date, end: Date) {
    return this.http.post(this.apiUrl + 'reporting/assignments/calendar', {start, end}, this.appService.basicHeaders);
  }
}
