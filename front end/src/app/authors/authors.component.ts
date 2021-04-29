import { ActivatedRoute, Router } from '@angular/router';
import { AutherService } from './../services/auther.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Auther } from '../shard/auther';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit, OnDestroy {

  autherload = false;
  authers: Auther[] = [];
  authorOps: Subscription | undefined;
  totalAuthors = 0;
  page = '1';

  constructor(private authorSer: AutherService,
              private actRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.page = this.actRoute.snapshot.queryParams.page || '1';
    const search = this.actRoute.snapshot.queryParams.search || '';
    // tslint:disable-next-line: deprecation
    this.authorOps = this.authorSer.getAuthers(this.page, search).subscribe(data => {
      this.autherload = true;
      this.authers = data.authers;
      // tslint:disable-next-line: radix
      this.totalAuthors = Math.floor(parseInt(data.authersCount) * 10 / 8);
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    if (this.authorOps) {
      this.authorOps.unsubscribe();
    }
  }

  changeIndex(page: number): void {
    if (this.actRoute.snapshot.queryParams.search) {
      const search = this.actRoute.snapshot.queryParams.search;
      this.router.navigate([], {queryParams: {page, search}}).then(() => { this.ngOnInit(); });
    } else {
      this.router.navigate([], {queryParams: {page}}).then(() => { this.ngOnInit(); });
    }
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt): string => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  searchInput(search: string): void {
    if (this.actRoute.snapshot.queryParams.page) {
      const page = this.actRoute.snapshot.queryParams.page;
      this.router.navigate([], {queryParams: {page, search}});
    } else {
      this.router.navigate([], {queryParams: {search}});
    }
  }

}
