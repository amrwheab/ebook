import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CartService } from './../services/cart.service';
import { DepartmentService } from './../services/department.service';
import { Department } from './../shard/depart';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../shard/book';
import { Cart } from '../shard/cart';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  slidesToShow = 5;
  featslide = 0;
  featSlideWidth = 0;
  featured: Book[] = [];
  mostBuyedSlide = 0;
  mostBuyedSlideWidth = 0;
  mostBuyed: Book[] = [];
  cart: Cart[] = [];
  cartOps: Subscription | undefined;
  featutedObs: Subscription | undefined;
  mostBuyedOps: Subscription | undefined;
  departments: Department[] = [];
  departmentsObs: Subscription | undefined;
  departedBooks: Book[][] = [];
  departsSlide: number[] = [];
  departsSlideWidth: number[] = [];

  mobileScreen: boolean | undefined;
  constructor(private bookSer: BooksService,
              private departSer: DepartmentService,
              private cartSer: CartService,
              private router: Router,
              private message: NzMessageService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.featutedObs = this.bookSer.getFeaturedBooks().subscribe((books: Book[]) => {
      this.featured = books;
      this.featSlideWidth = (197 * this.featured.length) - ((187 * this.slidesToShow) + (10 * (this.slidesToShow - 1)));
    }, err => {
      console.log(err);
    });

    // tslint:disable-next-line: deprecation
    this.mostBuyedOps = this.bookSer.getMostBuyedBooks().subscribe((books: Book[]) => {
      this.mostBuyed = books;
      this.mostBuyedSlideWidth = (197 * this.mostBuyed.length) - ((187 * this.slidesToShow) + (10 * (this.slidesToShow - 1)));
    }, err => {
      console.log(err);
    });

    // Get Departments

    // tslint:disable-next-line: deprecation
    this.departmentsObs = this.departSer.getDeparts().subscribe((departs: Department[]) => {
      this.departments = departs;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.departments.length; i++) {
        // tslint:disable-next-line: no-non-null-assertion
        const departId = this.departments[i].id!;
        // tslint:disable-next-line: deprecation
        this.bookSer.getDepartedBooks(departId).subscribe((books: Book[]) => {
          this.departedBooks[i] = books;
          this.departsSlide[i] = 0;
          this.departsSlideWidth[i] = (197 * this.departedBooks[i].length) - ((187 * this.slidesToShow) + (10 * (this.slidesToShow - 1)));
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      console.log(err);
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

    const size = window.innerWidth;
    if (size > 0 && size < 576) {
      this.slidesToShow = 2;
    } else if (size >= 576 && size < 768) {
      this.slidesToShow = 3;
    } else if (size >= 768 && size < 992) {
      this.slidesToShow = 4;
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 0 && window.innerWidth < 576) {
        this.slidesToShow = 2;
      } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        this.slidesToShow = 3;
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        this.slidesToShow = 4;
      }
    });

    if (window.innerWidth <= 576) {
      this.mobileScreen = true;
    }
  }

  ngOnDestroy(): void {
    if (this.featutedObs) {
      this.featutedObs.unsubscribe();
    }
    if (this.mostBuyedOps) {
      this.mostBuyedOps.unsubscribe();
    }
    if (this.departmentsObs) {
      this.departmentsObs.unsubscribe();
    }
  }

  featSlideAction(right: boolean): void {
    if (right) {
      if (this.featslide > -this.featSlideWidth + 10) {
        this.featslide -= 197;
      }
    } else {
      if (this.featslide < 0) {
        this.featslide += 197;
      }
    }
  }

  mostBuyedAction(right: boolean): void {
    if (right) {
      if (this.mostBuyedSlide > -this.mostBuyedSlideWidth + 10) {
        this.mostBuyedSlide -= 197;
      }
    } else {
      if (this.mostBuyedSlide < 0) {
        this.mostBuyedSlide += 197;
      }
    }
  }

  departSlideAction(right: boolean, i: number): void {
    if (right) {
      if (this.departsSlide[i] > -this.departsSlideWidth[i] + 10) {
        this.departsSlide[i] -= 197;
      }
    } else {
      if (this.departsSlide[i] < 0) {
        this.departsSlide[i] += 197;
      }
    }
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
        const buyed = this.cart.find(ele => ele.bookId === id)?.buyed;
        this.cart.push({bookId: id, userId: '', id: '', buyed});
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
