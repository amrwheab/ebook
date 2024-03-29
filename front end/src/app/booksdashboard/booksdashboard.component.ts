import { Router, ActivatedRoute } from '@angular/router';
import { Book } from './../shard/book';
import { BooksService } from './../services/books.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-booksdashboard',
  templateUrl: './booksdashboard.component.html',
  styleUrls: ['./booksdashboard.component.scss']
})
export class BooksdashboardComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  loadDeleteButton = false;
  loadUpdateButton = false;
  editShow = false;
  booksLoad = false;
  booksObs: Subscription | undefined;
  mobScreen = false;
  page = 1;
  search = '';

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
        this.listOfCurrentPageData.forEach((data: any, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data: any, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData: Book[] = [];
  setOfCheckedId = new Set<string>();
  sortBuysTime = (a: { buysNum: number; }, b: { buysNum: number; }) => a.buysNum - b.buysNum;
  sortPrice = (a: { price: number; }, b: { price: number; }) => a.price - b.price;

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
    this.listOfCurrentPageData.forEach((item: any) => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: any): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
  }

  onQueryParamsChange(param: any): void {
    const last = this.listOfData.length - (param.pageIndex * param.pageSize);
    if (last < param.pageSize) {
      this.page += 1;
      const search = this.actRoute.snapshot.queryParams.search || '';
      // tslint:disable-next-line: deprecation
      this.booksObs = this.bookSer.getBooks(this.page, search, '20').subscribe(books => {
        this.booksLoad = true;
        this.listOfData = [...this.listOfData, ...books];
      }, err => {
        this.booksLoad = false;
        this.message.error(err);
      });
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item: any) => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some((item: any) => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  createNotification(type: string, title: string, body: string): void {
    this.notification.create(
      type,
      title,
      body
    );
  }

  constructor(private bookSer: BooksService,
              private notification: NzNotificationService,
              private modal: NzModalService,
              private message: NzMessageService,
              private router: Router,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const search = this.actRoute.snapshot.queryParams.search || '';
    // tslint:disable-next-line: deprecation
    this.booksObs = this.bookSer.getBooks(1, search, '20').subscribe(books => {
      this.booksLoad = true;
      this.listOfData = books;
    }, err => {
      this.booksLoad = false;
      this.message.error(err);
      console.log(err);
    });

    if (window.innerWidth <= 566) {
      this.mobScreen = true;
    }
    window.addEventListener('resize', () => {
      if (this.mobScreen) {
        if (window.innerWidth > 566) {
          this.mobScreen = false;
        }
      } else {
        if (!this.mobScreen) {
          if (window.innerWidth <= 566) {
            this.mobScreen = true;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.booksObs) {
      this.booksObs.unsubscribe();
    }
  }

  onInputSearch(inputtext: string): void {
    this.router.navigate([], {queryParams: {search: inputtext}});
  }

  searchCommand(): void {
    const search = this.actRoute.snapshot.queryParams.search;
    // tslint:disable-next-line: deprecation
    this.booksObs = this.bookSer.getBooks(1, search, '20').subscribe(books => {
      this.booksLoad = true;
      this.listOfData = books;
    }, err => {
      this.booksLoad = false;
      this.message.error(err);
      console.log(err);
    });
  }

  addingBook(book: Book): void {
    this.listOfData = [...this.listOfData, book];
  }

  updateBook(book: Book): void {
    const index = this.listOfData.findIndex(ele => ele.id === book.id);
    this.listOfData[index] = book;
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete selected books?',
      nzContent: '<b style="color: red;">It wouldn\'t be returned</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOkDanger: true,
      nzOnOk: () => this.deleteFromTable(),
      nzCancelText: 'No'
    });
  }

  deleteFromTable(): void {
    if (this.setOfCheckedId.size > 0) {
      this.loadDeleteButton = true;
      const data = Array.from(this.setOfCheckedId);
      // tslint:disable-next-line: deprecation
      this.bookSer.deleteBooks(data).subscribe((ele: string) => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          this.listOfData = this.listOfData.filter(elem => elem.id !== data[i]);
        }
        this.createNotification('success', `Deleting ${data.length > 1 ? 'books' : 'book'}`, ele);
        this.refreshCheckedStatus();
        this.setOfCheckedId.clear();
        this.loadDeleteButton = false;
      }, err => {
        console.log(err);
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
