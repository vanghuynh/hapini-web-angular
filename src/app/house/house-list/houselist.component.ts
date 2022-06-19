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
import { I18nService } from '@app/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'house-list',
  templateUrl: './houselist.component.html',
  styleUrls: ['./houselist.component.scss']
})
export class HouseListComponent implements OnInit {

  quote: string;
  houses: IHouse[];
  cities: IAddressSetting[] = [];
  districts: IAddressSetting[] = [];

  selectedCity: string = '';
  selectedDistrict: string = '';
  sortBy: string = '';
  available: boolean;
  priceOrderBy: boolean; 
  lastDateOrderBy: boolean;

  public show:boolean = false;
  public buttonIcon:any = 'keyboard_arrow_down';//keyboard_arrow_up
  
  constructor(private houseService: HouseService,
      private router: Router,
      private addressService: AddressService,
      private activatedRoute: ActivatedRoute,
      private i18nService: I18nService,
      private meta: Meta,
      private title: Title) { }

  ngOnInit() {
    console.log("house list: ", this.activatedRoute.params);
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      let urlParams: string = params['params'];
      if(urlParams && urlParams.split("_") && urlParams.split("_").length > 2){
        console.log("params split: ", urlParams.split("_"));
        this.selectedCity = urlParams.split("_")[0];
        this.selectedDistrict = urlParams.split("_")[1];
        this.sortBy = urlParams.split("_")[2];
        if(this.sortBy == ""){
          this.available = false;
          this.priceOrderBy = false;
          this.lastDateOrderBy = false;

        } else if(this.sortBy == "Price"){
          this.priceOrderBy = true;
          this.available = true;
          this.lastDateOrderBy = false;
        } else if(this.sortBy == "Latest"){
          this.sortBy = 'Latest';
          this.priceOrderBy = false;
          this.available = true;
          this.lastDateOrderBy = true;
        } else if(this.sortBy == "Available"){
          this.priceOrderBy = false;
          this.available = true;
          this.lastDateOrderBy = false;
        }
        this.pageIndex = +urlParams.split("_")[3];
      } else {
        this.selectedCity = "";
        this.selectedDistrict = "";
        this.available = false;
        this.priceOrderBy = false;
        this.lastDateOrderBy = false;
        this.pageIndex = 0;
      }
      this.getHouses(this.pageIndex, this.pageSize, "", this.selectedDistrict,
                     this.available, this.priceOrderBy, this.lastDateOrderBy);
    });
    this.addressService.getCities()
    .pipe(finalize(() => {  }))
    .subscribe((cities: IAddressSetting[]) => { 
      this.cities = cities; 
      console.log("cities: ", this.cities);
    });
    if(this.selectedCity && this.selectedCity != ""){
      this.addressService.getDistricts(this.selectedCity)
      .pipe(finalize(() => {  }))
      .subscribe((districts: IAddressSetting[]) => { 
        this.districts = districts; 
        console.log("districts: ", this.districts);
      });
    }
  }

  private getHouses(pageIndex: number, pageSize: number, term: string, districtCode: string,
    available: boolean, priceOrderBy: boolean, lastDateOrderBy: boolean){
    this.houseService.getHousesPageByConditionsAndSorting(pageIndex,pageSize,term,districtCode,
      available, priceOrderBy, lastDateOrderBy)
    .pipe(finalize(() => { console.log("finished loading") }))
    .subscribe((res: IPagedResults<IHouse[]>) => { 
      if(res && res.content){
        this.houses = res.content as IHouse[];
        updateHouses(this.houses);
        this.length = res.totalElements;
        this.meta.updateTag(
          { name: 'og:title', content: this.i18nService.instant('APP_NAME') },
          `name='og:title'`
        );
        this.meta.updateTag(
          { name: 'og:description', content: this.i18nService.instant('about.description') },
          `name='og:description'`
        );
        this.meta.updateTag(
          { name: 'og:image', content: 'http://hapinistay.com/assets/hapinistay-logo.png' },
          `name='og:image'`
        );
        console.log("update meta tag", this.meta.getTag(`name='og:description'`));

      } else {
        this.houses = [];
        this.length = 0;
      }
    });
  }

  onSubmit(){
    this.pageIndex = 0;
    console.log("selected city, selected district: ", this.selectedCity, this.selectedDistrict);
    this.getHouses(this.pageIndex, this.pageSize, "", this.selectedDistrict, 
    this.available, this.priceOrderBy, this.lastDateOrderBy);
    window.history.pushState({}, this.i18nService.instant("APP_NAME"),`/houses/search/${this.selectedCity}_${this.selectedDistrict}_${this.sortBy}_${this.pageIndex}`);
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
    //window.history.pushState({}, this.i18nService.instant("APP_NAME"),`/houses/search/all_${this.selectedDistrict}_${this.selectedCity}`);
  }

  resetSearch(){
    this.pageIndex = 0;
    this.selectedCity = '';
    this.selectedDistrict = '';
    this.sortBy = '';
    this.priceOrderBy = false;
    this.available = false;
    this.lastDateOrderBy = false;
    console.log("selected city, selected district: ", this.selectedCity, this.selectedDistrict);
    this.getHouses(this.pageIndex, this.pageSize, "", this.selectedDistrict,
    this.available, this.priceOrderBy, this.lastDateOrderBy);
    window.history.pushState({}, this.i18nService.instant("APP_NAME"),`/houses/search/all`);
  }

  contactHouse(house: IHouse){
    if(house.contact){
      this.router.navigate(['/houses/contact', house.contact.id]);
    }
  }

  toggle() {
    this.show = !this.show;
    // change the icon of the show hide button
    if(this.show){
      this.buttonIcon = "keyboard_arrow_up";
    }else{
      this.buttonIcon = "keyboard_arrow_down";
    }
  }

  priceSelect(value: string){
    this.sortBy = 'Price';
    this.priceOrderBy = true;
    this.available = true;
    this.lastDateOrderBy = false;
  }

  latestSelect(value: string){
    this.sortBy = 'Latest';
    this.priceOrderBy = false;
    this.available = true;
    this.lastDateOrderBy = true;
  }

  availableSelect(value: string){
    this.sortBy  = 'Available';
    this.priceOrderBy = false;
    this.available = true;
    this.lastDateOrderBy = false;
  }

  bestMatchSelect(value: string){
    this.sortBy  = '';
    this.priceOrderBy = false;
    this.available = false;
    this.lastDateOrderBy = false;
  }
}
