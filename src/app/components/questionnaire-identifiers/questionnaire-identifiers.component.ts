import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';

@Component({
  selector: 'app-questionnaire-identifiers',
  templateUrl: './questionnaire-identifiers.component.html',
  styleUrls: ['./questionnaire-identifiers.component.css'],
})
export class QuestionnaireIdentifiersComponent implements OnInit {
  public qIdentifierState$: Observable<AppState<Questionnaire>>;
  public filter:string;
  private questionnaireId:number;
  private currentYear: number=new Date().getFullYear();
  readonly DataState = DataState;

  @Output() newFilterEvent = new EventEmitter<string>();

  constructor(
    private questionnaireService: QuestionnaireService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
    });
    this.initiateIdentifiers(this.questionnaireId);
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
    this.newFilterEvent.emit(this.filter);
  }

  private initiateIdentifiers(id: number) {
    this.qIdentifierState$ = this.questionnaireService
      .questionnaireIdentifiers$(id)
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
