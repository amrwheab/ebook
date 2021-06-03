import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from './../shard/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss']
})
export class UserdashboardComponent implements OnInit {

  usersOps: Subscription | undefined;
  userLoaded = false;
  page = 1;
  loadMore = true;

  indeterminate = false;
  listOfCurrentPageData = [];
  listOfData: User[] = [];

  onCurrentPageDataChange($event: any): void {
      this.listOfCurrentPageData = $event;
  }

  onQueryParamsChange(param: any): void {
    if (this.loadMore) {
      const last = this.listOfData.length - (param.pageIndex * param.pageSize);
      if (last < param.pageSize) {
        this.page += 1;
        const search = this.actRoute.snapshot.queryParams.search || '';
        const messageId = this.message.loading('action in progress').messageId;
        // tslint:disable-next-line: deprecation
        this.usersOps = this.authSer.getAllUsers(search, '20', this.page.toString()).subscribe(users => {
          this.listOfData = [...this.listOfData, ...users];
          this.message.remove(messageId);
          if (users.length !== 20) {
            this.loadMore = false;
          }
        }, err => {
          this.message.error(err);
          this.message.remove(messageId);
        });
      }
    }
  }

  constructor(private authSer: AuthService,
              private actRoute: ActivatedRoute,
              private message: NzMessageService,
              private router: Router) { }

  ngOnInit(): void {
    const search = this.actRoute.snapshot.queryParams.search || '';
    this.usersOps = this.authSer.getAllUsers(search, '20', '1').subscribe((users) => {
      this.listOfData = users;
      this.userLoaded = true;

      if (users.length !== 20) {
        this.loadMore = false;
      }
    }, (err) => {
      console.log(err);
      this.userLoaded = true;
    });
  }

  onInputSearch(value: string): void {
    this.router.navigate([], {queryParams: {search: value}});
  }

  changeUserAdmin(value: boolean, userId: string): void {
    const messageId = this.message.loading('action in progress').messageId;
    this.authSer.makeAdmin(value, userId).subscribe(() => {
      this.message.remove(messageId);
    }, err => {
      this.message.remove(messageId);
      this.message.error('some thing went wrong');
      console.log(err);
    });
  }

}
