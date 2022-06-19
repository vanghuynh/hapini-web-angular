import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { RoomService } from '@app/core/services/room.service';
import { IRoom, IImage } from '@app/model/interfaces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';

@Component({
  selector: 'enable-room',
  templateUrl: './enable-room.component.html',
  styleUrls: ['./enable-room.component.scss']
})
export class EnableRoomComponent implements OnInit {

  room: IRoom;
  roomId: number;
  houseId: number;
  newRoomForm: FormGroup;
  
  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const houseId = +params['houseId'];
      this.houseId = houseId;
      const roomId = +params['roomId'];
      this.roomId = roomId;
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
        console.log("Invalid room id");
      }
    });
  }

  private createForm() {
    this.newRoomForm = this.formBuilder.group({
      level: new FormControl(this.room.level, Validators.required),
    });
  }

  onSubmit() {
    console.log("onSubmit: ", this.room, this.roomId);

    this.roomService.enableRoomAvailable(this.room, this.newRoomForm.value.level)
    .pipe(finalize(() => {  }))
    .subscribe((room: IRoom) => { 
      //this.room = room; 
      console.log("Created room: ", this.room);
      this.router.navigate(['/houses/myrooms', this.houseId]);
    });
  }

}
