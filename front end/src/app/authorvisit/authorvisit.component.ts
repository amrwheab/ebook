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

  constructor(private autherSer: AutherService,
              private actRoute: ActivatedRoute,
              private router: Router) { }

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
  }

  ngOnDestroy(): void {
    if (this.autherOps) {
      this.autherOps.unsubscribe();
    }
  }

  pageChange(page: number): void {
    this.router.navigate([], {queryParams: {page}}).then(() => { this.ngOnInit(); });
  }

}
