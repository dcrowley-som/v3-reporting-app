import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private headers = {
    basic: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor() { }

  public get basicHeaders(): any {
    return { headers: this.headers.basic };
  }
}
