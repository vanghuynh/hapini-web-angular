import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { RoomService } from '@app/core/services/room.service';
import { IRoom, IImage } from '@app/model/interfaces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';

@Component({
  selector: 'approve-room',
  templateUrl: './approve-room.component.html',
  styleUrls: ['./approve-room.component.scss']
})
export class ApproveRoomComponent implements OnInit {

  room: IRoom;
  roomId: number;
  newRoomForm: FormGroup;
  
  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
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
      level: new FormControl(String(this.room.level), Validators.required),
    });
  }

  onSubmit() {
    console.log("onSubmit: ", this.room, this.roomId);
    this.roomService.changeRoomStatus(this.roomId, "APPROVE", this.newRoomForm.value.level).subscribe(room => {
      console.log("Room status changed: ", room);
      this.router.navigate(['/admin-room']);
    }, err => {
      console.log("Error approve room: ", err);
    });
  }

}
