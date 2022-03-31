import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';

@Component({
  selector: 'app-questionnaire-result',
  templateUrl: './questionnaire-result.component.html',
  styleUrls: ['./questionnaire-result.component.css'],
})
export class QuestionnaireResultComponent implements OnInit {
  public qResultState$: Observable<AppState<Questionnaire>>;
  public resultIsPresent: boolean = false;
  private questionnaireId: number;
  private filter:string;
  readonly DataState = DataState;

  constructor(
    private questionnaireService: QuestionnaireService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
      this.filter=params['filter'];
    });
    if(this.filter!= undefined){
      this.initiateBody(this.questionnaireId,this.filter)
      this.resultIsPresent = true;
    }    
  }

  public getFilter(filter:string){
    console.log(filter+'apo parentntntntn');   
    this.initiateBody(this.questionnaireId,filter);
    this.resultIsPresent = true;
  }

  private initiateBody(id: number, filter: string) {
    this.qResultState$ = this.questionnaireService
      .questionnaireResult$(id, filter)
      .pipe(
        map((response) => {
          this.resultIsPresent = true;       
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
        }),
        catchError((error: string) => {
          this.resultIsPresent = true;
          console.log(error);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}
