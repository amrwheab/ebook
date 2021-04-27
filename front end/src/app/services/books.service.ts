import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) {}

  addBook(data: FormData): Observable<any> {
    return this.http.post(environment.server + '/book/addbook.php', data);
  }

  getBooks(page: number): Observable<any> {
    return this.http.get(environment.server + '/book/getallbooks.php', {
      params: {
        page : page.toString()
      }
    });
  }

  getDepartedBooks(id: string): Observable<any> {
    return this.http.get(environment.server + '/book/getdepartbooks.php/' + id);
  }

  getFeaturedBooks(): Observable<any> {
    return this.http.get(environment.server + '/book/getfeatbooks.php');
  }

  deleteBooks(data: string[]): Observable<any> {
    let query = '/book/deletebook.php';
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        query += `?ids[0]=${data[0]}`;
      } else {
        query += `&ids[${i}]=${data[i]}`;
      }
    }
    return this.http.delete(environment.server + query);
  }

  updateBooks(data: FormData): Observable<any> {
    return this.http.post(environment.server + '/book/updatebook.php', data);
  }
}
