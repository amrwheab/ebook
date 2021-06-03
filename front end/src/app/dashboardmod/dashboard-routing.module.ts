import { MainadminGuard } from './../guards/mainadmin.guard';
import { UserdashboardComponent } from './../userdashboard/userdashboard.component';
import { CarouseldashboardComponent } from './../carouseldashboard/carouseldashboard.component';
import { AuthersdashboardComponent } from '../authersdashboard/authersdashboard.component';
import { DepartmentsdashboardComponent } from '../departmentsdashboard/departmentsdashboard.component';
import { BooksdashboardComponent } from '../booksdashboard/booksdashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'admin', component: UserdashboardComponent, canActivate: [MainadminGuard] },
  { path: 'books', component: BooksdashboardComponent },
  { path: 'departments', component: DepartmentsdashboardComponent },
  { path: 'authers', component: AuthersdashboardComponent },
  { path: 'carousel', component: CarouseldashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
