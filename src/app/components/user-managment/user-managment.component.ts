import { Identifiers } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppResponse } from 'src/app/objects/interface/app-response';
import { AppState } from 'src/app/objects/interface/app-state';
import { Identifier } from 'src/app/objects/interface/identifier';
import { Teacher } from 'src/app/objects/interface/teacher';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css'],
})
export class UserManagmentComponent implements OnInit {
  public teachersState$: Observable<AppState<AppResponse>>;
  public teacherState$: Observable<AppState<AppResponse>>;
  public addTeacherForm: FormGroup;
  public selectedSubject: string;
  public selectedDepartment: string;

  public subjectsArray: Identifier[] = [];
  public departmentsArray: Identifier[] = [];
  public identifiersSet: boolean = false;
  private identifiers: Identifier[] = [];

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  
  readonly DataState = DataState;

  constructor(
    private genericService: GenericService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setIdentifiers();
    //this.subjectsArray.push({id:0,name:'ANALISI 2',type:'69'})

    this.setTeachers();

    //TODO: to password tha to bazei to backend tixea kai tha to stelnei sto email tou kathigiti
    this.addTeacherForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
      subjects: this.fb.array([]),
      departments: this.fb.array([]),
    });
  }

  onAddTeacherSubmit() {
    this.isLoading.next(true);

    let listofindex = this.addTeacherForm.value.subjects;
    let listofindex2 = this.addTeacherForm.value.departments;
    this.addTeacherForm.value.subjects = this.subjectsArray.filter((a, b) =>
      listofindex.some((j) => b === j)
    );
    this.addTeacherForm.value.departments = this.departmentsArray.filter(
      (a, b) => listofindex2.some((j) => b === j)
    );

    this.genericService
      .$save(this.addTeacherForm.value, '/teacher/add')
      .subscribe(
        (response) => {
          this.isLoading.next(false);
        },
        (error) => {
          this.isLoading.next(false);
        }
      );
  }

  onUpdateTeacherSubmit(){

  }

  public loadTeacher(id:number){
    console.log(id);
    
    this.getTeacher(id);
  }

  public addSubects() {
    let exists = this.subjects().controls.find((control) => {
      return control.value == this.selectedSubject;
    });

    if (
      exists == undefined &&
      this.selectedSubject != undefined &&
      this.selectedSubject != '-1'
    ) {
      this.subjects().push(new FormControl(parseInt(this.selectedSubject)));
    } else {
      console.log('Subject Uparxei eidi');
    }
  }

  public addDepartments() {
    let exists = this.departments().controls.find((control) => {
      return control.value == this.selectedSubject;
    });

    if (
      exists == undefined &&
      this.selectedDepartment != undefined &&
      this.selectedDepartment != '-1'
    ) {
      this.departments().push(
        new FormControl(parseInt(this.selectedDepartment))
      );
    } else {
      console.log('Department Uparxei eidi');
    }
  }

  public removeSubject(subjectIndex: number) {
    let index = this.subjects().controls.findIndex((control) => {
      return control.value == subjectIndex;
    });
    this.subjects().removeAt(index);
  }

  public removeDepartment(departmentIndex: number) {
    let index = this.departments().controls.findIndex((control) => {
      return control.value == departmentIndex;
    });
    this.subjects().removeAt(index);
  }

  onSelectSubjectChange($event) {
    this.selectedSubject = (<HTMLInputElement>$event.target).value;
    console.log(this.selectedSubject);
  }

  onSelectDepartmentChange($event) {
    this.selectedDepartment = (<HTMLInputElement>$event.target).value;
    console.log(this.selectedDepartment);
  }

  subjects(): FormArray {
    return this.addTeacherForm.get('subjects') as FormArray;
  }

  departments(): FormArray {
    return this.addTeacherForm.get('departments') as FormArray;
  }

  private getTeacher(id: number) {
    this.teacherState$ = this.genericService.$one(id, '/teacher/').pipe(
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
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  private setTeachers() {
    this.teachersState$ = this.genericService.$all('/teacher/all').pipe(
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
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  private setIdentifiers() {
    this.genericService.$all('/identifier/all').subscribe(
      (response) => {
        console.log('identifiers received');

        this.identifiers = response.data.identifiers;


        this.subjectsArray = this.identifiers.filter(
          (ident) => ident.type === 'SUBJECT'
        );

        this.departmentsArray = this.identifiers.filter(
          (ident) => ident.type === 'DEPARTMENT'
        );

        this.identifiersSet = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
