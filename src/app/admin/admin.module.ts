import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Angulartics2Module } from 'angulartics2';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { AdminRoomListComponent } from "./admin-room-list/admin-roomlist.component";
import { AdminHouseListComponent } from './admin-house-list/admin-houselist.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import { AgmCoreModule } from '@agm/core';
import { environment } from "../../environments/environment";
import { NgxGalleryModule } from 'ngx-gallery';
import { ApproveRoomComponent } from "./approve-room/approve-room.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    Angulartics2Module,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlideshowModule,
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey
    })

  ],
  declarations: [
    AdminRoomListComponent,
    AdminHouseListComponent,
    ApproveRoomComponent
  ],
  providers: [
  ]
})
export class AdminModule { }
