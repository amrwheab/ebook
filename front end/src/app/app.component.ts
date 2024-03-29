import { Subscription } from 'rxjs';
import { AutherService } from './services/auther.service';
import { DepartmentService } from './services/department.service';
import { User } from './shard/user';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Department } from './shard/depart';
import { Auther } from './shard/auther';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  breadItems: string[] = [];
  user: User = {
    id: '',
    name: '',
    email: '',
    address: '',
    buyedBooks: [],
    isAdmin: false,
    cart: [],
    slug: '',
    mainAdmin: false
  };
  departs: Department[] = [];
  authors: Auther[] = [];

  authOps: Subscription | undefined;
  autherOps: Subscription | undefined;
  departOps: Subscription | undefined;

  constructor(public router: Router,
              private authSer: AuthService,
              private departSer: DepartmentService,
              private authorSer: AutherService) {}

  ngOnInit(): void {

    // tslint:disable-next-line: deprecation
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.breadItems = e.url.slice(1).split('/');
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.breadItems.length; i++) {
          if (this.breadItems[i].includes('?')) {
            const index = this.breadItems[i].indexOf('?');
            this.breadItems[i] = this.breadItems[i].slice(0, index);
          }
        }
      }
    });

    // tslint:disable-next-line: no-non-null-assertion
    const token = localStorage.getItem('token')!;
    // tslint:disable-next-line: deprecation
    this.authSer.getUserFromToken(token).subscribe((user: User) => {
      this.user = user;
    }, err => {
      localStorage.removeItem('token');
    });

    // tslint:disable-next-line: deprecation
    this.departSer.getDeparts().subscribe(departs => {
      this.departs = departs.slice(-3);
    });

    // tslint:disable-next-line: deprecation
    this.authorSer.getAuthersNames().subscribe(authors => {
      this.authors = authors.slice(-3);
    });
  }

  ngOnDestroy(): void {
    if (this.authOps) {
      this.authOps.unsubscribe();
    }
    if (this.autherOps) {
      this.autherOps.unsubscribe();
    }
    if (this.departOps) {
      this.departOps.unsubscribe();
    }
  }

  searchClick(text: string): void {
    if (text) {
      this.router.navigate(['/search'], {queryParams: {text}});
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    location.reload();
  }
}
