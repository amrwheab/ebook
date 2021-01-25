import { AutherService } from './../services/auther.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auther } from '../shard/auther';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-authersdashboard',
  templateUrl: './authersdashboard.component.html',
  styleUrls: ['./authersdashboard.component.scss']
})
export class AuthersdashboardComponent implements OnInit, OnDestroy {

  authers: Auther[] = [];
  authersObs: Subscription;
  autherload = false;
  updateModal = false;
  addModal = false;
  autherImg: File = null;
  uploadButtonText = 'Click to Upload';
  updateModalId = '';
  updateModalName = '';
  updateModalInfo = '';

  constructor(private autherSer: AutherService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.authersObs = this.autherSer.getAuthers().subscribe((authers: Auther[]) => {
      this.autherload = true;
      this.authers = authers;
    }, err => {
      this.autherload = true;
      this.message.error(err);
    });
  }

  ngOnDestroy(): void {
    if (this.authersObs) {
      this.authersObs.unsubscribe();
    }
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt): string => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  arrangeUpdate(id: string): void {
    this.updateModalId = id;
    this.updateModalName = this.authers.find(ele => ele.id === id).name;
    this.updateModalInfo = this.authers.find(ele => ele.id === id).info;
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
        formData.append('autherImg', this.autherImg);

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
        formData.append('autherImg', this.autherImg);
        formData.append('id', this.updateModalId);

        const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
        this.autherSer.updateAuther(formData).subscribe((imgPath) => {
          this.message.remove(id);
          this.message.success('Updated successfully');
          const autherModIndex = this.authers.findIndex(ele => ele.id === this.updateModalId);
          this.authers[autherModIndex].name = form.value.name;
          if (form.value.info) {
            this.authers[autherModIndex].info = form.value.info;
          } else {
            this.authers[autherModIndex].info = 'There is no information about this auther';
          }
          if (imgPath !== 'updated successfully') {
            this.authers[autherModIndex].imgUrl = imgPath;
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

}
