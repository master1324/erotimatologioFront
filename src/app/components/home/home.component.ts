import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DataState } from '../../objects/enum/data-state.enum';
import { AppState } from '../../objects/interface/app-state';
import { Questionnaire } from '../../objects/interface/questionnaire';
import { QuestionnaireService } from '../../service/questionnaire.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  appState$: Observable<AppState<Questionnaire[]>>;
  isUser$:Observable<boolean>;
  isAdmin$:Observable<boolean>;
  readonly DataState = DataState;

  constructor(private questionnaireService:QuestionnaireService,
    private authService:AuthService) { }

  ngOnInit(): void {

    this.appState$ = this.questionnaireService.questionnairs$
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

    this.isUser$ = this.authService.isUser$
    this.isAdmin$= this.authService.isAdmin$

  }

}
