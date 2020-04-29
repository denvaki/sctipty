import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {APIResponse} from '../DTOs/apiresponse';
import {catchError, map} from 'rxjs/operators';
import {operators} from 'rxjs/internal/Rx';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
const BASE = 'http://localhost:5999/api/';


@Injectable({
  providedIn: 'root'
})
export class ScriptyApiService {

  constructor(private http: HttpClient) { }

  // #################### SEARCH ####################

  /*
  *   Package search
  */
  packageSearch(packageName: string) {
    const url: string = BASE + 'packageSearch?packageName=' + packageName;
    return this.httpGetRequest(url).pipe( catchError(err => of([])));
  }



  private httpGetRequest(url: string): Observable<any> {
    return this.http.get(url);
  }

}
