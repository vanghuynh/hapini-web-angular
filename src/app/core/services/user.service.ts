import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import {IUser, IUserPassword} from '@app/model/interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    registerUser(user: IUser): Observable<IUser> {
        return this.http
          .post(`${endpoints.baseEndpoint()}/users/sign-up`, user)
          .pipe(
            map((res:any) => res.data)
        );
    }

    changeUserPassword(userPassword: IUserPassword): Observable<string> {
        return this.http
          .post(`${endpoints.baseEndpoint()}/users/change-password`, userPassword)
          .pipe(
            map((res:any) => res.data)
        );
    }

    resetUserPassword(userPassword: IUserPassword): Observable<string> {
        return this.http
          .post(`${endpoints.baseEndpoint()}/users/reset-password`, userPassword)
          .pipe(
            map((res:any) => res.data)
        );
    }

    getUserForResetPassword(userId: string, code: string): Observable<IUserPassword> {
      let params = {
        userId: userId,
        code: code
      }
      return this.http
        .get(`${endpoints.baseEndpoint()}/users/get-user`, {params: params})
        .pipe(
          map((res:any) => res.data)
      );
    }

    forgetUserPassword(userPassword: IUserPassword): Observable<string> {
      return this.http
        .post(`${endpoints.baseEndpoint()}/users/forget-password`, userPassword)
        .pipe(
          map((res:any) => res.data)
      );
    }
}
