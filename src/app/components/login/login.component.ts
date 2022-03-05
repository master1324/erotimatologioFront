import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any = {
    username: null,
    password: null,
  };

  public error:string;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    console.log(this.f.username.value, this.f.password.value);
    this.authService
      .login({
        username: this.f.username.value,
        password: this.f.password.value,
      })
      .subscribe(
        (success) => {
          if (success) {
            this.router.navigate(['/home']);
          }
        },
        (err) => {          
          this.error = err.error.exception;
        }
      );
  }
}
