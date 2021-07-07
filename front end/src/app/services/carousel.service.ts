import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private url = environment.server + '/carousel';

  constructor(private http: HttpClient) { }

  getCarousel(): Observable<any> {
    return this.http.get(this.url + '/getcarousel.php');
  }

  addCarousel(data: FormData): Observable<any> {
    return this.http.post(this.url + '/addcarousel.php', data);
  }

  updateCarousel(data: FormData): Observable<any> {
    return this.http.post(this.url + '/updatecarousel.php', data);
  }

  deleteCarousel(id: string): Observable<any> {
    return this.http.delete(this.url + '/deletecarousel.php' , {params: {id}});
  }
}
