import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireResponse } from 'src/app/objects/interface/questionnaire-response';
import { ResponseService } from 'src/app/service/response.service';

@Component({
  selector: 'app-see-responses',
  templateUrl: './see-responses.component.html',
  styleUrls: ['./see-responses.component.css']
})
export class SeeResponsesComponent implements OnInit {

  public qResponsesState$: Observable<AppState<QuestionnaireResponse[]>>;
  readonly DataState = DataState;

  constructor(private responseService:ResponseService) { }

  ngOnInit(): void {
    this.initiateObservable();
  }
  
 
  public createRecord(questionnaireResponses:QuestionnaireResponse[]):Record<string,QuestionnaireResponse[]>{

    let keys = new Set<string>();

    questionnaireResponses.forEach( qResposne =>{
      //console.log(Object.entries(qResposne.decodedFilter).length);
      //let counter =Object.entries(qResposne.decodedFilter).length;
      //console.log(Object.entries(qResposne.decodedFilter)[counter -1]);
      
      let xd =Object.entries(qResposne.decodedFilter).find(entry=>{
        return entry.includes('YEAR');
      });

      console.log(xd[1])
      
      keys.add(xd[1]);
    })

    console.log(keys);
    

    return null;
  }


  private initiateObservable(){
    this.qResponsesState$ = this.responseService.questionnaireResponses$
    .pipe(
      map(response =>{
        this.createRecord(response);
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
