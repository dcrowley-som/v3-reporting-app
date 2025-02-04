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
}
