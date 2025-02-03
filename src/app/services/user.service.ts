import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {
    this.apiUrl = appService.apiUrl;
  }

  providersList() {
    return this.http.get<any>(this.apiUrl + 'users/clinicians/list', this.appService.basicHeaders);
  }
}
