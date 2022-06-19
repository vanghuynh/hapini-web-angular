import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Angulartics2Module } from 'angulartics2';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HouseRoutingModule } from './house-routing.module';
import { HouseListComponent } from './house-list/houselist.component';
import { MyHouseListComponent } from "./my-house-list/myhouselist.component";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { NewHouseComponent } from './new-house/newhouse.component';
import { NewRoomComponent } from "./new-room/new-room.component";
import { MyRoomListComponent } from "./my-room-list/myroomlist.component";
import { HouseDetailComponent } from './house-detail/house-detail.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { AgmCoreModule } from '@agm/core';
import { environment } from "../../environments/environment";
import { NgxGalleryModule } from 'ngx-gallery';
import { HouseContactComponent } from "./house-contact/house-contact.component";
import { RoomDetailComponent } from "./room-detail/room-detail.component";
import { EnableRoomComponent } from "./enable-room/enable-room.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWifi, faClock, faUtensils, faMotorcycle,
  faCheckCircle, faPhone, faBed, faDollarSign, faHistory,
  faBan, faGlobeAsia, faRestroom, faToilet, faMale, faFemale, faSquare,
  faUsers, faListAlt, faComments } from '@fortawesome/free-solid-svg-icons'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    Angulartics2Module,
    HouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlideshowModule,
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey
      /* apiKey is required, unless you are a 
      premium customer, in which case you can 
      use clientId 
      */
    }),
    FontAwesomeModule

  ],
  declarations: [
    HouseListComponent,
    NewRoomComponent,
    NewHouseComponent,
    MyHouseListComponent,
    NewRoomComponent,
    MyRoomListComponent,
    HouseDetailComponent,
    HouseContactComponent,
    RoomDetailComponent,
    EnableRoomComponent
  ],
  providers: [
  ]
})
export class HouseModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faWifi, faClock, faUtensils, faMotorcycle, faCheckCircle,
      faPhone, faBed, faDollarSign, faHistory, faBan, faGlobeAsia, faRestroom,
      faToilet, faMale, faFemale, faSquare, faUsers, faListAlt, faComments);
  }
}
