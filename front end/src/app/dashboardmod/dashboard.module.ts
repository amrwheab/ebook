import { ZoroModule } from './../zoro/zoro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BooksdashboardComponent } from '../booksdashboard/booksdashboard.component';
import { ModifybookComponent } from '../modifybook/modifybook.component';
import { DepartmentsdashboardComponent } from '../departmentsdashboard/departmentsdashboard.component';
import { AuthersdashboardComponent } from '../authersdashboard/authersdashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { CarouseldashboardComponent } from '../carouseldashboard/carouseldashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BooksdashboardComponent,
    ModifybookComponent,
    DepartmentsdashboardComponent,
    AuthersdashboardComponent,
    CarouseldashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ZoroModule
  ]
})
export class DashboardModule { }
