import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { RoomService } from '@app/core/services/room.service';
import { IRoom, IImage } from '@app/model/interfaces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';

@Component({
  selector: 'new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {

  room: IRoom;
  imageIds: number[] = [];
  houseId: number;
  roomId: number;
  newRoomForm: FormGroup;
  
  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.imageIds = [];
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const houseId = +params['houseId'];
      const roomId = +params['roomId'];
      this.houseId = houseId;
      this.roomId = roomId;
      if (houseId && houseId != 0) {
        if(roomId && roomId != 0){
          this.roomService.getRoomById(this.roomId)
          .pipe(finalize(() => {  }))
          .subscribe(room => {
            this.room = room;
            console.log("Room: ", this.room);
            this.createForm();
          }, err =>{
            console.log("Error getting room", err);
          });
        } else {
          this.initRoom();
          this.createForm();
        }
      } else {
        console.log("Not valid room id")
      }
    });
  }

  private createForm() {
    this.newRoomForm = this.formBuilder.group({
      name: new FormControl(this.room.name, Validators.required),
      description: new FormControl(this.room.description),
      area: new FormControl(this.room.area, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1)]),
      maxNumber: new FormControl(this.room.maxNumber, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1)]),
      toilet: new FormControl(this.room.toilet, Validators.required),
      sex: new FormControl(this.room.sex, Validators.required),
      price: new FormControl(this.room.price, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1000)]),
      note: new FormControl(this.room.note),
    });
  }

  private initRoom(){
    this.room = {
      id: "",
      name: "",
      description: "",
      area: 0,
      maxNumber: 0,
      toilet: "",
      sex: "",
      price: 0,
      note: "",
      avatar: "",
      images:  [],
      available: false,
    };
  }
  onSubmit() {
    console.log("onSubmit: ", this.room, this.imageIds);
    this.room.name = this.newRoomForm.value.name;
    this.room.description = this.newRoomForm.value.description;
    this.room.area = this.newRoomForm.value.area;
    this.room.maxNumber = this.newRoomForm.value.maxNumber;
    this.room.toilet = this.newRoomForm.value.toilet;
    this.room.sex = this.newRoomForm.value.sex;
    this.room.price = this.newRoomForm.value.price;
    this.room.note = this.newRoomForm.value.note;

    this.roomService.addRoomToHouseWithImage(this.houseId, this.room, this.imageIds)
    .pipe(finalize(() => {  }))
    .subscribe((room: IRoom) => { 
      this.room = room; 
      console.log("Created room: ", this.room);
      this.router.navigate(['/houses/myrooms', this.houseId]);
    });
  }

  onImageUpload(args:any){
    console.log('onImageUpload: ', args);
    this.imageIds = args as number[];
  }

  onAllImageUploaded(args:any){
    console.log("All images: ", args);
    let images: IImage[] = args;
    this.room.images.push.apply(this.room.images, images);
    console.log("onAllImageUploaded: ", this.room);
  }

}
