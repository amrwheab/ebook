import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.server + '/user';
  constructor(private http: HttpClient) { }

  signupUser(data: object): Observable<any> {
    return this.http.post(this.url + '/register', data);
  }

  loginUser(data: object): Observable<any> {
    return this.http.post(this.url + '/login', data);
  }

  getUserFromToken(token: string): Observable<any> {
    return this.http.get(this.url + '/getuserfromtoken/' + token);
  }
}
