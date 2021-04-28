import { AutherService } from './../services/auther.service';
import { Auther } from '../shard/auther';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BooksService } from './../services/books.service';
import { DepartmentService } from './../services/department.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgForm } from '@angular/forms';
import { Department } from '../shard/depart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modifybook',
  templateUrl: './modifybook.component.html',
  styleUrls: ['./modifybook.component.scss']
})
export class ModifybookComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('bookToEdit') bookToEdit: any;
  @Output() bookAdded = new EventEmitter();
  @Output() updatingBook = new EventEmitter();

  departments: Department[] = [];
  authers: Auther[] = [];
  elemsOfBook = { id: '', name: '', department: {id: '', name: ''}, info: '', price: '', isFeatured: false, auther: {id: '', name: ''} };
  imgFile: File | null = null;
  miniPdf: File | null = null;
  fullPdf: File | null = null;
  departObs: Subscription | undefined;
  autherObs: Subscription | undefined;

  constructor(private departSer: DepartmentService,
              private bookSer: BooksService,
              private notification: NzNotificationService,
              private message: NzMessageService,
              private autherSer: AutherService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.departObs = this.departSer.getDeparts().subscribe((departs: Department[]) => {
      this.departments = departs;
    });

    // tslint:disable-next-line: deprecation
    this.autherObs = this.autherSer.getAuthersNames().subscribe((authers) => {
      this.authers = authers;
    });

    if (this.bookToEdit) {
      const id = Array.from(this.bookToEdit.id)[0];
      this.elemsOfBook = this.bookToEdit.books.find((ele: any) => ele.id === id);
    }

  }

  ngOnDestroy(): void {
    if (this.departObs) {
      this.departObs.unsubscribe();
    }
    if (this.autherObs) {
      this.autherObs.unsubscribe();
    }
  }

  createNotification(type: string, data: string): void {
    this.notification.create(
      type,
      '',
      data
    );
  }

  handleImg(files: FileList): void {
    if (files.item(0)?.type.slice(0, 5) !== 'image') {
      this.createNotification('error', 'Its not image');
    } else {
      this.imgFile = files.item(0);
    }
  }

  handleMiniPdf(files: FileList): void {
    if (files.item(0)?.type !== 'application/pdf') {
      this.createNotification('error', 'Its not pdf file');
    } else {
      this.miniPdf = files.item(0);
    }
  }

  handleFullPdf(files: FileList): void {
    if (files.item(0)?.type !== 'application/pdf') {
      this.createNotification('error', 'Its not pdf file');
    } else {
      this.fullPdf = files.item(0);
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.value.isFeatured) {
      form.value.isFeatured = false;
    }
    const formContent = ['name', 'info', 'price', 'isFeatured', 'auther'];
    const formData = new FormData();
    if (!this.elemsOfBook.id) {
      formData.append('imgUrl', this.imgFile!, this.imgFile?.name);
      formData.append('miniPath', this.miniPdf!, this.miniPdf?.name);
      formData.append('fullPath', this.fullPdf!, this.fullPdf?.name);
      formData.append('department', form.value.depart);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < formContent.length; i++) {
        formData.append(formContent[i], form.value[formContent[i]]);
      }

      const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;

      // tslint:disable-next-line: deprecation
      this.bookSer.addBook(formData).subscribe((book) => {
        const depart = this.departments.find(ele => ele.id === book.department);
        book.department = {id: depart?.id, name: depart?.name};
        const auther = this.authers.find(ele => ele.id === book.auther);
        book.auther = {id: auther?.id, name: auther?.name};
        this.bookAdded.emit(book);
        this.message.remove(id);
        this.message.success('added successfully');
        this.imgFile = null;
        this.fullPdf = null;
        this.miniPdf = null;
        form.reset();
      }, err => {
        this.message.remove(id);
        this.createNotification('error', err.error);
      });
    } else {
      if (this.imgFile) {
        formData.append('imgUrl', this.imgFile, this.imgFile.name);
      }
      if (this.miniPdf) {
        formData.append('miniPath', this.miniPdf, this.miniPdf.name);
      }
      if (this.fullPdf) {
        formData.append('fullPath', this.fullPdf, this.fullPdf.name);
      }
      formData.append('department', form.value.depart);
      formData.append('id', this.elemsOfBook.id);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < formContent.length; i++) {
        formData.append(formContent[i], form.value[formContent[i]]);
      }

      const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;

      // tslint:disable-next-line: deprecation
      this.bookSer.updateBooks(formData).subscribe((book) => {
        const depart = this.departments.find(ele => ele.id === book.department);
        book.department = {id: depart?.id, name: depart?.name};
        const auther = this.authers.find(ele => ele.id === book.auther);
        book.auther = {id: auther?.id, name: auther?.name};
        this.updatingBook.emit(book);
        this.message.remove(id);
        this.message.success('updated successfully');
      }, err => {
        this.message.remove(id);
        console.log(err.error);
        this.createNotification('error', err.error);
      });
    }
  }
}
