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
    return this.http.get(this.url + '/getcarousel');
  }
}
