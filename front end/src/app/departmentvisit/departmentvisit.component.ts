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

  constructor(private bookSer: BooksService,
              private actRouter: ActivatedRoute,
              private router: Router) { }

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
      }, () => {
        this.booksLoaded = true;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.booksOps) {
      this.booksOps.unsubscribe();
    }
  }

  pageChange(page: number): void {
    this.router.navigate([], { queryParams: { page } }).then(() => { this.ngOnInit(); });
  }

}
