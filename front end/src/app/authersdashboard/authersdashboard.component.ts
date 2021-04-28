import { NzModalService } from 'ng-zorro-antd/modal';
import { AutherService } from './../services/auther.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auther } from '../shard/auther';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authersdashboard',
  templateUrl: './authersdashboard.component.html',
  styleUrls: ['./authersdashboard.component.scss']
})
export class AuthersdashboardComponent implements OnInit, OnDestroy {

  authers: Auther[] = [];
  authersObs: Subscription | undefined;
  autherload = false;
  updateModal = false;
  addModal = false;
  autherImg: File | null = null;
  uploadButtonText = 'Click to Upload';
  updateModalId = '';
  updateModalName = '';
  updateModalInfo = '';
  page = 1;
  totalAuthors = 10;

  constructor(private autherSer: AutherService,
              private message: NzMessageService,
              private actRoute: ActivatedRoute,
              public router: Router,
              private modal: NzModalService) { }

  ngOnInit(): void {
    const page = this.actRoute.snapshot.queryParams.page || '1';
      const search = this.actRoute.snapshot.queryParams.search || '';
      this.authersObs = this.autherSer.getAuthers(page, search).subscribe((data) => {
        this.page = page;
        this.autherload = true;
        this.authers = data.authers;
        this.totalAuthors = Math.floor(parseInt(data.authersCount) * 10 / 8);
      }, err => {
        console.log(err);
        this.autherload = true;
        this.message.error(err.error);
      });
    }

  changeIndex(page: number): void {
    this.router.navigate(['/dashboard/authers'], {
      queryParams: {
        page
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authersObs) {
      this.authersObs.unsubscribe();
    }
  }

  searchInput(inputtext: string): void {
    const page = this.actRoute.snapshot.queryParams.page;
    this.router.navigate([], {queryParams: {
      search: inputtext,
      page
    }});
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt): string => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  arrangeUpdate(id: string): void {
    this.updateModalId = id;
    this.updateModalName = this.authers.find(ele => ele?.id === id)?.name!;
    this.updateModalInfo = this.authers.find(ele => ele?.id === id)?.info!;
    this.updateModal = true;
  }

  onFileLoad(file: File): void {
    this.autherImg = file;
    this.uploadButtonText = this.autherImg.name;
  }

  modifyAuther(form: NgForm): void {
    if (form.invalid) {
      this.message.error('name is required');
    } else {
      if (this.addModal) {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('info', form.value.info);
        formData.append('autherImg', this.autherImg!);

        const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
        this.autherSer.addAuther(formData).subscribe(auther => {
          this.message.remove(id);
          this.message.success('Added successfully');
          this.authers.push(auther);
          form.reset();
          this.addModal = false;
        }, () => {
          this.message.remove(id);
          this.message.error('some thing is wrong with server');
        });
      } else {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('info', form.value.info);
        formData.append('autherImg', this.autherImg!);
        formData.append('id', this.updateModalId);

        const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
        this.autherSer.updateAuther(formData).subscribe((res) => {
          this.message.remove(id);
          this.message.success('Updated successfully');
          const autherModIndex = this.authers.findIndex(ele => ele.id === this.updateModalId);
          this.authers[autherModIndex].name = form.value.name;
          if (form.value.info) {
            this.authers[autherModIndex].info = form.value.info;
          } else {
            this.authers[autherModIndex].info = 'There is no information about this auther';
          }
          if (res.imgPath) {
            this.authers[autherModIndex].imgUrl = res.imgPath;
          }
          form.reset();
          this.updateModal = false;
        }, () => {
          this.message.remove(id);
          this.message.error('some thing is wrong with server');
        });
      }
    }
  }

  showDeleteConfirm(id: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this author?',
      nzContent: '<b style="color: red;">If he/she has books it won\'t be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteAuther(id),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  deleteAuther(id: string): void {
    const loading = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    this.autherSer.deleteAuther(id).subscribe(res => {
      this.message.remove(loading);
      this.authers = this.authers.filter(ele => ele.id !== id);
      this.message.success(res.message);
    }, () => {
      this.message.remove(loading);
      this.message.error('This Author has books');
    })
  }
}
