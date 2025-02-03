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
}
