import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutherService {

  constructor(private http: HttpClient) { }

  getAuthersNames(): Observable<any> {
    return this.http.get(environment.server + '/auther/getauthersnames.php');
  }

  getAuthers(page: string): Observable<any> {
    return this.http.get(environment.server + '/auther/getauthers.php', {
      params: {
        page
      }
    });
  }

  addAuther(data: FormData): Observable<any> {
    return this.http.post(environment.server + '/auther/addauther.php', data);
  }

  updateAuther(data: FormData): Observable<any> {
    return this.http.post(environment.server + '/auther/updateauther.php', data);
  }
}
