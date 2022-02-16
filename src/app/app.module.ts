import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RegisterComponent } from './components/register/register.component';
import { SeeResponsesComponent } from './components/see-responses/see-responses.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { CounterDirective } from './objects/directives/counter.directive';
import { QuestionnaireReactiveComponent } from './components/questionnaire-reactive/questionnaire-reactive.component';
import { AddQuestionnaireComponent } from './components/add-questionnaire/add-questionnaire.component';
import { QuestionnaireResultComponent } from './components/questionnaire-result/questionnaire-result.component';
import { QuestionnaireIdentifiersComponent } from './components/questionnaire-identifiers/questionnaire-identifiers.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationComponent,
    RegisterComponent,
    QuestionnaireComponent,
    SeeResponsesComponent,
    QuestionnaireComponent,
    CounterDirective,
    QuestionnaireReactiveComponent,
    AddQuestionnaireComponent,
    QuestionnaireResultComponent,
    QuestionnaireIdentifiersComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
