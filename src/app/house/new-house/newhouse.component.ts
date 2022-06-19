import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IAddressSetting, IImage, IHouse } from '@app/model/interfaces';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { MouseEvent, AgmMarker } from '@agm/core';
import { environment } from '@env/environment';

@Component({
  selector: 'new-house',
  templateUrl: './newhouse.component.html',
  styleUrls: ['./newhouse.component.scss']
})
export class NewHouseComponent implements OnInit {

  house: IHouse;
  houseId: number;
  roomForm: FormGroup;
  cities: IAddressSetting[] = [];
  districts: IAddressSetting[] = [];
  wards: IAddressSetting[] = [];

  selectedCity: string = '';
  selectedDistrict: string = '';
  selectedWard: string = '';
  initRoomForm: any;
  imageIds: number[] = [];
  lat: number;
  lng: number;
  zoom: number = 12;
  newHouseForm: FormGroup;

  constructor(private houseService: HouseService,
    private formBuilder: FormBuilder,
    private HttpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private addressService: AddressService) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const houseId = +params['houseId'];
      this.houseId = houseId;
      this.getHouse(this.houseId);
    });
    this.addressService.getCities()
    .pipe(finalize(() => {  }))
    .subscribe((cities: IAddressSetting[]) => { 
      this.cities = cities; 
      console.log("cities: ", this.cities);
    });
  }

  private createForm() {
    this.newHouseForm = this.formBuilder.group({
      name: new FormControl(this.house.name, Validators.required),
      description: new FormControl(this.house.description, Validators.required),
      city: new FormControl(this.house.address.city, Validators.required),
      district: new FormControl(this.house.address.district, Validators.required),
      ward: new FormControl(this.house.address.ward, Validators.required),
      streetName: new FormControl(this.house.address.streetName, Validators.required),
      streetNumber: new FormControl(this.house.address.streetNumber, Validators.required),
      electricity: new FormControl(this.house.facility.electricity, Validators.required),
      water: new FormControl(this.house.facility.water, Validators.required),
      note: new FormControl(this.house.facility.note),
      flexTime: new FormControl(this.house.policy.flexTime, Validators.required),
      cookMeal: new FormControl(this.house.policy.cookMeal, Validators.required),
      packing: new FormControl(this.house.policy.packing, Validators.required),
      wifi: new FormControl(this.house.policy.wifi, Validators.required),
      contactName: new FormControl(this.house.contact.name, Validators.required),
      contactEmail: new FormControl(this.house.contact.email, [Validators.email]),
      contactPhone: new FormControl(this.house.contact.phone, Validators.required),
    });
  }
  
  private getHouse(houseId:number){
    if (houseId && houseId != 0) {
      this.houseService.getHouse(houseId)
      .pipe(finalize(() => {  }))
      .subscribe(house => {
        this.house = house;
        if(this.house.address){
          this.lat = this.house.address.latitude;
          this.lng = this.house.address.longitude;
        }
        console.log("House: ", this.house)
        this.initSelectOptions();
        this.createForm();
      }, err =>{
        console.log("Error getting house")
      });
    } else {
      this.initHouse();
      this.createForm();
    }
  }

  private initSelectOptions(){
    this.citySelect(this.house.address.city);
    this.districtSelect(this.house.address.district);
    this.wardSelect(this.house.address.ward);
  }

  private initHouse(){
    this.house = {
      id: "",
      nameVi: "",
      nameEn: "",
      name: "",
      status: "PENDING",
      descriptionVi: "",
      descriptionEn: "",
      description: "",
      address: {
          id: "",
          streetNumber: "",
          streetNameVi: "",
          streetNameEn: "",
          streetName: "",
          "ward": "",
          "district": "",
          "city": "",
          "province": "",
          "latitude": Number(environment.latitude),
          "longitude": Number(environment.longitude),
          "wardName": "",
          "districtName": "",
          "cityName": ""
      },
      "images": [],
      "comments": [],
      "avatar": "",
      "facility": {
          "id": "",
          "electricity": "",
          "water": "",
          "noteEn": "",
          "noteVi": "",
          "note": ""
      },
      "policy": {
          "id": "",
          "flexTime": true,
          "cookMeal": true,
          "packing": false,
          "wifi": false
      },
      "rooms": [],
      "contact": {
          "id": "",
          "name": "",
          "email": "",
          "phone": "",
          "avatar": ""
      }
    };
    this.lat = Number(environment.latitude);
    this.lng = Number(environment.longitude);
  }
  onSubmit() {
    let userId:number;
    this.house.address.latitude = this.lat;
    this.house.address.longitude = this.lng;
    console.log("user credentials: ", this.authenticationService.credentials);
    if(this.authenticationService.credentials && this.authenticationService.credentials.userId){
      userId = this.authenticationService.credentials.userId;
    }
    this.house.name = this.newHouseForm.value.name;
    this.house.description = this.newHouseForm.value.description;
    this.house.address.city = this.newHouseForm.value.city;
    this.house.address.district = this.newHouseForm.value.district;
    this.house.address.ward = this.newHouseForm.value.ward;
    this.house.address.streetName = this.newHouseForm.value.streetName;
    this.house.address.streetNumber = this.newHouseForm.value.streetNumber;

    this.house.facility.electricity = this.newHouseForm.value.electricity;
    this.house.facility.water = this.newHouseForm.value.water;
    this.house.facility.note = this.newHouseForm.value.note;


    this.house.policy.flexTime = this.newHouseForm.value.flexTime;
    this.house.policy.cookMeal = this.newHouseForm.value.cookMeal;
    this.house.policy.packing = this.newHouseForm.value.packing;
    this.house.policy.wifi = this.newHouseForm.value.wifi;
    
    this.house.contact.name = this.newHouseForm.value.contactName;
    this.house.contact.email = this.newHouseForm.value.contactEmail;
    this.house.contact.phone = this.newHouseForm.value.contactPhone;

    console.log("user ID: ", userId);
    this.houseService.createHouseWithImages(this.house, userId, this.imageIds)
    .pipe(finalize(() => {  }))
    .subscribe((house: IHouse) => { 
      this.house = house; 
      console.log("Created house: ", this.house);
      this.router.navigate(['/houses/myhouses']);
    });
  }

  citySelect(code:string){
    this.selectedCity = code;
    if(code && code != ''){
      this.addressService.getDistricts(this.selectedCity)
      .pipe(finalize(() => {  }))
      .subscribe((districts: IAddressSetting[]) => { 
        this.districts = districts; 
        console.log("districts: ", this.districts);
      });
    } else {
      this.selectedDistrict = "";
    }
  }

  districtSelect(code:string){
    this.selectedDistrict = code;
    if(code && code != ""){
      this.addressService.getWards(this.selectedCity, this.selectedDistrict)
      .pipe(finalize(() => {  }))
      .subscribe((wards: IAddressSetting[]) => { 
        this.wards = wards; 
        console.log("wards: ", this.wards);
      });
    } else {
      this.selectedWard = "";
    }
  }

  wardSelect(code:string){
    this.selectedWard = code;
  }

  onImageUpload(args:any){
    console.log('onImageUpload: ', args);
    this.imageIds = args as number[];
    //this.getHouse(this.houseId);
  }

  onAllImageUploaded(args:any){
    console.log("All images: ", args);
    let images: IImage[] = args;
    this.house.images.push.apply(this.house.images, images);
    console.log("onAllImageUploaded: ", this.house);
  }

  addRoom(){
    this.router.navigate(['/houses/myhouses', this.house.id, 0]);
  }

  listRooms(){
    this.router.navigate(['/houses/myrooms', this.house.id]);
  }

  markerDragEnd(event: MouseEvent) {
    console.log('dragEnd', event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
}
