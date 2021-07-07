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
  booksLoaded = false;
  buyedBooks: any = [];
  totalBooks = 0;

  constructor(private buySer: BuyService,
              private actRoute: ActivatedRoute,
              private router: Router) { }

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
  }

  pageChange(page: number): void {
    this.router.navigate([], {queryParams: {page}}).then(() => { this.ngOnInit(); });
  }

}
