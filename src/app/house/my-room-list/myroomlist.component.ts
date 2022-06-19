import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RoomService } from '@app/core/services/room.service';
import { IRoom, IPagedResults } from '@app/model/interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Route, Router, NavigationExtras, Params } from '@angular/router';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { updateRooms } from "../../core/util/common.util";

@Component({
  selector: 'my-room-list',
  templateUrl: './myroomlist.component.html',
  styleUrls: ['./myroomlist.component.scss']
})
export class MyRoomListComponent implements OnInit {

  rooms: IRoom[];
  houseId: number;

  constructor(private roomService: RoomService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      console.log("params: ", params);
      const houseId = +params['houseId'];
      this.houseId = houseId;
      this.getRoomsOfHouse(houseId);
    });
  }

  private getRoomsOfHouse(houseId: number){
    this.roomService.getAllRoomsOfHouse(houseId)
      .pipe(finalize(() => {  }))
      .subscribe((res: IRoom[]) => { 
        this.rooms = res as IRoom[]; 
        updateRooms(this.rooms);
        console.log("My room list: ", this.rooms);
    });
  }
  editRoom(room: IRoom){
    this.router.navigate(['/houses/myhouses', this.houseId, room.id]);
  }

  deleteRoom(room: IRoom){
    this.roomService.deleteRoomOfHouse(this.houseId, room.id)
    .subscribe(res => {
      console.log("Deleted room: ", res);
      this.rooms = res;
    });
  }

  addRoom(){
    this.router.navigate(['/houses/myhouses', this.houseId, 0]);
  }

  enableRoom(room: IRoom){
    this.router.navigate(['/houses/enableroom', this.houseId, room.id]);
  }

  disableRoom(room: IRoom){
    this.roomService.disableRoomAvailable(room)
    .subscribe(res => {
      console.log("Disable room: ", res);
      this.getRoomsOfHouse(this.houseId);
    });
  }

}
