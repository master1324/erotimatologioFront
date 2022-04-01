import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Filter } from 'src/app/objects/interface/filter';
import { FilterService } from 'src/app/service/filter.service';

@Component({
  selector: 'questionnare-stats',
  templateUrl: './questionnare-stats.component.html',
  styleUrls: ['./questionnare-stats.component.css'],
})
export class QuestionnareStatsComponent implements OnInit {
  public filterState$: Observable<AppState<Filter>>;
  public questionnaireId: number;
  public filter: string;
  public date: string;
  public enabled: boolean;
  readonly DataState = DataState;
  private filterObject:Filter;
  @Input() parentFilter: string;

  constructor(
    private filterService: FilterService,
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
  }

  checkValue(event: any) {
    console.log(event);
    this.filterObject.enabled= this.enabled;
    this.updateFilter();
  }

  dateChanged() {
    console.log(this.date);
    this.filterObject.activeFor = Date.parse(this.date);
    this.updateFilter();
  }

  private updateFilter(){
    this.filterService.updateFilter(this.filterObject)
    .subscribe(
      (response:any)=>{
        console.log(response);
        
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }

  // public getFilter(filter: string) {
  //   console.log(filter + 'apo ASIDE');
  //   this.filter = filter;
  // }

  private getStats() {
    this.filterState$ = this.filterService
      .filter$(this.filter, this.questionnaireId)
      .pipe(
        map((response) => {
          this.enabled = response.enabled;
          this.date = formatDate(response.activeFor,'yyyy-MM-ddTHH:mm',this.locale)
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
  }
}
