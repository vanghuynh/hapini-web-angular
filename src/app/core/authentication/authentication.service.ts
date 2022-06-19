import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { Credentials, LoginContext } from "../../model/interfaces";
const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;

  constructor(private http: HttpClient) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Login using username and password
   */
  getAuthTokenPassword(user: string, pass: string): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Basic Zm9vQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ='
        }),
        params: new HttpParams()
            .set('grant_type', 'password')
            .set('username', user)
            .set('password', pass),
        withCredentials: true
    };
    return this.http.post<any>(`${endpoints.baseEndpoint()}/oauth/token`, {}, httpOptions)
        .pipe(map(res => res));
  }

  registerNewUser(user: string, pass: string, name: string, phone: string): Observable<any> {
    console.log('user, pass, name, phone', user, pass, name, phone);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let body = {
        "username": user,
        "password": pass,
        "name": name,
        "phone": phone
    };
    return this.http.post<any>(`${endpoints.baseEndpoint()}/users/sign-up`, body, { headers: headers })
        .pipe(map(res => res));
  }

  refreshTokenOauth(): Observable<string> {
    const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': 'Basic Zm9vQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ='
        }),
        params: new HttpParams()
            .set('grant_type', 'refresh_token'),
        withCredentials: true
    };
    const data = new FormData();
    data.append('refresh_token', this._credentials.refreshToken);
    return this.http.post<any>(`${endpoints.baseEndpoint()}/oauth/token`, data, httpOptions)
        .pipe(tap(res => { console.log('refreshTokenOauth: ', res); }), map(res => res.access_token));
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Checks is the admin user is authenticated.
   * @return True if the admin user is authenticated.
   */
  isAdminAuthenticated(): boolean {
    return !!this.credentials && this.credentials.authority == 'ADMIN_AUTHORITY';
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}
