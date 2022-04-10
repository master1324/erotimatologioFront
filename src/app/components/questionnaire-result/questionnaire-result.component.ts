import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';
import { QuestionnareStatsComponent } from '../questionnare-stats/questionnare-stats.component';
import $ from 'jquery';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'app-questionnaire-result',
  templateUrl: './questionnaire-result.component.html',
  styleUrls: ['./questionnaire-result.component.css'],
})
export class QuestionnaireResultComponent implements OnInit {
  public qResultState$: Observable<AppState<Questionnaire>>;
  public resultIsPresent: boolean = false;
  private questionnaireId: number;
  public filter:string;
  readonly DataState = DataState;
  private changeHappendSubscription:Subscription;
  private isFirstTime:boolean =true;

  @ViewChild(QuestionnareStatsComponent) child;

  constructor(
    private questionnaireService: QuestionnaireService,
    private genericService:GenericService,
    private route: ActivatedRoute
  ) {


  }

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

  ngAfterViewInit() {

    if(this.resultIsPresent){
      this.changeHappendSubscription=this.child.changeHappend$.subscribe(
        (response) =>{
          if(response){
            this.showChangeHappendDiv("Προστεθήκαν " + this.child.responseDiference + " απαντήσεις")
            this.initiateBody(this.questionnaireId,this.filter)
          }
        }
      )
    }  
  }

  showChangeHappendDiv(message:string){
    $("#change").fadeIn().css("display","inline-block");
    document.getElementById("successMessage").innerHTML = message;
    $('#change').delay(4000).fadeOut('slow');
  }

  public getFilter(filter:string){
    console.log(filter+'apo parentntntntn');   
    this.initiateBody(this.questionnaireId,filter);
    this.filter = filter;
    this.resultIsPresent = true;

    //alagi gia na doulebi kai sta dio states
    if(this.qResultState$ == undefined){
      this.changeHappendSubscription=this.child.changeHappend$.subscribe(
        (response) =>{
          if(response){
            this.showChangeHappendDiv("Προστεθήκαν " + this.child.responseDiference + " απαντήσεις")
            if(!this.isFirstTime){
              this.initiateBody(this.questionnaireId,this.filter)
              this.isFirstTime =false;
            }
          }
        }
      )
    }
    

  }

  private initiateBody(id: number, filter: string) {
    this.qResultState$ = this.genericService.$one(id,'/v2/quest/','/results?filter='+filter)
      .pipe(
        map((response) => {
          this.resultIsPresent = true;       
          return {
            dataState: DataState.LOADED,
            appData: response.data.results,
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

  ngOnDestroy(): void{
    if(this.changeHappendSubscription != undefined){
      this.changeHappendSubscription.unsubscribe();
    }  
  }
}
