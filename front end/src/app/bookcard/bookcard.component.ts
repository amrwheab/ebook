import { Book } from './../shard/book';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CartService } from './../services/cart.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.scss']
})
export class BookcardComponent implements OnInit {

  @Input() book: Book | undefined;

  constructor(private cartSer: CartService,
              private router: Router,
              private message: NzMessageService) { }

  ngOnInit(): void { }

  cartConfirm(id: string): boolean {
    return Boolean(this.cartSer.cart.find(ele => ele.bookId === id));
  }

  addToCart(id: string, slug: string): void {
    const token = localStorage.getItem('token');
    if (token) {
      const messageId = this.message.loading('Action in progress').messageId;
      // tslint:disable-next-line: deprecation
      this.cartSer.addToCart(id, token).subscribe(() => {
        this.message.remove(messageId);
        const buyed = this.cartSer.cart.find(ele => ele.bookId === id)?.buyed;
        this.cartSer.cart.push({bookId: id, userId: '', id: '', buyed});
      }, () => {
        this.message.remove(messageId);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigate(['/login'], { queryParams: { redirectTo: slug } });
    }
  }

  removeFromCart(id: string): void {
    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    const messageId = this.message.loading('Action in progress').messageId;
    // tslint:disable-next-line: deprecation
    this.cartSer.removeFromCart(id, token).subscribe(() => {
      this.message.remove(messageId);
      this.cartSer.cart = this.cartSer.cart.filter(ele => ele.bookId !== id);
    }, () => {
      this.message.remove(messageId);
      this.message.error('some thing went wrong');
    });
  }
}
