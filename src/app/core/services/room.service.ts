import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import {IRoom, IResponseData, IPagedResults} from '@app/model/interfaces';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class RoomService {

    constructor(private http: HttpClient,
        private authenticationService: AuthenticationService) { }

    getRoomById(roomId:number): Observable<IRoom>{
        return this.http.get<IResponseData<IRoom>>(`${endpoints.baseEndpoint()}/rooms/${roomId}`)
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    addRoomToHouse(houseId:number, room: IRoom):Observable<IRoom>{
        return this.http.post<IResponseData<IRoom>>(`${endpoints.baseEndpoint()}/houses/${houseId}/rooms`, room)
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    addRoomToHouseWithImage(houseId:number, room: IRoom, imageIds:number[]):Observable<IRoom>{
        var httpParams = new HttpParams();
        if(imageIds && imageIds.length > 0){
            imageIds.forEach(e => {
                httpParams = httpParams.append("imageIds", String(e));
            })
        }
        console.log("httpParams: ", httpParams);
        return this.http.post<IResponseData<IRoom>>(`${endpoints.baseEndpoint()}/houses/${houseId}/rooms/images`, room, {params: httpParams})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    getAllRoomsOfHouse(houseId:number): Observable<IRoom[]>{
        return this.http.get<IResponseData<IRoom[]>>(`${endpoints.baseEndpoint()}/houses/${houseId}/rooms`)
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    deleteRoomOfHouse(houseId:any, roomId: any): Observable<IRoom[]> {
        return this.http.delete<IResponseData<IRoom[]>>(`${endpoints.baseEndpoint()}/houses/${houseId}/rooms/${roomId}`)
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    enableRoomAvailable(room:IRoom, level: number): Observable<IRoom> {
        let params = {
            level: String(level),
            userId: String(this.authenticationService.credentials.userId)
        }
        return this.http.get<IResponseData<IRoom>>(`${endpoints.baseEndpoint()}/rooms/${room.id}/enable`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    disableRoomAvailable(room:IRoom): Observable<IRoom> {
        let params = {
            userId: String(this.authenticationService.credentials.userId)
        }
        return this.http.get<IResponseData<IRoom>>(`${endpoints.baseEndpoint()}/rooms/${room.id}/disable`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    getRoomsPageByStatus(page: number, pageSize: number, 
        status:string): Observable<IPagedResults<IRoom[]>> {
        let params = {
            status: status
        }
        return this.http.get<IResponseData<IPagedResults<IRoom[]>>>(
            `${endpoints.baseEndpoint()}/rooms/search-status/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    changeRoomStatus(roomId: number, status:string, level: number): Observable<IRoom> {
        let params = {
            status: status,
            level: String(level)
        }
        return this.http.get<IResponseData<IRoom>>(
            `${endpoints.baseEndpoint()}/rooms/${roomId}/status`, {params: params})
            .pipe(
                map(res => {
                    let room: IRoom = res.data;
                    return room;
                })
            );
    }
}
