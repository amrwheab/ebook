import { NzMessageService } from 'ng-zorro-antd/message';
import { Cart } from './../shard/cart';
import { CartService } from './../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { BuyService } from './../services/buy.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buys',
  templateUrl: './buys.component.html',
  styleUrls: ['./buys.component.scss']
})
export class BuysComponent implements OnInit {

  buyOps: Subscription | undefined;
  cartOps: Subscription | undefined;
  booksLoaded = false;
  buyedBooks: any = [];
  cart: Cart[] = [];
  totalBooks = 0;

  constructor(private buySer: BuyService,
              private actRoute: ActivatedRoute,
              private cartSer: CartService,
              private router: Router,
              private message: NzMessageService) { }

  ngOnInit(): void {
    const page = this.actRoute.snapshot.queryParams.page;
    const jwt = new JwtHelperService();
    // tslint:disable-next-line: no-non-null-assertion
    const userId = jwt.decodeToken(localStorage.getItem('token')!).id;
    // tslint:disable-next-line: deprecation
    this.buyOps = this.buySer.getBuyedBooks(userId, page ? page : 1).subscribe(res => {
      this.booksLoaded = true;
      // tslint:disable-next-line: radix
      this.totalBooks = Math.floor(parseInt(res.num) / 20 * 10);
      this.buyedBooks = res.books;
    }, err => {
      this.booksLoaded = true;
      console.log(err);
    });

    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
     // tslint:disable-next-line: deprecation
    this.cartOps = this.cartSer.getMiniCart(token).subscribe(cart => {
      this.cart = cart;
    }, err => {
      console.log(err);
    });
  }

  pageChange(page: number): void {
    this.router.navigate([], {queryParams: {page}}).then(() => { this.ngOnInit(); });
  }

  cartConfirm(id: string): boolean {
    return Boolean(this.cart.find(ele => ele.bookId === id));
  }

addToCart(id: string, slug: string): void {
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
    this.router.navigate(['/login'], {queryParams: {redirectTo: slug}});
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
