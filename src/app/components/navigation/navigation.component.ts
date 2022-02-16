import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Role } from 'src/app/objects/model/role';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {

  isUser$:Observable<AppState<boolean>>;
  isAdmin$:Observable<AppState<boolean>>;

  constructor(private authService: AuthService,router:Router) {
    router.events.subscribe((ev) => {
      this.isUser$ = this.authService.isUser$
    .pipe(
      map(response =>{
        return{
          dataState: DataState.LOADED,
          appData: response
        }
      }),
      startWith({
        dataState: DataState.LOADING
      }),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR , error})
      })
    );

    this.isAdmin$ = this.authService.isAdmin$
    .pipe(
      map(response =>{
        return{
          dataState: DataState.LOADED,
          appData: response
        }
      }),
      startWith({
        dataState: DataState.LOADING
      }),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR , error})
      })
    );
    });
  }

  ngOnInit(): void {

    this.isUser$ = this.authService.isUser$
    .pipe(
      map(response =>{
        return{
          dataState: DataState.LOADED,
          appData: response
        }
      }),
      startWith({
        dataState: DataState.LOADING
      }),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR , error})
      })
    );

    this.isAdmin$ = this.authService.isAdmin$
    .pipe(
      map(response =>{
        return{
          dataState: DataState.LOADED,
          appData: response
        }
      }),
      startWith({
        dataState: DataState.LOADING
      }),
      catchError((error:string)=>{
        return of({dataState:DataState.ERROR , error})
      })
    );

  }

  public isLoggedIn():boolean{
    return this.authService.isLoggedIn();
  }

  public logout():void {
    console.log('login out');
    this.authService.logout();
  }

  
  
  

}
