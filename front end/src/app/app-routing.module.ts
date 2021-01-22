import { DepartmentsdashboardComponent } from './departmentsdashboard/departmentsdashboard.component';
import { LoginComponent } from './login/login.component';
import { BooksdashboardComponent } from './booksdashboard/booksdashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, children: [
    { path: 'books', component: BooksdashboardComponent },
    { path: 'departments', component: DepartmentsdashboardComponent },
  ]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
