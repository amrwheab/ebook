import { DepartmentvisitComponent } from './../departmentvisit/departmentvisit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentsComponent } from '../departments/departments.component';

const routes: Routes = [
  {path: '', component: DepartmentsComponent},
  {path: ':name', component: DepartmentvisitComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsmodRoutingModule { }
