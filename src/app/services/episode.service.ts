import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from './app.service';
import {EpisodeOverviewResult} from '../models/episode-overview';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  apiUrl = 'http://localhost:8080/api/';

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {}

  overview(selectedRange: string, dates: Date[] | undefined, groupBy: string) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
      return this.http.post<EpisodeOverviewResult>(this.apiUrl + 'reporting/episodes/overview', {selectedRange, start, end, groupBy}, this.appService.basicHeaders);
  }
}
