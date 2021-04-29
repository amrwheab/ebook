import { Department } from './../shard/depart';
import { DepartmentService } from './../services/department.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  departsObs: Subscription | undefined;
  departload: boolean = false;
  departments: Department[] = [];

  constructor(private departSer: DepartmentService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.departsObs = this.departSer.getDeparts().subscribe((departs: Department[]) => {
      this.departload = true;
      this.departments = departs;
    }, () => {
      this.departload = true;
    });
  }

}
