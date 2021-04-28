import { Department } from './../shard/depart';
import { NzModalService } from 'ng-zorro-antd/modal';
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

  departments: Department[] = [];
  departload = false;
  updateDialog = false;
  departNameToUpdate = '';
  departIdToUpdate = '';
  addDialog = false;
  departNameToAdd = '';
  departsObs: Subscription | undefined;

  constructor(private departSer: DepartmentService,
              private message: NzMessageService,
              private modal: NzModalService) { }

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
    // tslint:disable-next-line: deprecation
    this.departSer.updateDepart(data).subscribe(() => {
      // tslint:disable-next-line: no-non-null-assertion
      this.departments.find(ele => ele.id === data.id)!.name = data.name;
      this.message.remove(id);
      this.message.success('updated successfully');
    }, (err) => {
      console.log(err);
      this.message.remove(id);
      this.message.error('some thing went wrong');
    });
  }

  addDepartment(): void {
    this.addDialog = false;
    const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    // tslint:disable-next-line: deprecation
    this.departSer.addDepart(this.departNameToAdd).subscribe((depart: Department) => {
      this.departments.push(depart);
      this.message.remove(id);
      this.message.success('added successfully');
    }, () => {
      this.message.remove(id);
      this.message.error('some thing went wrong');
    });
  }

  showDeleteConfirm(id: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this department?',
      nzContent: '<b style="color: red;">If it has books it won\'t be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteDepart(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  deleteDepart(id: string): void {
    const loading = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    // tslint:disable-next-line: deprecation
    this.departSer.deleteDepart(id).subscribe(res => {
      this.message.remove(loading);
      this.departments = this.departments.filter(ele => ele.id !== id);
      this.message.success(res.message);
    }, () => {
      this.message.remove(loading);
      this.message.error('This Department has books');
    });
  }
}
