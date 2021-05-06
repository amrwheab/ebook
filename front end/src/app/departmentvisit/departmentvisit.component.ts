import { CartService } from './../services/cart.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Cart } from './../shard/cart';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from './../shard/book';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-departmentvisit',
  templateUrl: './departmentvisit.component.html',
  styleUrls: ['./departmentvisit.component.scss']
})
export class DepartmentvisitComponent implements OnInit, OnDestroy {

  booksOps: Subscription | undefined;
  books: Book[] = [];
  booksLoaded = false;
  totalBooks = 1;
  cart: Cart[] = [];
  cartOps: Subscription | undefined;

  constructor(private bookSer: BooksService,
              private actRouter: ActivatedRoute,
              private router: Router,
              private message: NzMessageService,
              private cartSer: CartService) { }

  ngOnInit(): void {
    const page = this.actRouter.snapshot.queryParams.page || '1';
    // tslint:disable-next-line: deprecation
    this.actRouter.params.subscribe(param => {
      // tslint:disable-next-line: deprecation
      this.booksOps = this.bookSer.getByDepartName(param.name, page).subscribe(result => {
        this.books = result.books;
        // tslint:disable-next-line: radix
        this.totalBooks = Math.floor(parseInt(result.num) / 20 * 10);
        this.booksLoaded = true;
      }, err => {
        console.log(err);
        this.booksLoaded = true;
      });
    });

    const token = localStorage.getItem('token');
    if (token) {
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
    if (this.cartOps) {
      this.cartOps.unsubscribe();
    }
  }

  pageChange(page: number): void {
    this.router.navigate([], {queryParams: {page}}).then(() => { this.ngOnInit(); });
  }

  cartConfirm(id: string): boolean {
    return Boolean(this.cart.find(ele => ele.bookId === id));
}

addToCart(id: string): void {
  const token = localStorage.getItem('token');
  if (token) {
    const messageId  = this.message.loading('Action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.cartSer.addToCart(id, token).subscribe(() => {
      this.message.remove(messageId);
      this.cart.push({bookId: id, userId: '', id: '', buyed: false});
    }, () => {
      this.message.remove(messageId);
      this.message.error('some thing went wrong');
    });
  } else {
    this.router.navigate(['/login']);
  }
}

removeFromCart(id: string): void {
  // tslint:disable-next-line: no-non-null-assertion
  const token = localStorage.getItem('token')!;
  const messageId  = this.message.loading('Action in progress').messageId;
  // tslint:disable-next-line: deprecation
  this.cartSer.removeFromCart(id, token).subscribe(() => {
    this.message.remove(messageId);
    this.cart = this.cart.filter(ele => ele.bookId !== id);
  }, () => {
    this.message.remove(messageId);
    this.message.error('some thing went wrong');
  });
}

}
