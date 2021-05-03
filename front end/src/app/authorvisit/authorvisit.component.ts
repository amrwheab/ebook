import { CartService } from './../services/cart.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Cart } from './../shard/cart';
import { ActivatedRoute, Router } from '@angular/router';
import { AutherService } from './../services/auther.service';
import { Book } from './../shard/book';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auther } from '../shard/auther';

@Component({
  selector: 'app-authorvisit',
  templateUrl: './authorvisit.component.html',
  styleUrls: ['./authorvisit.component.scss']
})
export class AuthorvisitComponent implements OnInit, OnDestroy {

  autherOps: Subscription | undefined;
  loaded = false;
  auther: Auther | undefined;
  books: Book[] = [];
  totalBooks = 0;
  cart: Cart[] = [];
  cartOps: Subscription | undefined;

  constructor(private autherSer: AutherService,
              private actRoute: ActivatedRoute,
              private router: Router,
              private message: NzMessageService,
              private cartSer: CartService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.actRoute.params.subscribe(param => {
      const page = this.actRoute.snapshot.queryParams.page || '1';
      // tslint:disable-next-line: deprecation
      this.autherOps = this.autherSer.getOneAuther(page, param.slug).subscribe(result => {
        this.loaded = true;
        this.auther = result.auther;
        this.books = result.books;
        // tslint:disable-next-line: radix
        this.totalBooks = Math.floor(parseInt(result.num) / 20 * 10);
      }, err => {
        this.loaded = true;
        console.log(err);
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
    if (this.autherOps) {
      this.autherOps.unsubscribe();
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
      this.message.success('added successfully');
      this.cart.push({bookId: id, userId: '', id: ''});
    }, (err) => {
      this.message.remove(messageId);
      console.log(err);
      this.message.error(err.error.message);
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
    this.message.success('deleted successfully');
    this.cart = this.cart.filter(ele => ele.bookId !== id);
  }, () => {
    this.message.remove(messageId);
    this.message.error('some thing went wrong');
  });
}

}
