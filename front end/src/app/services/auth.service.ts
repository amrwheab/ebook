import { User } from './../shard/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | undefined;

  private url = environment.server + '/user';
  constructor(private http: HttpClient) {
    if (localStorage.getItem('token')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.getUserFromToken(localStorage.getItem('token')!).subscribe(user => {
        this.user = user;
      });
    }
  }

  signupUser(data: object): Observable<any> {
    return this.http.post(this.url + '/register.php', data);
  }

  loginUser(data: object): Observable<any> {
    return this.http.post(this.url + '/login.php', data);
  }

  getUserFromToken(token: string): Observable<any> {
    return this.http.get(this.url + '/getuserfromtoken.php', {params: {token}});
  }

  getAllUsers(search: string, limit: string, page: string): Observable<any> {
    return this.http.get(this.url + '/getallusers.php', {params: {search, limit, page}});
  }

  makeAdmin(value: boolean, userId: string): Observable<any> {
    return this.http.post(this.url  + '/makeadmin.php', {value, userId});
  }

}
