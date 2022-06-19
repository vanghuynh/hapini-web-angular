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
  selector: 'admin-room-list',
  templateUrl: './admin-roomlist.component.html',
  styleUrls: ['./admin-roomlist.component.scss']
})
export class AdminRoomListComponent implements OnInit {

  rooms: IRoom[];
  houseId: number;

  // MatPaginator Inputs
  length = 0;
  pageSize = 10;
  pageIndex: number = 0;

  constructor(private roomService: RoomService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getRoomsByStatus(this.pageIndex, this.pageSize, "PENDING");
  }

  private getRoomsByStatus(pageIndex: number, pageSize: number, status: string){
    this.roomService.getRoomsPageByStatus(pageIndex,pageSize,status)
    .pipe(finalize(() => { console.log("finished loading") }))
    .subscribe((res: IPagedResults<IRoom[]>) => { 
      this.rooms = res.content as IRoom[];
      updateRooms(this.rooms);
    }, err => {
      this.rooms = [];
    });
  }

  approveRoom(room: IRoom){
    this.router.navigate(['/admin-room-approve', room.id]);
  }

  enableRoom(room: IRoom){
    this.roomService.enableRoomAvailable(room, 1)
    .subscribe(res => {
      console.log("Enable room: ", res);
      this.getRoomsByStatus(this.pageIndex, this.pageSize, "PENDING");
    });
  }

  disableRoom(room: IRoom){
    this.roomService.disableRoomAvailable(room)
    .subscribe(res => {
      console.log("Disable room: ", res);
      this.getRoomsByStatus(this.pageIndex, this.pageSize, "PENDING");
    });
  }

}
