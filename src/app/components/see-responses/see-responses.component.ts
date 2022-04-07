import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { QuestionnaireResponse } from 'src/app/objects/interface/questionnaire-response';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'app-see-responses',
  templateUrl: './see-responses.component.html',
  styleUrls: ['./see-responses.component.css'],
})
export class SeeResponsesComponent implements OnInit {
  public qResponsesState$: Observable<
    AppState<Record<string, QuestionnaireResponse[]>>
  >;
  private response: QuestionnaireResponse[];
  readonly DataState = DataState;
  readonly IdentifierType = IdentifierType;
  public group: string;

  constructor(private genericService: GenericService) {}

  ngOnInit(): void {
    this.initiateObservable();
  }

  groupByValue(value) {
    //this.groupBy(this.response,value);
    let obs = new Observable<QuestionnaireResponse[]>((subscriber) => {
      subscriber.next(this.response);
    });

    this.qResponsesState$ = obs.pipe(
      map((response) => {
        return {
          dataState: DataState.LOADED,
          appData: this.groupBy(response, value),
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  public groupBy(
    questionnaireResponses: QuestionnaireResponse[],
    value
  ): Record<string, QuestionnaireResponse[]> {
    let keys = new Set<string>();
    let record: Record<string, QuestionnaireResponse[]> = {};

    questionnaireResponses.forEach((qResposne) => {
      let key = Object.entries(qResposne.decodedFilter).find((entry) => {
        return entry.includes(value);
      });
      keys.add(key[1]);
      //record[key[1]].push(qResposne);
    });

    keys.forEach((key) => {
      let values: QuestionnaireResponse[];
      values = questionnaireResponses.filter((qResponse) => {
        return Object.entries(qResponse.decodedFilter).some((entry) => {
          return entry.includes(key);
        });
      });
      record[key] = values;
    });
    return record;
  }

  private initiateObservable() {
    this.qResponsesState$ = this.genericService.$all('/v2/response/all').pipe(
      map((response) => {
        this.response = response.data.qresponses;
        return {
          dataState: DataState.LOADED,
          appData: this.groupBy(response.data.qresponses, 'YEAR'),
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }
}
