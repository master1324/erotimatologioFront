import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          Validators.required,
        ],
      ],

      passwords: this.fb.group(
        {
          password: ['', [Validators.required]],
          passwordConfirm: ['', [Validators.required]],
        },
        { validators: this.checkPasswords }
      ),
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);

    this.registerService
      .register({
        username: this.registerForm.controls['username'].value,
        password: this.registerForm.get('passwords.password').value,
        email: this.registerForm.controls['email'].value,
        frontendLink: 'xd',
      } )
      .subscribe(
        (response: any) => {
          console.log(response);
          //this.isLoading.next(false);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          // this.isLoading.next(false);
        }
      );
  }

  private checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('passwordConfirm').value;

    return pass === confirmPass ? null : { notSame: true };
  };
}
