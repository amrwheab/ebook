import { AutherService } from './../services/auther.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../shard/book';
import { Auther } from '../shard/auther';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  booksLoaded = false;
  autherload = false;
  booksOps: Subscription | undefined;
  paramOps: Subscription | undefined;
  autherOps: Subscription | undefined;
  books: Book[] = [];
  authers: Auther[] = [];
  loadMoreBooks = true;
  loadMoreAuthers = true;
  bookspage = 1;
  autherspage = 1;

  constructor(private booksSer: BooksService,
              private actRoute: ActivatedRoute,
              private router: Router,
              private message: NzMessageService,
              private autherSer: AutherService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.paramOps = this.actRoute.queryParams.subscribe(param => {
      if (param.text) {
        // tslint:disable-next-line: deprecation
        this.booksOps = this.booksSer.getBooks(1, param.text, '10').subscribe(books => {
          this.books = books;
          this.booksLoaded = true;
          if (books.length < 10) {
            this.loadMoreBooks = false;
          }
        }, () => {
          this.booksLoaded = true;
        });

        // tslint:disable-next-line: deprecation
        this.autherOps = this.autherSer.getAuthers('1', param.text).subscribe(data => {
          this.authers = data.authers;
          this.autherload = true;

          if (data.authers.length < 8) {
            this.loadMoreAuthers = false;
          }
        }, () => {
          this.autherload = true;
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.booksOps) {
      this.booksOps.unsubscribe();
    }
    if (this.paramOps) {
      this.paramOps.unsubscribe();
    }
    if (this.autherOps) {
      this.autherOps.unsubscribe();
    }
  }

  loadMoreBook(): void {
    const text = this.actRoute.snapshot.queryParams.text;
    this.bookspage++;
    // tslint:disable-next-line: deprecation
    this.booksOps = this.booksSer.getBooks(this.bookspage, text, '10').subscribe(books => {
      this.books = [...this.books, ...books];
      this.booksLoaded = true;
      if (books.length < 10) {
        this.loadMoreBooks = false;
      }
    }, () => {
      this.booksLoaded = true;
    });
  }

  loadMoreAuther(): void {
    const text = this.actRoute.snapshot.queryParams.text;
    this.autherspage++;
    const messageId = this.message.loading('action on work...').messageId;
    // tslint:disable-next-line: deprecation
    this.autherOps = this.autherSer.getAuthers(this.autherspage.toString(), text).subscribe(data => {
      this.authers = [...this.authers, ...data.authers];
      this.message.remove(messageId);
      if (data.authers.length < 8) {
        this.loadMoreAuthers = false;
      }
    }, () => {
      this.message.remove(messageId);
      this.message.error('some thing went error');
    });
  }

}
