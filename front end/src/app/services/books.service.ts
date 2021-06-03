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

  getBooks(page: number, search: string, limit: string): Observable<any> {
    return this.http.get(environment.server + '/book/getallbooks.php', {
      params: {
        page : page.toString(),
        search,
        limit
      }
    });
  }

  getDepartedBooks(id: string): Observable<any> {
    return this.http.get(environment.server + '/book/getdepartbooks.php' , {params:{id}});
  }

  getByDepartName(name: string, page: string): Observable<any> {
    return this.http.get(environment.server + '/book/getbydepartname.php', {params: {name, page}});
  }

  getFeaturedBooks(): Observable<any> {
    return this.http.get(environment.server + '/book/getfeatbooks.php');
  }

  getMostBuyedBooks(): Observable<any> {
    return this.http.get(environment.server + '/book/getmostbuyedbooks.php');
  }

  getBookBySlug(slug: string): Observable<any> {
    return this.http.get(environment.server + '/book/getbookbyslug.php', {params: {slug}});
  }

  getRelatedBooks(department: string, auther: string, bookId: string): Observable<any> {
    return this.http.get(environment.server + '/book/getrelatedbooks.php', {params: {department, auther, bookId}});
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
