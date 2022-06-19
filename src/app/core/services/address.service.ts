import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import {IAddressSetting} from '@app/model/interfaces';

@Injectable()
export class AddressService {

    constructor(private http: HttpClient) { }

    getCities(){
        return this.http.get<IAddressSetting[]>(`/setting/cities`)
            .pipe(
                map(adress => {
                    return adress;
                })
            );
    }

    getDistricts(cityCode:string){
        let params = {
            cityCode: cityCode
        }
        return this.http.get<IAddressSetting[]>(`/setting/districts`, {params: params})
            .pipe(
                map(adress => {
                    return adress;
                })
            );
    }

    getWards(cityCode:string, districtCode:string){
        let params = {
            cityCode: cityCode,
            districtCode: districtCode
        }
        return this.http.get<IAddressSetting[]>(`/setting/wards`, {params: params})
            .pipe(
                map(adress => {
                    return adress;
                })
            );
    }
}
