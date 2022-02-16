import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { Identifier } from '../objects/interface/identifier';

@Injectable({
  providedIn: 'root'
})
export class IdentifierService {

  constructor(private http:HttpClient) { }


  identifiers$ = <Observable<Record<string,Identifier[]>>>
  this.http.get<Record<string,Identifier[]>>( config.apiUrl +'/identifiers/all')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('Error occured');
  }
}
