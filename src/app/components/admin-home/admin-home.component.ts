import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Filter } from 'src/app/objects/interface/filter';
import { FilterService } from 'src/app/service/filter.service';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  filtersState$: Observable<AppState<Filter[]>>;
  readonly DataState = DataState;

  constructor(private filterService:FilterService) { 

  }

  ngOnInit(): void {
    this.getFilters();
  }

  private getFilters(){

    this.filtersState$ = this.filterService.filters$
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
