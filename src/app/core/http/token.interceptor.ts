import {throwError as observableThrowError,  Observable ,  BehaviorSubject } from 'rxjs';

import {take, filter, catchError, switchMap, finalize} from 'rxjs/operators';
import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
                private injector: Injector,
                private router: Router) {
                }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        if (
            req.url.includes("token") ||
            req.url.includes("sign-up")
        ) {
            console.log('token, sign-up: ', req);
            return req;
        }
        if(token && token != ""){
            return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }})
        }
        return req;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        const authService = this.injector.get(AuthenticationService);
        console.log('intercept: ', req);
        var token = '';
        if(authService.credentials && authService.credentials.token){
            token = authService.credentials.token;
        }
        return next.handle(this.addToken(req, token)).pipe(//req
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    console.log('intercept catchError: ', error);
                    switch ((<HttpErrorResponse>error).status) {
                        case 400:
                            return this.handle400Error(error);
                        case 401:
                            return this.handle401Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    handle400Error(error:any) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            console.log('handle400Error: ', error);
            return this.logoutUser();
        }
        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        const authService = this.injector.get(AuthenticationService);
        if(!authService.isAuthenticated() || authService.credentials.refreshToken == ''){
            return this.logoutUser();
        }
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            console.log('handle401Error: ', req);
            if(authService.credentials.refreshToken && authService.credentials.refreshToken != ''){
                return authService.refreshTokenOauth().pipe(
                    switchMap((newToken: string) => {
                        if (newToken) {
                            authService.credentials.token = newToken;
                            this.tokenSubject.next(newToken);
                            console.log('newToken: ', authService.credentials.token);
                            return next.handle(this.addToken(req, authService.credentials.token));
                        }
                        //If we don't get a new token, we are in trouble so logout.
                        return this.logoutUser();
                    }),
                    finalize(() => {
                        console.log('finalize refesh token: ', this.isRefreshingToken);
                        this.isRefreshingToken = false;
                    }));
            } else {
                this.logoutUser();
                //(["/login"]);
            }
            return this.logoutUser();
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(req, token));
                }));
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        const authService = this.injector.get(AuthenticationService);
        authService.logout();
        this.router.navigate(['/login']);
        return observableThrowError("logoutUser");
    }
}