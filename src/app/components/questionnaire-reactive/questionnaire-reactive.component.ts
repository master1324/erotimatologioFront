import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';
import { ResponseService } from 'src/app/service/response.service';
import { Response } from 'src/app/objects/interface/response';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import $ from 'jquery';



@Component({
  selector: 'app-questionnaire-reactive',
  templateUrl: './questionnaire-reactive.component.html',
  styleUrls: ['./questionnaire-reactive.component.css']
})
export class QuestionnaireReactiveComponent implements OnInit {

  public qBodyState$: Observable<AppState<Questionnaire>>;

  //public questionnaire:Questionnaire;
  public responses:Response[]=[];
  public filter:string;
  public bodyPresent:boolean = false;
  public hasSaved = false;
  public error:string;
  readonly DataState = DataState;
  private questionnaireId:number;
  
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  

  @ViewChild('saved') el:ElementRef


  constructor(
    private questionnaireService: QuestionnaireService,
    private responseService:ResponseService,
    private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.questionnaireId = params['id'];
      this.filter=params['filter'];
    });
    console.log(this.filter);
    if(this.filter!= undefined){
      this.initiateBody(this.questionnaireId,this.filter)
      this.bodyPresent =true;
    }

  }

  public save(){  
    console.log(this.responses); 
    this.isLoading.next(true);
    this.responseService.addResponses(this.responses).subscribe(
      (response:any)=>{
        console.log(response);
        this.showSuccessDiv("Oi apantiseis sas apothilkeutikan me epitixeia");
        this.isLoading.next(false);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
        this.showErrorDiv(error.error.message)
        this.isLoading.next(false);
      }
    );
  }

  getFilter(filter:string){
    console.log(filter);
    this.filter=filter;
    this.bodyPresent=true;
    this.initiateBody(this.questionnaireId,filter);
  }

  public showSuccessDiv(message:string){
    //document.getElementById("saved").style.display='block';
    $("#saved").fadeIn().css("display","inline-block");
    document.getElementById("successMessage").innerHTML = message;
    $('#saved').delay(4000).fadeOut('slow');
  }

  public showErrorDiv(message:string){
    //document.getElementById("saved").style.display='block';
    $("#error").fadeIn().css("display","inline-block");
    document.getElementById("errorMessage").innerHTML = message;
    $('#error').delay(4000).fadeOut('slow');
  }

  

  private initiateBody(id:number,filter:string){
    this.qBodyState$ = this.questionnaireService.questionnaireBody$(id,filter)
    .pipe(
      map(response =>{
        this.responses =this.setResponses(response);
        this.bodyPresent = true;
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
        this.error = error;
        return of({dataState:DataState.ERROR , error})
      })
    );
  }

  private setResponses(questionnaire:Questionnaire):Response[]{
    let responses:Response[]=[];
    questionnaire.questionnaire.forEach((group) =>{
      group.questions.forEach((question) =>{
          responses.push({
            id:question.responseId,
            question:question,
            response:question.userResponse,
            filter:this.filter
          });       
      });
    });

    return responses;
  }

  

}
