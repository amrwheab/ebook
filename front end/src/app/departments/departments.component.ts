import { Department } from './../shard/depart';
import { DepartmentService } from './../services/department.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  departsObs: Subscription | undefined;
  departload = false;
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

  ngOnDestroy(): void {
    if (this.departsObs) {
      this.departsObs.unsubscribe();
    }
  }

}
