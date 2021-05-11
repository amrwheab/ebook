import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private http: HttpClient) { }

  getBuyedBooks(userId: string, page: string): Observable<any> {
    return this.http.get(environment.server + '/buy/getbuyed.php', {params: {userId, page}});
  }

  getOneBuyed(userId: string, bookId: string): Observable<any> {
    return this.http.get(environment.server + '/buy/getonebuyed.php', {params: {userId, bookId}});
  }

  buyBook(stripeToken: string, userId: string, bookIds: string[]): Observable<any> {
    return this.http.post(environment.server + '/buy/addbuy.php', {stripeToken, userId, bookIds});
  }
}
