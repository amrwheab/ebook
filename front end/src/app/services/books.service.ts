import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get(environment.server + '/book/getallbooks');
  }

  deleteBooks(data: string[]): Observable<any> {
    return this.http.delete(environment.server + '/book/deletebook', {
      params: {ids: data}
    });
  }
}
