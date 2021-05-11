import { BuyService } from './../services/buy.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from './../services/cart.service';
import { Cart } from './../shard/cart';
import { Book } from './../shard/book';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

  @ViewChild('viewer') viewer: ElementRef | undefined;

  book: Book | undefined;

  loaded = false;
  readMode = 'none';
  bookOps: Subscription | undefined;
  cartOps: Subscription | undefined;
  cart: Cart = {id: '', userId: '', bookId: '', buyed: false};
  buyedOps: Subscription | undefined;
  buyed: any;

  constructor(private bookSer: BooksService,
              private actRoute: ActivatedRoute,
              private cartSer: CartService,
              private router: Router,
              private message: NzMessageService,
              private buySer: BuyService
              ) { }

  ngOnInit(): void {
    const slug = this.actRoute.snapshot.params.slug;
    // tslint:disable-next-line: deprecation
    this.bookOps = this.bookSer.getBookBySlug(slug).subscribe(book => {
      this.book = book;
      this.loaded = true;

      // tslint:disable-next-line: no-non-null-assertion
      const token = localStorage.getItem('token')!;
      if (token) {
        // tslint:disable-next-line: deprecation
        this.cartOps = this.cartSer.getOneCart(token, book.id).subscribe(cart => {
          this.cart = cart;
        }, err => {
          console.log(err);
        });
        const jwt = new JwtHelperService();
        // tslint:disable-next-line: deprecation
        this.buyedOps = this.buySer.getOneBuyed(jwt.decodeToken(token).id, book.id).subscribe(buy => {
          this.buyed = buy;
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      this.loaded = true;
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    if (this.bookOps) {
      this.bookOps.unsubscribe();
    }
    if (this.cartOps) {
      this.cartOps.unsubscribe();
    }
    if (this.buyedOps) {
      this.buyedOps.unsubscribe();
    }
  }

  showBook(): void {
    this.readMode = 'block';
    WebViewer({
      path: environment.server + '/../assets/lib',
      initialDoc: this.buyed ? this.book?.fullPath : this.book?.miniPath
    }, this.viewer?.nativeElement).then(instance => {
      console.log(instance);
    });
  }

  addToCart(): void {
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token');
    if (token) {
      // tslint:disable-next-line: no-non-null-assertion
      const bookId = this.book?.id!;
      const id  = this.message.loading('Action in progress').messageId;
      // tslint:disable-next-line: deprecation
      this.cartSer.addToCart(bookId, token).subscribe(() => {
        this.cart.id = '1';
        this.message.remove(id);
        this.message.success('added successfully');
      }, err => {
        console.log(err);
        this.message.remove(id);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  removeFromCart(): void {
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token');
    if (token) {
      // tslint:disable-next-line: no-non-null-assertion
      const bookId = this.book?.id!;
      const id  = this.message.loading('Action in progress').messageId;
      // tslint:disable-next-line: deprecation
      this.cartSer.removeFromCart(bookId, token).subscribe(() => {
        this.cart.id = '';
        this.message.remove(id);
        this.message.success('deleted successfully');
      }, err => {
        console.log(err);
        this.message.remove(id);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigate(['/login']);
    }

  }
}
