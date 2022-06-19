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
import { I18nService } from '@app/core';

@Component({
  selector: 'image-upload',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() type?: string = "ROOM";
  @Input() id: any = 0;
  @Output() onImageUploadEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAllImageUploadedEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor(private HttpClient: HttpClient,
              private i18nService: I18nService) { }

  ngOnInit() {
    this.uploadFinished = false;
    this.selectImageText = this.i18nService.instant("image.dropImage");
    this.uploadButtonText = this.i18nService.instant("image.uploadButton");
    this.imageText = this.i18nService.instant("image.image");
    this.typeText = this.i18nService.instant("image.type");
    this.sizeText = this.i18nService.instant("image.size");
  }

  //file upload
  accept = '*'
  files: File[] = []
  progress: number
  url = `${endpoints.baseEndpoint()}/upload/cloudinary`
  hasBaseDropZoneOver: boolean = false
  httpEmitter: Subscription
  httpEvent: HttpEvent<{}>
  lastFileAt: Date
  uploadingProgress: number;
  uploadFinished: boolean = false;
  sendableFormData: FormData//populated via ngfFormData directive
  imageIds: number[] = [];
  images: IImage[] = [];
  selectImageText: string = "";
  uploadButtonText: string = "";
  imageText: string = "";
  typeText: string = "";
  sizeText: string = "";

  uploadFiles(files: File[]) {
    this.imageIds = [];
    this.images = [];
    var count = 0;
    this.uploadingProgress = 0;
    var uploadUrl = this.url;
    files.forEach(file => {
      this.sendableFormData = new FormData();
      this.sendableFormData.append("file", file, file.name)
      console.log('type, id: ', this.type, this.id);
      if (this.id && this.id != '' && this.id != 0) {
        if(this.type && this.type == 'ROOM'){
          uploadUrl = `${endpoints.baseEndpoint()}/upload/room`;
          this.sendableFormData.append('roomId', this.id);
        } else {
          uploadUrl = `${endpoints.baseEndpoint()}/upload/house`;
          this.sendableFormData.append('houseId', this.id);
        }
      }
      const req = new HttpRequest<FormData>('POST', uploadUrl, this.sendableFormData, {
        reportProgress: true//, responseType: 'text'
      })

      return this.httpEmitter = this.HttpClient.request(req)
        .subscribe(
          event => {
            this.httpEvent = event

            if (event instanceof HttpResponse) {
              delete this.httpEmitter
              console.log('request done', event);
              let image: IResponseData<IImage> = event.body as IResponseData<IImage>;
              this.images.push(image.data);
              this.imageIds.push(image.data.id);
              console.log("savedImage: ", image);
              count++;
              this.uploadingProgress = (count / files.length) * 100;
              if (count == files.length) {
                console.log("Images: ", this.imageIds, this.images);
                this.onImageUploadEvent.emit(this.imageIds);
                this.onAllImageUploadedEvent.emit(this.images);
                this.uploadFinished = true;
              }
            }
          },
          error => console.log('Error Uploading', error)
        );
    });
  }

  getDate(){
    return new Date()
  }

}
