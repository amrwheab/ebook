import { AutherService } from './../services/auther.service';
import { Cart } from './../shard/cart';
import { CartService } from './../services/cart.service';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  cartOps: Subscription | undefined;
  autherOps: Subscription | undefined;
  books: Book[] = [];
  cart: Cart[] = [];
  authers: Auther[] = [];
  loadMoreBooks = true;
  loadMoreAuthers = true;
  bookspage = 1;
  autherspage = 1;

  constructor(private booksSer: BooksService,
              private actRoute: ActivatedRoute,
              private router: Router,
              private message: NzMessageService,
              private cartSer: CartService,
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

    const jwt = new JwtHelperService();
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    // tslint:disable-next-line: no-non-null-assertion
    const userId = jwt.decodeToken(token!)?.id;
    if (userId) {
      // tslint:disable-next-line: deprecation
      this.cartOps = this.cartSer.getMiniCart(token).subscribe(cart => {
        this.cart = cart;
      }, err => {
        console.log(err);
      });
    }
  }


  ngOnDestroy(): void {
    if (this.booksOps) {
      this.booksOps.unsubscribe();
    }
    if (this.paramOps) {
      this.paramOps.unsubscribe();
    }
    if (this.cartOps) {
      this.cartOps.unsubscribe();
    }
    if (this.autherOps) {
      this.autherOps.unsubscribe();
    }
  }

  cartConfirm(id: string): boolean {
    return Boolean(this.cart.find(ele => ele.bookId === id));
  }
  addToCart(id: string, slug: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      const messageId = this.message.loading('Action in progress').messageId;
      // tslint:disable-next-line: deprecation
      this.cartSer.addToCart(id, token).subscribe(() => {
        this.message.remove(messageId);
        this.cart.push({ bookId: id, userId: '', id: '', buyed: false });
      }, () => {
        this.message.remove(messageId);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigate(['/login'], {queryParams: {redirectTo: slug}});
    }
  }

  removeFromCart(id: string): void {
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    const messageId = this.message.loading('Action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.cartSer.removeFromCart(id, token).subscribe(() => {
      this.message.remove(messageId);
      this.cart = this.cart.filter(ele => ele.bookId !== id);
    }, () => {
      this.message.remove(messageId);
      this.message.error('some thing went wrong');
    });
  }

  loadMoreBook(): void {
    const text = this.actRoute.snapshot.queryParams.text;
    this.bookspage++;
    // tslint:disable-next-line: deprecation
    this.booksOps = this.booksSer.getBooks(this.bookspage, text, '10').subscribe(books => {
      console.log(books);
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
