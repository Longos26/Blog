import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class BlogFService {
  private apiURL = 'http://localhost//blog_assessment-no/api/';

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  
  createBlog(form:any): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiURL}create-blog`, form, {headers, withCredentials: true});
  }

  searchBlogs(search: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}search-blogs?search=${search}`);
  }

  displayBlogs(): Observable<any> {
  return this.http.get<any>(`${this.apiURL}blogs`);    
  }

  displayBlogById(blog_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}blogs/${blog_id}`);
  }

  getCurrentUserId(): number | null {
    const token = this.cookieService.get('token');
    if (!token) {
      return null;
    }

    const decoded: any = jwtDecode(token);
    return decoded.user_id;
  }

  updateBlog(blog_title: string, blog_body: string, blog_id: number): Observable<any> {
    
    const blogData = {blog_title, blog_body, blog_id};
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.apiURL}edit-blog`, blogData, {headers, withCredentials: true});
  }

  deleteBlog(blog_id: number): Observable<any> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${this.apiURL}delete-blog?blog_id=${blog_id}`, {headers, withCredentials: true});
  }
}
