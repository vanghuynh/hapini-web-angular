import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { RoomService } from '@app/core/services/room.service';
import { IRoom, IAddressSetting, IImage, IResponseData } from '@app/model/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';

@Component({
  selector: 'image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {

  @Input() images: IImage[] = [];

  constructor(private HttpClient: HttpClient) { }

  ngOnInit() {
    //this.images = [];
  }

}
