import { HttpErrorResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { FilterService } from 'src/app/service/filter.service';
import { IdentifierService } from 'src/app/service/identifier.service';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';

@Component({
  selector: 'app-questionnaire-identifiers',
  templateUrl: './questionnaire-identifiers.component.html',
  styleUrls: ['./questionnaire-identifiers.component.css'],
})
export class QuestionnaireIdentifiersComponent implements OnInit {
  public qIdentifierState$: Observable<AppState<Questionnaire>>;
  public decodedFilter$: Observable<AppState<Record<string,string>>>;
  public filter:string;
  public filterIsPresent:boolean;
  public questionnaireId:number;
  public link:string;
  private currentYear: number=new Date().getFullYear();
  readonly DataState = DataState;
  public days:number =0;
  public hours:number =1;
  public minutes:number =0;
  public enabled:boolean = true;
  private qName:string;

  

  @Output() newFilterEvent = new EventEmitter<string>();

  constructor(
    private questionnaireService: QuestionnaireService,
    private identifierService: IdentifierService,
    private filterService:FilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
      this.filter=params['filter'];
    });
    this.initiateIdentifiers(this.questionnaireId);

    if(this.filter!= undefined){
      this.filterIsPresent = true;
      this.decodeFilter(this.filter);
      this.link = location.origin +"/quest?id="+this.questionnaireId+"&filter="+ this.filter;
    }
  }

  public setFilter(form:NgForm){
    let values = Object.values(form.value);
    values.sort((n1,n2) =>{
      if (n1 > n2) {
        return 1;
    }

    if (n1 < n2) {
        return -1;
    }
    return 0;
    })
    this.filter =this.currentYear+","+values.join(",");
    console.log(this.filter);
    this.createFilter();
   
  }

  public copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  checkValue(event: any){
    console.log(event);
    if(this.filter!=undefined){
      this.setEnabled(event);
    }
 }

  private initiateIdentifiers(id: number) {
    this.qIdentifierState$ = this.questionnaireService
      .questionnaireIdentifiers$(id)
      .pipe(
        map((response) => {
          this.qName= response.name;
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  private setEnabled(enabled:number){
    this.filterService.switchEnabled(this.filter, enabled)
    .subscribe(
      (response:any)=>{
        console.log('enabled changed');
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    )
  }

  private createFilter(){

    //this.days*86400000 + this.hours*3600000 + this.minutes*60000;
    var active = new Date().getTime() + this.days*86400000 + this.hours*3600000 + this.minutes*60000;
    console.log('ora'+ active );

    this.filterService.addFilter(
      {
        activeFor:new Date().getTime() + this.days*86400000 + this.hours*3600000 + this.minutes*60000,
        questionnaireId:this.questionnaireId,
        filter:this.filter,
        enabled: this.enabled,
        questionnaireName:this.qName
      }
    ).subscribe(
      (response:any)=>{
        console.log(response);
        this.link = location.origin +"/quest?id="+this.questionnaireId+"&filter="+ this.filter;
        this.newFilterEvent.emit(this.filter);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );

  }

  private decodeFilter(filter:string){
    this.decodedFilter$ = this.identifierService
      .decodedFilter$(filter)
      .pipe(
        map((response) => {
          
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}

