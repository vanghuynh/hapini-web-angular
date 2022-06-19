import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { HouseService } from '@app/core/services/house.service';
import { IHouse, IPagedResults, IAddressSetting } from '@app/model/interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { updateHouses } from "../../core/util/common.util";
import { IImage } from 'ng-simple-slideshow';
import { MapTypeId } from '@agm/core/services/google-maps-types';
import { AddressService } from '@app/core/services/address.service';

@Component({
  selector: 'admin-house-list',
  templateUrl: './admin-houselist.component.html',
  styleUrls: ['./admin-houselist.component.scss']
})
export class AdminHouseListComponent implements OnInit {

  houses: IHouse[];
  cities: IAddressSetting[] = [];
  districts: IAddressSetting[] = [];

  selectedCity: string = '';
  selectedDistrict: string = '';
  
  constructor(private houseService: HouseService,
      private router: Router,
      private addressService: AddressService) { }

  ngOnInit() {
    this.pageIndex = 0;
    this.getHousesByStatus(this.pageIndex, this.pageSize, "PENDING");
    this.addressService.getCities()
    .pipe(finalize(() => {  }))
    .subscribe((cities: IAddressSetting[]) => { 
      this.cities = cities; 
      console.log("cities: ", this.cities);
    });
  }

  private getHousesByStatus(pageIndex: number, pageSize: number, status: string){
    this.houseService.getHousesPageByStatus(pageIndex,pageSize,status)
    .pipe(finalize(() => { console.log("finished loading") }))
    .subscribe((res: IPagedResults<IHouse[]>) => { 
      this.houses = res.content as IHouse[];
      updateHouses(this.houses);
      this.length = res.totalElements;
    }, err => {
      this.houses = [];
    });
  }

  private getHousesByStatusDistrictCode(pageIndex: number, pageSize: number, status: string, districtCode: string){
    this.houseService.getHousesPageByStatusAndDistrict(pageIndex,pageSize,status, districtCode)
    .pipe(finalize(() => { console.log("finished loading") }))
    .subscribe((res: IPagedResults<IHouse[]>) => { 
      this.houses = res.content as IHouse[];
      updateHouses(this.houses);
      this.length = res.totalElements;
    }, err => {
      this.houses = [];
    });
  }

  onSubmit(){
    this.pageIndex = 0;
    console.log("selected city, selected district: ", this.selectedCity, this.selectedDistrict);
    if(this.selectedDistrict && this.selectedDistrict != ""){
      this.getHousesByStatusDistrictCode(this.pageIndex, this.pageSize, "PENDING", this.selectedDistrict);
    } else{
      this.getHousesByStatus(this.pageIndex, this.pageSize, "PENDING");
    }
  }

  // MatPaginator Inputs
  length = 0;
  pageSize = 10;
  pageIndex: number = 0;

  pageEvent(event: PageEvent){
    console.log("Page: ", event)
    this.pageIndex = event.pageIndex;
    this.houseService.getHousesPageByAllTermIdDistrict(this.pageIndex,this.pageSize,"",0,"")
    .pipe(finalize(() => { console.log("Finished loading") }))
    .subscribe((res: IPagedResults<IHouse[]>) => { 
      this.houses = res.content as IHouse[]; 
      updateHouses(this.houses);
      this.length = res.totalElements;
      console.log("rooms, index: ", this.houses, this.pageIndex);
    });
  }

  viewHouse(house: IHouse){
    this.router.navigate(['/houses/detail', house.id]);
  }

  citySelect(selectedCity?: string){
    console.log("Selected City: ", selectedCity);
    console.log("this selected city: ", this.selectedCity);
    if(selectedCity){
      this.addressService.getDistricts(selectedCity)
      .pipe(finalize(() => {  }))
      .subscribe((districts: IAddressSetting[]) => { 
        this.districts = districts; 
        console.log("districts: ", this.districts);
      });
    } else {
      this.selectedDistrict = "";
      console.log("this selected city: ", this.selectedCity);
    }
  }

  districtSelect(code:string){
    this.selectedDistrict = code;
    console.log("this selected district: ", this.selectedDistrict);
  }

  resetSearch(){
    this.pageIndex = 0;
    this.selectedCity = '';
    this.selectedDistrict = '';
    console.log("selected city, selected district: ", this.selectedCity, this.selectedDistrict);
    this.getHousesByStatus(this.pageIndex, this.pageSize, "PENDING");
  }

  approveHouse(house: IHouse){
    this.houseService.changeHouseStatus(house.id, "APPROVE").subscribe(house => {
      console.log("House status changed: ", house);
      this.onSubmit();
    }, err => {
      console.log("Error change status");
    });
  }
}
