import { LoginComponent } from './../login/login.component';
import { ZoroModule } from './../zoro/zoro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from '../signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ZoroModule,
    ReactiveFormsModule
  ],
  exports: [
    SignupComponent,
    LoginComponent
  ]
})
export class AuthModule { }
