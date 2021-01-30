import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutherService {

  constructor(private http: HttpClient) { }

  getAuthersNames(): Observable<any> {
    return this.http.get(environment.server + '/auther/getauthersnames');
  }

  getAuthers(page: string): Observable<any> {
    return this.http.get(environment.server + '/auther/getauthers', {
      params: {
        page
      }
    });
  }

  addAuther(data: FormData): Observable<any> {
    return this.http.post(environment.server + '/auther/addAuther', data);
  }

  updateAuther(data: FormData): Observable<any> {
    return this.http.put(environment.server + '/auther/updateauther', data);
  }
}
