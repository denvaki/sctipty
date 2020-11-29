import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {operators} from 'rxjs/internal/Rx';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json, text/plain',
    'Access-Control-Allow-Origin': '*'
  })
};
const BASE = 'http://localhost:5999/api/';


@Injectable({
  providedIn: 'root'
})
export class ScriptyApiService {

  constructor(private http: HttpClient) { }
  public URL:string;
  // #################### SEARCH ####################

  /*
  *   Package search
  */
  packageSearch(distro:string, release:string, packageName: string, arch:string) {
    const packages: string = encodeURI(JSON.stringify([packageName]));
    let url: string = BASE + `search?distro=${distro}&packages=${packages}`;
    if (release){
      url += `&release=${release}`;
    }
    if (arch){
      url += `&arch=${arch}`;
    }
    return this.httpGetRequest(url).pipe(
        catchError(err => {

          console.error(err);
          return of(err);
        })
    );
  }

  getMap(){
    return this.httpGetRequest(BASE + 'map');
  }

  // #################### SCRIPT GENERATION ####################

  /*
  *   Generate script by package names
  */
  generateScript(distro:string, release:string, packageNames: string[], arch:string){
    const packages: string = encodeURI(JSON.stringify(packageNames));
    let url: string = BASE + `generate?distro=${distro}&packages=${packages}`;
    if (release){
      url += `&release=${release}`;
    }
    if (arch){
      url += `&arch=${arch}`;
    }
    this.URL = url;
    return this.httpGetRequest(url, 'text').pipe(
      catchError(err => {

        console.error(err);
        return of(err);
      })
    );
  }

  private httpGetRequest(url: string, responseType?: any): Observable<any> {
    if (!responseType) return this.http.get(url);
    else return this.http.get(url, {responseType})
  }

}
