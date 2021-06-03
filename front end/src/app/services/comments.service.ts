import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(page: string, bookId: string): Observable<any> {
    return this.http.get(environment.server + '/comments/getcomments.php', {params: {
      page, bookId
    }});
  }

  addComment(body: string, userId: string, bookId: string): Observable<any> {
    return this.http.post(environment.server + '/comments/addcomment.php', {userId, body, bookId});
  }
}
