import { Department } from './../shard/depart';
import { DepartmentService } from './../services/department.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-departmentsdashboard',
  templateUrl: './departmentsdashboard.component.html',
  styleUrls: ['./departmentsdashboard.component.scss']
})
export class DepartmentsdashboardComponent implements OnInit, OnDestroy {

  departsObs: Subscription;
  departments: Department[] = [];
  departload = false;
  updateDialog = false;
  departNameToUpdate = '';
  departIdToUpdate = '';
  addDialog = false;
  departNameToAdd = '';

  constructor(private departSer: DepartmentService, private message: NzMessageService) { }

  ngOnInit(): void {
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

  createMessage(type: string, msg: string): void {
    this.message.create(type, msg);
  }

  openUpdateDialog(name: string, id: string): void {
    this.updateDialog = true;
    this.departNameToUpdate = name;
    this.departIdToUpdate = id;
  }

  updateDepartName(): void {
    const data = {
      id: this.departIdToUpdate,
      name: this.departNameToUpdate
    };
    this.updateDialog = false;
    const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    this.departSer.updateDepart(data).subscribe(() => {
      this.departments.find(ele => ele.id === data.id).name = data.name;
      this.message.remove(id);
      this.message.success('updated successfully');
    }, (err) => {
      this.message.remove(id);
      this.message.error('some thing went wrong');
    });
  }

  addDepartment(): void {
    this.addDialog = false;
    const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    this.departSer.addDepart(this.departNameToAdd).subscribe((depart: Department) => {
      this.departments.push(depart);
      this.message.remove(id);
      this.message.success('added successfully');
    }, () => {
      this.message.remove(id);
      this.message.error('some thing went wrong');
    });
  }
}
