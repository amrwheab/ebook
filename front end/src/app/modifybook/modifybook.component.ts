import { Book } from './../shard/book';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BooksService } from './../services/books.service';
import { DepartmentService } from './../services/department.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgForm } from '@angular/forms';
import { Department } from '../shard/depart';

@Component({
  selector: 'app-modifybook',
  templateUrl: './modifybook.component.html',
  styleUrls: ['./modifybook.component.scss']
})
export class ModifybookComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('bookToEdit') bookToEdit: any;
  @Output() bookAdded = new EventEmitter();

  departments: Department[] = [];
  elemsOfBook = { id: '', name: '', department: {id: '', name: ''}, info: '', price: '', isFeatured: false };
  imgFile: File = null;
  miniPdf: File = null;
  fullPdf: File = null;

  constructor(private departSer: DepartmentService,
              private bookSer: BooksService,
              private notification: NzNotificationService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.departSer.getDeparts().subscribe((departs: Department[]) => {
      this.departments = departs;
    });

    if (this.bookToEdit) {
      const id = Array.from(this.bookToEdit.id)[0];
      this.elemsOfBook = this.bookToEdit.books.find(ele => ele.id === id);
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
    if (files.item(0).type.slice(0, 5) !== 'image') {
      this.createNotification('error', 'Its not image');
    } else {
      this.imgFile = files.item(0);
    }
  }

  handleMiniPdf(files: FileList): void {
    if (files.item(0).type !== 'application/pdf') {
      this.createNotification('error', 'Its not pdf file');
    } else {
      this.miniPdf = files.item(0);
    }
  }

  handleFullPdf(files: FileList): void {
    if (files.item(0).type !== 'application/pdf') {
      this.createNotification('error', 'Its not pdf file');
    } else {
      this.fullPdf = files.item(0);
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.value.isFeatured) {
      form.value.isFeatured = false;
    }
    const formContent = ['name', 'info', 'price', 'isFeatured'];
    const formData = new FormData();
    if (!this.elemsOfBook.id) {
      formData.append('img', this.imgFile, this.imgFile.name);
      formData.append('pdfmini', this.miniPdf, this.miniPdf.name);
      formData.append('pdffull', this.fullPdf, this.fullPdf.name);
      formData.append('department', form.value.depart);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < formContent.length; i++) {
        formData.append(formContent[i], form.value[formContent[i]]);
      }

      const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;

      this.bookSer.addBook(formData).subscribe((book) => {
        const depart = this.departments.find(ele => ele.id === book.department);
        book.department = {id: depart.id, name: depart.name};
        this.bookAdded.emit(book);
        this.message.remove(id);
        this.imgFile = null;
        this.fullPdf = null;
        this.miniPdf = null;
        form.reset();
      }, err => {
        this.createNotification('error', err.error);
      });
    } else {
      if (this.imgFile) {
        formData.append('img', this.imgFile, this.imgFile.name);
      }
      if (this.miniPdf) {
        formData.append('pdfmini', this.miniPdf, this.miniPdf.name);
      }
      if (this.fullPdf) {
        formData.append('pdffull', this.fullPdf, this.fullPdf.name);
      }
      formData.append('department', form.value.depart);
      formData.append('id', this.elemsOfBook.id);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < formContent.length; i++) {
        formData.append(formContent[i], form.value[formContent[i]]);
      }

      const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;

      this.bookSer.updateBooks(formData).subscribe(() => {
        this.message.remove(id);
      }, err => {
        this.message.remove(id);
        this.createNotification('error', err.error);
      });
    }
  }
}
