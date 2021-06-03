import { FormsModule } from '@angular/forms';
import { ZoroModule } from './../zoro/zoro.module';
import { DepartmentvisitComponent } from './../departmentvisit/departmentvisit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsComponent } from '../departments/departments.component';
import { DepartmentsmodRoutingModule } from '../departmentsmod/departmentsmod-routing.module';

@NgModule({
  declarations: [
    DepartmentsComponent,
    DepartmentvisitComponent
  ],
  imports: [
    CommonModule,
    DepartmentsmodRoutingModule,
    ZoroModule,
    FormsModule
  ]
})
export class DepartmentsmodModule { }
