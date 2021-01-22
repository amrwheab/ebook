import { Book } from './../shard/book';
import { BooksService } from './../services/books.service';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-booksdashboard',
  templateUrl: './booksdashboard.component.html',
  styleUrls: ['./booksdashboard.component.scss']
})
export class BooksdashboardComponent implements OnInit {

  books: Book[] = [];
  loadDeleteButton = false;
  loadUpdateButton = false;
  editShow = false;

  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData = [];
  setOfCheckedId = new Set<string>();
  sortBuysTime = (a, b) => a.buysNum - b.buysNum;
  sortPrice = (a, b) => a.price - b.price;

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  createNotification(type: string, title: string, body: string): void {
    this.notification.create(
      type,
      title,
      body
    );
  }

  constructor(private bookSer: BooksService, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.bookSer.getBooks().subscribe(books => {
      this.listOfData = books;
    });
  }

  addingBook(book: Book): void {
    this.listOfData = [...this.listOfData, book];
  }

  deleteFromTable(): void {
    if (this.setOfCheckedId.size > 0) {
      this.loadDeleteButton = true;
      const data = Array.from(this.setOfCheckedId);
      this.bookSer.deleteBooks(data).subscribe((ele: string) => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          this.listOfData = this.listOfData.filter(elem => elem.id !== data[i]);
        }
        this.createNotification('success', `Deleting ${data.length > 1 ? 'books' : 'book'}`, ele);
        this.refreshCheckedStatus();
        this.loadDeleteButton = false;
      }, err => {
        this.createNotification('error', `Failed to Delete ${data.length > 1 ? 'books' : 'book'}`, err);
        this.loadDeleteButton = false;
      });
    } else {
      this.createNotification('error', '', 'You didn\'t choose books to delete');
    }
  }

  openEditOptions(): void {
    if (this.setOfCheckedId.size !== 1) {
      this.createNotification('error', '', 'You must choose one book to update');
    } else {
      this.editShow = true;
    }
  }

}
