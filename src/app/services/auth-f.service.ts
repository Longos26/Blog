import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFService {
  private apiURL = 'http://localhost//blog_assessment-no/api/';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const token = this.cookieService.get('token');
    if (token) {
      this._isLoggedIn.next(true);
    }
  }

  /* register(form:any): Observable<any> {
    const body = form;
    return this.http.post<any>(`${this.apiURL}register`, body);
  } */
  register(form: any): Observable<any> {
    const body = form;
    return this.http.post<any>(`${this.apiURL}register`, body).pipe(
      catchError(error => {
        console.error(error);
        // You can also return a default value or rethrow the error
        return throwError(error);
      })
    );
  }

  // NOTE: no need to send a token in POST bcoz we set a token in backend.
  //       Now we just need to get it from the cookie in the constructor to
  //       trigger _isLoggedIn = true
  login(email: string, password: string): Observable<{token: string}> {
    const body = {email, password};
    return this.http.post<{token: string}>(`${this.apiURL}login`, body); // make any -> <{token: string}> and finish JWT service and backend logic
  }

  logout(){
    this.cookieService.delete('token');
    this.cookieService.deleteAll();
    this._isLoggedIn.next(false);
  }

  // state
  get isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  setLoggedIn(value: boolean) {
    this._isLoggedIn.next(value);
  }  

  // TOKEN SHIT
  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getTokenId(token: string): string {
    const decoded = this.decodeToken(token);
    return decoded.id;
  }

  getTokenEmail(token:string): string {
    const decoded = this.decodeToken(token);
    return decoded.email;
  }
}
