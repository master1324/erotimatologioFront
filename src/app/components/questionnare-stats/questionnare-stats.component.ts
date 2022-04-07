import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, mergeMap, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Filter } from 'src/app/objects/interface/filter';
import { FilterService } from 'src/app/service/filter.service';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'questionnare-stats',
  templateUrl: './questionnare-stats.component.html',
  styleUrls: ['./questionnare-stats.component.css'],
})
export class QuestionnareStatsComponent implements OnInit {
  public filterState$: Observable<AppState<Filter>>;

  private changeHappend = new BehaviorSubject<boolean>(false);
  public changeHappend$ = this.changeHappend.asObservable();

  public questionnaireId: number;
  public filter: string;
  public date: string;
  public enabled: boolean;
  readonly DataState = DataState;
  private filterObject: Filter;
  public reloadInterval = 5000;
  private statsSubscription: Subscription;
  private newFilterSubscription: Subscription;
  public responseDiference: number;
  @Input() parentFilter: string;

  constructor(
    private filterService: FilterService,
    private genericSerivce: GenericService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
      this.filter = params['filter'];
    });
    if (this.filter == undefined) {
      this.filter = this.parentFilter;
    }
    this.getStats();

    this.statsSubscription = timer(0, this.reloadInterval)
      .pipe(mergeMap(async (_) => this.getStats()))
      .subscribe();
  }

  checkValue(event: any) {
    console.log(event);
    this.filterObject.enabled = this.enabled;
    this.updateFilter();
  }

  dateChanged() {
    console.log(this.date);
    this.filterObject.activeFor = Date.parse(this.date);
    this.updateFilter();
  }

  private updateFilter() {
    this.genericSerivce.$update(this.filterObject,'/v2/filter/update/').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
  private getStats() {
    if (this.filterObject == undefined) {
      this.filterState$ = this.filterService
        .filter$(this.filter, this.questionnaireId)
        .pipe(
          map((response) => {
            console.log('trexo 111');

            this.enabled = response.enabled;
            this.date = formatDate(
              response.activeFor,
              'yyyy-MM-ddTHH:mm',
              this.locale
            );
            this.filterObject = response;

            if (response.numOfResponses != this.filterObject.numOfResponses) {
            }

            return {
              dataState: DataState.LOADED,
              appData: response,
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
    } else {
      let filter$ = this.filterService
        .filter$(this.filter, this.questionnaireId)
        .pipe(
          map((response) => {
            console.log('trexo 2 222');

            this.enabled = response.enabled;
            this.date = formatDate(
              response.activeFor,
              'yyyy-MM-ddTHH:mm',
              this.locale
            );

            console.log(
              response.numOfResponses +
                'XXXXX ' +
                this.filterObject.numOfResponses
            );
            if (response.numOfResponses != this.filterObject.numOfResponses) {
              this.responseDiference =
                response.numOfResponses - this.filterObject.numOfResponses;
              this.changeHappend.next(true);
              this.filterState$ = filter$;
            }
            this.filterObject = response;

            return {
              dataState: DataState.LOADED,
              appData: response,
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

      this.newFilterSubscription = filter$.subscribe();
    }
  }

  private setStats() {
    
      return this.genericSerivce
        .$one(0, '/v2/filter', '?filter=' + this.filter)
        .pipe(
          map((response) => {
            this.enabled = response.data.filter.enabled;
            this.date = formatDate(
              response.data.filter.activeFor,
              'yyyy-MM-ddTHH:mm',
              this.locale
            );

            this.filterObject = response.data.filter;
            return {
              dataState: DataState.LOADED,
              appData: response.data.filter,
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

  ngOnDestroy(): void {
    this.statsSubscription.unsubscribe();
    //this.newFilterSubscription.unsubscribe();
  }
}
