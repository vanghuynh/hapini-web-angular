import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { RoomService } from '@app/core/services/room.service';
import { IAddressSetting, IImage, IRoom } from '@app/model/interfaces';
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
import { updateRoom, getRoomImages } from "@app/core/util/common.util";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
@Component({
  selector: 'room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {

  room: IRoom;
  roomId: number;
  houseId: number;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  
  constructor(private roomService: RoomService,
    private fb: FormBuilder,
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
      const roomId = +params['roomId'];
      this.roomId = roomId;
      this.getRoom(this.roomId);
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

  private getRoom(roomId:number){
    if (roomId && roomId != 0) {
      this.roomService.getRoomById(roomId)
      .pipe(finalize(() => {  }))
      .subscribe(room => {
        this.room = room;
        updateRoom(this.room);
        this.galleryImages = getRoomImages(this.room);
        console.log("Room: ", this.room)
      }, err =>{
        console.log("Error getting room", err)
      });
    }
  }

  contactHouse(){
    if(this.houseId){
      this.router.navigate(['/houses/contact', this.houseId]);
    }
  }

}
