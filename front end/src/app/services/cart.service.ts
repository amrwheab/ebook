import { Cart } from './../shard/cart';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  url = environment.server;
  cart: Cart[] = [];
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      // tslint:disable-next-line: deprecation
      this.getMiniCart(token).subscribe(cart => {
        this.cart = cart;
      }, err => {
        console.log(err);
      });
  }
}

  getMiniCart(token: string): Observable<any> {
    return this.http.get(this.url + '/cart/getminicart.php', {params: {token}});
  }

  getOneCart(token: string, bookId: string): Observable<any> {
    return this.http.get(this.url + '/cart/getonecart.php', {params: {token, bookId}});
  }

  getFullCart(token: string): Observable<any> {
    return this.http.get(this.url + '/cart/getfullcart.php', {params: {token}});
  }

  addToCart(bookId: string, token: string): Observable<any> {
    return this.http.post(this.url + '/cart/addtocart.php', {bookId, token});
  }

  removeFromCart(bookId: string, token: string): Observable<any> {
    return this.http.delete(this.url + '/cart/deletefromcart.php', {params: {bookId, token}});
  }
}

