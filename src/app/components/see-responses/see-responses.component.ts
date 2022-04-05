import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireResponse } from 'src/app/objects/interface/questionnaire-response';
import { Test } from 'src/app/objects/interface/test';
import { ResponseService } from 'src/app/service/response.service';

@Component({
  selector: 'app-see-responses',
  templateUrl: './see-responses.component.html',
  styleUrls: ['./see-responses.component.css']
})
export class SeeResponsesComponent implements OnInit {

  public qResponsesState$: Observable<AppState<Record<string,QuestionnaireResponse[]>>>;
  private response:QuestionnaireResponse[];
  readonly DataState = DataState;
  readonly IdentifierType = IdentifierType;
  public group:string;

  constructor(private responseService:ResponseService) { }

  ngOnInit(): void {
    this.initiateObservable();
  }
  
  groupByValue(value){
    //this.groupBy(this.response,value);
    let obs = new Observable<QuestionnaireResponse[]>(
      subscriber =>{
        subscriber.next(
          this.response
        )
      })

    this.qResponsesState$ = obs.pipe(
      map(response =>{
        return{
          dataState: DataState.LOADED,
          appData: this.groupBy(response,value)
        } 
      }),
      startWith({
        dataState: DataState.LOADING
      }),
      catchError((error:string)=>{
        console.log(error);
        return of({dataState:DataState.ERROR , error})
      })
    )
  }
 
  public groupBy(questionnaireResponses:QuestionnaireResponse[],value):Record<string,QuestionnaireResponse[]>{

    let keys = new Set<string>();
    let record:Record<string,QuestionnaireResponse[]>={}

    questionnaireResponses.forEach( qResposne =>{
      
      let key =Object.entries(qResposne.decodedFilter).find(entry=>{
        return entry.includes(value);
      });

      console.log(key[1])
      
      keys.add(key[1]);
      //record[key[1]].push(qResposne);
    })

    keys.forEach(key=>{
      let values:QuestionnaireResponse[]

      values=questionnaireResponses.filter(qResponse =>{
         return Object.entries(qResponse.decodedFilter).some(entry =>{
          return entry.includes(key);
        });
        
      });
      console.log(values.length);
      console.log(values);
      record[key] = values;
    });
    console.log(record);
    

    return record;
  }


  private initiateObservable(){
    this.qResponsesState$ = this.responseService.questionnaireResponses$
    .pipe(
      map(response =>{
        this.response = response;
        return{
          dataState: DataState.LOADED,
          appData: this.groupBy(response,'YEAR')
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
