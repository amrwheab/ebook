import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDeparts(): Observable<any> {
    return this.http.get(environment.server + '/departs/getdeparts.php');
  }

  updateDepart(data: object): Observable<any> {
    return this.http.put(environment.server + '/departs/editdepartname.php', data);
  }

  addDepart(departName: string): Observable<any> {
    return this.http.post(environment.server + '/departs/newdepart.php', {departName});
  }

  deleteDepart(id: string): Observable<any> {
    return this.http.delete(environment.server + '/departs/deletedepart.php', {params: {id}});
  }
}
