import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import {IContact, IResponseData, IPagedResults} from '@app/model/interfaces';

@Injectable()
export class ContactService {

    constructor(private http: HttpClient) { }

    getContactById(contactId:number): Observable<IContact>{
        return this.http.get<IContact>(`${endpoints.baseEndpoint()}/contact/${contactId}`)
            .pipe(
                map(res => {
                    return res;
                })
            );
    }
}
