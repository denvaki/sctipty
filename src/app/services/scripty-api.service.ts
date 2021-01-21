import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json, text/plain',
    'Access-Control-Allow-Origin': '*'
  })
};
const BASE = '/api/';


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
  packageSearch(distro:string, release:string, packageName: string, arch:string, mode:string='strict') {
    const packages: string = encodeURI(JSON.stringify([packageName]));
    let url: string = BASE + `search?distro=${distro}&packages=${packages}`;
    if (release){
      url += `&release=${release}`;
    }
    if (arch){
      url += `&arch=${arch}`;
    }
    if(mode){
      url += `&mode=${mode}`;
    }
    
    return this.httpGetRequest(url).pipe(
        catchError(err => {

          console.error(err);
          return of(err);
        })
    );
  }

  fileSearch(distro:string, release:string, fileName: string, arch:string, mode:string='strict') {
    const filenames: string = encodeURI(JSON.stringify([fileName]));
    let url: string = BASE + `filesearch?distro=${distro}&filenames=${filenames}`;
    if (release){
      url += `&release=${release}`;
    }
    if (arch){
      url += `&arch=${arch}`;
    }
    if(mode){
      url += `&mode=${mode}`;
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
    const packages: string = JSON.stringify(packageNames);
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
