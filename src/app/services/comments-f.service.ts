import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode} from 'jwt-decode';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class CommentsFService {
  private apiURL = 'http://localhost//blog_assessment-no/api/';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // POST
  makeComment(comment_body: string, comment_blog_id: number, comment_user_id:number): Observable<any> {
    const commentData = {comment_body, comment_blog_id, comment_user_id};
    const token = this.cookieService.get('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.http.post<any>(`${this.apiURL}create-comment`, commentData, {headers, withCredentials: true});
  }

  // GET
  getBlogComments(blog_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}comments/${blog_id}`);
  }

  // PUT
  updateComment(comment_id: number): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiURL}edit-comment`, comment_id, {headers, withCredentials: true})
  }

  // DELTE
  deleteBlogComment(comment_id: number): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiURL}delete-comment?comment_id=${comment_id}`, {headers, withCredentials: true} );
  }

}
