import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import {SlideshowModule} from 'ng-simple-slideshow';
import { ShellComponent } from './shell.component';
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
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    SlideshowModule,
    FontAwesomeModule
  ],
  declarations: [
    ShellComponent
  ]
})
export class ShellModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faWifi, faClock, faUtensils, faMotorcycle, faCheckCircle,
      faPhone, faBed, faDollarSign, faHistory, faBan, faGlobeAsia, faRestroom,
      faToilet, faMale, faFemale, faSquare, faUsers, faListAlt, faComments);
  }
}
