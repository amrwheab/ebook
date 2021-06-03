import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private http: HttpClient) { }

  addRate(bookId: string, userId: string, value: string): Observable<any> {
    return this.http.post(environment.server + '/rate/addrate.php', {userId, bookId, value});
  }

  getRate(bookId: string, userId: string): Observable<any> {
    return this.http.get(environment.server + '/rate/getrate.php', {params: {userId, bookId}});
  }
}
