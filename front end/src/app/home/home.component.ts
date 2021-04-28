import { DepartmentService } from './../services/department.service';
import { Department } from './../shard/depart';
import { Subscription } from 'rxjs';
import { BooksService } from './../services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../shard/book';


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
  featutedObs: Subscription | undefined;
  departments: Department[] = [];
  departmentsObs: Subscription | undefined;
  departedBooks: Book[][] = [];
  departsSlide: number[] = [];
  departsSlideWidth: number[] = [];
  constructor(private bookSer: BooksService,
              private departSer: DepartmentService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.featutedObs = this.bookSer.getFeaturedBooks().subscribe((books: Book[]) => {
      this.featured = books;
      this.featSlideWidth = (197 * this.featured.length) - ((187 * this.slidesToShow) + (10 * (this.slidesToShow - 1)));
    }, err => {
      console.log(err);
    });

    // Get Departments

    // tslint:disable-next-line: deprecation
    this.departmentsObs = this.departSer.getDeparts().subscribe((departs: Department[]) => {
      this.departments = departs;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.departments.length; i++) {
        // tslint:disable-next-line: deprecation
        this.bookSer.getDepartedBooks(this.departments[i].id!).subscribe((books: Book[]) => {
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
  }

  ngOnDestroy(): void {
    if (this.featutedObs) {
      this.featutedObs.unsubscribe();
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
}
