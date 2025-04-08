import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {
    this.apiUrl = appService.apiUrl;
  }

  unmatched(selectedRange: string, dates: Date[] | undefined) {
    let start = null;
    let end = null;
    if (dates) {
      start = dates[0];
      end = dates[1];
    }
    return this.http.post(this.apiUrl + 'reporting/invoices/unmatched', {selectedRange, start, end}, this.appService.basicHeaders);
  }

}
