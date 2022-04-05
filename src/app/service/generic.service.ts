import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { AppResponse } from '../objects/interface/app-response';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http:HttpClient) { }

  $all = (url:string) => <Observable<AppResponse>>
  this.http.get<AppResponse>(config.apiUrl+url).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $one =(id:number,url:string) => <Observable<AppResponse>>
  this.http.get<AppResponse>(config.apiUrl+url+id).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $save = (data:any,url:string)=><Observable<AppResponse>>
  this.http.post<any>(config.apiUrl+url, data).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $update = (data:any,url:string)=><Observable<AppResponse>>
  this.http.put<any>(config.apiUrl+url, data).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $delete = (url:string)=><Observable<AppResponse>>
  this.http.delete<any>(config.apiUrl+url).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(error.error.message);
  }
}
