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
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.breadItems = e.url.slice(1).split('/');
      }
    });

    this.authSer.getUserFromToken(localStorage.getItem('token')).subscribe((user: User) => {
      this.user = user;
    });

    this.departSer.getDeparts().subscribe(departs => {
      this.departs = departs;
    });

    this.authorSer.getAuthers().subscribe(authors => {
      this.authors = authors;
    });
  }

  logOut(): void {
    localStorage.removeItem('token');
    location.reload();
  }
}
