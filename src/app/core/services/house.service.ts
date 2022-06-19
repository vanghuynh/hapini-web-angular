import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { IPagedResults, IHouse, IResponseData} from '@app/model/interfaces';

@Injectable()
export class HouseService {

    constructor(private http: HttpClient) { }

    getHousesOfUser(userId: number): Observable<IHouse[]> {
        return this.http.get<IResponseData<IHouse[]>>(
            `${endpoints.baseEndpoint()}/houses/user/${userId}`)
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    getHousesByDistrictCode(page: number, pageSize: number, districtCode:string): Observable<IHouse[]> {
        let params = {
            districtCode: districtCode
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/searchdistrict/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    let houses: IHouse[] = res.data.content;
                    return houses;
                })
            );
    }

    getHousesPageByAllTermIdDistrict(page: number, pageSize: number, 
        searchTerm:string, houseId:number, districtCode:string): Observable<IPagedResults<IHouse[]>> {
        let params = {
            searchTerm: searchTerm,
            houseId: String(houseId),
            districtCode: districtCode
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/searchtermiddistrict/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    getHouse(id: number): Observable<IHouse> {
        return this.http
            //.cache()
            .get<IResponseData<IHouse>>(`${endpoints.baseEndpoint()}/houses/${id}`)
            .pipe(
                map(res => res.data)
            );
    }

    createHouse(house: IHouse): Observable<IHouse> {
        return this.http
          .post(`${endpoints.baseEndpoint()}/houses/`, house)
          .pipe(
            map((res:any) => res.data)
        );
    }

    createHouseWithImages(house: IHouse, userId:number, imageIds:number[]): Observable<IHouse> {
        console.log("imageIds: ", imageIds);
        var httpParams = new HttpParams();
        if(userId && userId != 0){
            httpParams = httpParams.append("user_id", String(userId));
        }
        if(imageIds && imageIds.length > 0){
            imageIds.forEach(e => {
                httpParams = httpParams.append("imageIds", String(e));
            })
        }
        console.log("httpParams: ", httpParams);
        return this.http
          .post(`${endpoints.baseEndpoint()}/houses/images`, house, {params: httpParams})
          .pipe(
            map((house:any) => house.data)
        );
    }

    deleteHouseOfUser(userId: number, houseId: number): Observable<any> {
        return this.http.delete<string>(`${endpoints.baseEndpoint()}/houses/${userId}/${houseId}`);
    }

    getHousesPageByStatus(page: number, pageSize: number, 
        status:string): Observable<IPagedResults<IHouse[]>> {
        let params = {
            status: status
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/search-status/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    getHousesPageByStatusAndDistrict(page: number, pageSize: number, 
        status:string, districtCode:string): Observable<IPagedResults<IHouse[]>> {
        let params = {
            status: status,
            districtCode: districtCode
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/search-status-district/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    return res.data;
                })
            );
    }

    changeHouseStatus(houseId: number, status:string): Observable<IHouse> {
        let params = {
            status: status
        }
        return this.http.get<IResponseData<IHouse>>(
            `${endpoints.baseEndpoint()}/houses/${houseId}/status`, {params: params})
            .pipe(
                map(res => {
                    let house: IHouse = res.data;
                    return house;
                })
            );
    }

    getHousesPageByConditionsAndSorting(page: number, pageSize: number, 
        searchTerm:string, districtCode:string, available: boolean, 
        priceOrderBy: boolean, lastDateOrderBy: boolean): Observable<IPagedResults<IHouse[]>> {
        let params = {
            searchTerm: searchTerm,
            districtCode: districtCode,
            available: available ? "true" : "false",
            priceOrderBy: priceOrderBy ? "true" : "false",
            lastDateOrderBy: lastDateOrderBy ? "true" : "false"
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/advanced-search-order/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    if(res && res.data){
                        return res.data;
                    }
                    return null;
                })
            );
    }

    getHousesPageByHotPost(page: number, pageSize: number,
        available: boolean, 
        houseStatus: string, roomStatus: string): Observable<IPagedResults<IHouse[]>> {
        let params = {
            available: available ? "true" : "false",
            houseStatus: "APPROVE",
            roomStatus: "APPROVE",
        }
        return this.http.get<IResponseData<IPagedResults<IHouse[]>>>(
            `${endpoints.baseEndpoint()}/houses/hot-post-search/${page}/${pageSize}`, {params: params})
            .pipe(
                map(res => {
                    if(res && res.data){
                        return res.data;
                    }
                    return null;
                })
            );
    }
}
