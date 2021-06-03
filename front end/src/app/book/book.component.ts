import { RateService } from './../services/rate.service';
import { AuthService } from './../services/auth.service';
import { CommentsService } from './../services/comments.service';
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
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

  @ViewChild('viewer') viewer: ElementRef | undefined;
  // tslint:disable-next-line: new-parens
  @Output() routeBook = new EventEmitter;

  actRouteSub: Subscription | undefined;

  book: Book | undefined;

  loaded = false;
  readMode = 'none';
  bookOps: Subscription | undefined;
  cartOps: Subscription | undefined;
  cart: Cart = {id: '', userId: '', bookId: '', buyed: false};
  buyedOps: Subscription | undefined;
  buyed: any;

  commentsOps: Subscription | undefined;
  comments: any = [];
  commentbody = '';
  commentsLoadMore = false;
  commentsLoad = false;
  commentsPage = 1;

  relatedbooks: Book[] | undefined = [];
  relatedBooksOps: Subscription | undefined;

  relatedCartOps: Subscription | undefined;
  relatedCart: Cart[] | undefined = [];

  rate = {
    '1star': 0,
    '2star': 0,
    '3star': 0,
    '4star': 0,
    '5star': 0,
    userRate: 0
  };
  prevRate = 0;
  rateOps: Subscription | undefined;

  constructor(private bookSer: BooksService,
              private actRoute: ActivatedRoute,
              private cartSer: CartService,
              private router: Router,
              private message: NzMessageService,
              private buySer: BuyService,
              private commentSer: CommentsService,
              private userSer: AuthService,
              private rateSer: RateService
              ) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe((param) => {
      const slug = param.slug;
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

          // tslint:disable-next-line: deprecation
          this.relatedCartOps = this.cartSer.getMiniCart(token).subscribe(cart => {
            this.relatedCart = cart;
          }, err => {
            console.log(err);
          });
        }

        this.commentsOps = this.commentSer.getComments('1', book.id).subscribe(comments => {
          this.comments = comments;
          this.commentsLoad = true;
          if (comments.length === 4) {
            this.commentsLoadMore = true;
          } else {
            this.commentsLoadMore = false;
          }
        }, err => {
          this.commentsLoad = true;
          console.log(err);
        });

        this.relatedBooksOps = this.bookSer.getRelatedBooks(book?.department?.id, book?.auther?.id, book?.id).subscribe((books) => {
          this.relatedbooks = books;
        }, (err) => {
          console.log(err);
        });

        // tslint:disable-next-line: no-non-null-assertion
        const userId = new JwtHelperService().decodeToken(localStorage.getItem('token')!)?.id;
        if (userId) {
          this.rateOps = this.rateSer.getRate(book?.id, userId).subscribe((rate) => {
            this.rate = rate;
            this.prevRate = rate.userRate;
          }, (err) => {
            console.log(err);
          });
        } else {
          this.rateOps = this.rateSer.getRate(book?.id, '11').subscribe((rate) => {
            this.rate = rate;
            this.rate.userRate = 0;
          });
        }
      }, err => {
        this.loaded = true;
        console.log(err);
      });

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
    if (this.commentsOps) {
      this.commentsOps.unsubscribe();
    }
    if (this.relatedBooksOps) {
      this.relatedBooksOps.unsubscribe();
    }
    if (this.relatedCartOps) {
      this.relatedCartOps.unsubscribe();
    }
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.rateOps) {
      this.rateOps.unsubscribe();
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
      this.router.navigate(['/login'], {queryParams: {redirectTo: this.book?.slug}});
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

  addComment(): void {
    const jwt = new JwtHelperService();
    // tslint:disable-next-line: no-non-null-assertion
    const userId = jwt.decodeToken(localStorage.getItem('token')!)?.id;
    if (userId) {
      if (this.commentbody) {
        // tslint:disable-next-line: no-non-null-assertion
        this.commentSer.addComment(this.commentbody, userId, this.book?.id!).subscribe(() => {
          this.comments = [...this.comments, {user_name: this.userSer?.user?.name, body: this.commentbody}];
          this.commentbody = '';
        }, (err) => {
          console.log(err);
          this.message.error('some thing went wrong');
        });
      } else {
        this.message.error('Comment field is empty!');
      }
    } else {
      this.router.navigate(['/login'], {queryParams: {redirectTo: this.book?.slug}});
    }
  }

  loadMoreComments(): void {
    const messageId = this.message.loading('action in progress').messageId;
    this.commentsPage++;
    // tslint:disable-next-line: no-non-null-assertion
    this.commentsOps = this.commentSer.getComments(this.commentsPage.toString(), this?.book?.id!).subscribe(comments => {
      this.comments = [...comments, ...this.comments];
      this.message.remove(messageId);
      if (comments.length === 4) {
        this.commentsLoadMore = true;
      } else {
        this.commentsLoadMore = false;
      }
    }, err => {
      this.message.remove(messageId);
      console.log(err);
    });
  }

  cartConfirm(id: string): boolean {
    return Boolean(this.relatedCart?.find(ele => ele.bookId === id));
}

addRelatedToCart(id: string, slug: string): void {
  const token = localStorage.getItem('token');
  if (token) {
    const messageId  = this.message.loading('Action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.cartSer.addToCart(id, token).subscribe(() => {
      this.message.remove(messageId);
      this.relatedCart?.push({bookId: id, userId: '', id: '', buyed: false});
    }, (err) => {
      this.message.remove(messageId);
      console.log(err);
      this.message.error(err.error.message);
    });
  } else {
    this.router.navigate(['/login'], {queryParams: {redirectTo: slug}});
  }
}

removeRelatedFromCart(id: string): void {
  // tslint:disable-next-line: no-non-null-assertion
  const token = localStorage.getItem('token')!;
  const messageId  = this.message.loading('Action in progress').messageId;
  // tslint:disable-next-line: deprecation
  this.cartSer.removeFromCart(id, token).subscribe(() => {
    this.message.remove(messageId);
    this.relatedCart = this.relatedCart?.filter(ele => ele.bookId !== id);
  }, () => {
    this.message.remove(messageId);
    this.message.error('some thing went wrong');
  });
}

addRate(stars: number): void {
  const jwt = new JwtHelperService();
  // tslint:disable-next-line: no-non-null-assertion
  const userId = jwt.decodeToken(localStorage.getItem('token')!)?.id;
  if (userId) {
    const messageId = this.message.loading('action in progress').messageId;
    // tslint:disable-next-line: no-non-null-assertion
    this.rateSer.addRate(this.book?.id!, userId, stars.toString()).subscribe(() => {
      if (this.prevRate === 1) {
        this.rate['1star'] -= 1;
      } else if (this.prevRate === 2) {
        this.rate['2star'] -= 1;
      } else if (this.prevRate === 3) {
        this.rate['3star'] -= 1;
      } else if (this.prevRate === 4) {
        this.rate['4star'] -= 1;
      } else if (this.prevRate === 5) {
        this.rate['5star'] -= 1;
      }

      if (stars === 1) {
        this.rate['1star'] += 1;
      } else if (stars === 2) {
        this.rate['2star'] += 1;
      } else if (stars === 3) {
        this.rate['3star'] += 1;
      } else if (stars === 4) {
        this.rate['4star'] += 1;
      } else if (stars === 5) {
        this.rate['5star'] += 1;
      }

      this.prevRate = stars;
      this.message.remove(messageId);
    }, (err) => {
      console.log(err);
      this.message.remove(messageId);
      this.message.error('something went wrong');
    });
  } else {
    this.router.navigate(['/login'], {queryParams: {redirectTo: this.book?.slug}});
  }
}
}
