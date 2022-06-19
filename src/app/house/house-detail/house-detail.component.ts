import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IAddressSetting, IImage, IHouse, IRoom } from '@app/model/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { MouseEvent, AgmMarker } from '@agm/core';
import { updateHouse, getHouseImages } from "../../core/util/common.util";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss']
})
export class HouseDetailComponent implements OnInit, AfterViewInit {

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

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  
  /** This map type displays a transparent layer of major streets on satellite images. */
  //HYBRID,
  /** This map type displays a normal street map. */
  //ROADMAP,
  /** This map type displays satellite images. */
  //SATELLITE,
  /** This map type displays maps with physical features such as terrain and vegetation. */
  //TERRAIN
  mapTypeId: string = 'roadmap';
  zoom: number = 14;
  
  constructor(private houseService: HouseService,
    private fb: FormBuilder,
    private HttpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private addressService: AddressService,
    private meta: Meta,
    private title: Title) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const houseId = +params['houseId'];
      this.houseId = houseId;
      this.getHouse(this.houseId);
    });
    this.galleryOptions = [
      {
        width: '100%',
        height: '600px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnEsc: true,
        previewCloseOnClick: true,
        previewSwipe: true,
        previewArrows: true,
        thumbnailsArrows: true,
        thumbnailsSwipe: true
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '400px',
        imagePercent: 100,
        thumbnailsPercent: 30,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 400,
        width: '100%',
        height: '200px',
        thumbnailsPercent: 30,
      }
    ];

    this.galleryImages = [
      {
          small: 'assets/hapinistay-logo.png',
          medium: 'assets/hapinistay-logo.png',
          big: 'assets/hapinistay-logo.png'
      },
      {
          small: 'assets/hapinistay-logo.png',
          medium: 'assets/hapinistay-logo.png',
          big: 'assets/hapinistay-logo.png'
      },
      {
          small: 'assets/hapinistay-logo.png',
          medium: 'assets/hapinistay-logo.png',
          big: 'assets/hapinistay-logo.png'
      }   
    ];
  }

  ngAfterViewInit(): void {
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
        updateHouse(this.house);
        this.meta.updateTag(
          { name: 'og:title', content: this.house.name },
          `name='og:title'`
        );
        this.meta.updateTag(
          { name: 'og:description', content: this.house.description },
          `name='og:description'`
        );
        this.meta.updateTag(
          { name: 'og:image', content: this.house.avatar },
          `name='og:image'`
        );
        console.log("update meta tag", this.meta.getTag(`name='og:image'`));
        let newImages = getHouseImages(this.house);
        setInterval(() => {
          this.galleryImages = newImages;
        }, 500);

        console.log("galleryImages from house this.galleryImages", this.galleryImages);
        console.log("House: ", this.house)
        //this.initSelectOptions();
      }, err =>{
        console.log("Error getting house")
      });
    }
  }

  private initSelectOptions(){
    this.citySelect(this.house.address.city);
    this.districtSelect(this.house.address.district);
    this.wardSelect(this.house.address.ward);
  }

  onSubmit() {
    let userId:number;
    this.house.address.latitude = this.lat;
    this.house.address.longitude = this.lng;
    if(this.authenticationService.credentials && this.authenticationService.credentials.userId){
      userId = this.authenticationService.credentials.userId;
    }
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
    }
  }

  districtSelect(code:string){
    this.selectedDistrict = code;
    this.addressService.getWards(this.selectedCity, this.selectedDistrict)
      .pipe(finalize(() => {  }))
      .subscribe((wards: IAddressSetting[]) => { 
        this.wards = wards; 
        console.log("wards: ", this.wards);
      });
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

  contactHouse(house: IHouse){
    if(house.contact){
      this.router.navigate(['/houses/contact', house.contact.id]);
    }
  }

  viewRoom(room: IRoom){
    this.router.navigate(['/houses/room', this.houseId, room.id]);
  }

}
