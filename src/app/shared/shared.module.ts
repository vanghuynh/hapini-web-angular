import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { ImageComponent } from "./image/image.component";
import { ngfModule, ngf } from "angular-file"
import { ImageListComponent } from "./image-list/image-list.component";

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    ngfModule
  ],
  declarations: [
    LoaderComponent,
    ImageComponent,
    ImageListComponent
  ],
  exports: [
    LoaderComponent,
    ImageComponent,
    ImageListComponent
  ]
})
export class SharedModule { }
