import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsesAddedService {

  private source = new BehaviorSubject(-1);
  public currentId = this.source.asObservable();

  constructor() { }

  responseAddedAt(questionnaireId:number){
    
    this.source.next(questionnaireId);
    console.log(this.currentId + "FROM SERVICE");
  }


}
