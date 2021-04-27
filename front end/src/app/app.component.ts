import { AutherService } from './services/auther.service';
import { DepartmentService } from './services/department.service';
import { User } from './shard/user';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Department } from './shard/depart';
import { Auther } from './shard/auther';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  breadItems = [];
  user: User = {
    id: '',
    name: '',
    email: '',
    address: '',
    buyedBooks: [],
    isAdmin: false,
    cart: [],
    slug: ''
  };
  departs: Department[] = [];
  authors: Auther[] = [];

  constructor(private router: Router,
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

    // tslint:disable-next-line: deprecation
    this.authSer.getUserFromToken(localStorage.getItem('token')).subscribe((user: User) => {
      this.user = user;
    });

    this.departSer.getDeparts().subscribe(departs => {
      this.departs = departs;
    });

    this.authorSer.getAuthersNames().subscribe(authors => {
      this.authors = authors;
    });
  }

  logOut(): void {
    localStorage.removeItem('token');
    location.reload();
  }
}
