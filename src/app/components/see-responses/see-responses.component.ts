import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { ResponseService } from 'src/app/service/response.service';

@Component({
  selector: 'app-see-responses',
  templateUrl: './see-responses.component.html',
  styleUrls: ['./see-responses.component.css']
})
export class SeeResponsesComponent implements OnInit {

  public qResponsesState$: Observable<AppState<Questionnaire>>;
  readonly DataState = DataState;

  constructor(private responseService:ResponseService) { }

  ngOnInit(): void {
    this.initiateObservable();
  }
  


  private initiateObservable(){
    this.qResponsesState$ = this.responseService.questionnaireResponses$
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
        console.log(error);
        return of({dataState:DataState.ERROR , error})
      })
    );
  }
}
