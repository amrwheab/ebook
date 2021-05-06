import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { CartService } from './../services/cart.service';
import { FullCart } from './../shard/fullcart';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  @ViewChild('overlay') overlay: ElementRef | undefined;

  cartOps: Subscription | undefined;
  cart: FullCart[] = [];
  loaded = false;
  totalprice = 0;

  buyNow = false;
  buyPrice = 0;
  buyBookIds: string[] = [];

  constructor(private cartSer: CartService,
              private message: NzMessageService) { }

  ngOnInit(): void {

    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    // tslint:disable-next-line: deprecation
    this.cartOps = this.cartSer.getFullCart(token).subscribe(res => {
      this.cart = res.cart;
      this.totalprice = res.fullprice;
      this.loaded = true;
    }, err => {
      console.log(err);
      this.loaded = true;
    });

  }

  ngOnDestroy(): void {
    if (this.cartOps) {
      this.cartOps.unsubscribe();
    }
  }

  removeFromCart(id: string): void {
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    const messageId  = this.message.loading('Action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.cartSer.removeFromCart(id, token).subscribe(() => {
      this.message.remove(messageId);
      this.cart = this.cart.filter(ele => ele.book?.id !== id);
    }, () => {
      this.message.remove(messageId);
      this.message.error('some thing went wrong');
    });
  }

  closePop(e: Event): void {
    if (e.target === this.overlay?.nativeElement) {
      this.buyNow = false;
    }
  }

  sendBuy(id: string): void {
    if (id) {
      const book = this.cart.find(ele => ele.book?.id === id)?.book;
      this.buyBookIds = [];
      // tslint:disable-next-line: no-non-null-assertion
      this.buyBookIds[0] = book?.id!;
      // tslint:disable-next-line: no-non-null-assertion
      this.buyPrice = book?.price!;
    } else {
      this.buyBookIds = [];
      this.cart.forEach(elem => {
        if (!elem.book?.buyed) {
          // tslint:disable-next-line: no-non-null-assertion
          return this.buyBookIds.push(elem.book?.id!);
        }
      });
      this.buyPrice = this.totalprice;
    }
    this.buyNow = true;
  }

  removebuyed(): void {
    this.buyBookIds.forEach(buyId => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i]?.book.id === buyId) {
          this.cart[i].book.buyed = true;
        }
      }
    });
  }
}
