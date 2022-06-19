import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { IHouse, IPagedResults } from '@app/model/interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Route, Router, NavigationExtras } from '@angular/router';
import { updateHouses } from "../../core/util/common.util";
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { HouseService } from '@app/core/services/house.service';

@Component({
  selector: 'my-house-list',
  templateUrl: './myhouselist.component.html',
  styleUrls: ['./myhouselist.component.scss']
})
export class MyHouseListComponent implements OnInit {

  houses: IHouse[];
  isEmpty: boolean = true;
  
  constructor(private houseService: HouseService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.houseService.getHousesOfUser(this.authenticationService.credentials.userId || 0)
    .pipe(finalize(() => {  }))
    .subscribe((res: IHouse[]) => { 
      this.houses = res as IHouse[]; 
      console.log("My houses: ", this.houses);
      if((this.houses && this.houses.length > 0) && (this.authenticationService.credentials && this.authenticationService.credentials.userId && this.authenticationService.credentials.userId != 1)){
        this.isEmpty = false;
      }
      updateHouses(this.houses);
    });
  }

  editHouse(house: IHouse){
    // Set our navigation extras object
    let navigationExtras: NavigationExtras = {
      queryParams: { 'houseId': house.id }
    };
    this.router.navigate(['/houses/myhouses', house.id]);
  }

  addRooms(house: IHouse){
    this.router.navigate(['/houses/myhouses', house.id, 0]);
  }

  deleteHouse(house: IHouse){
    this.houseService.deleteHouseOfUser(this.authenticationService.credentials.userId || 0, house.id).subscribe(res => {
      console.log("Deleted house: ", house, res);
      this.houseService.getHousesOfUser(this.authenticationService.credentials.userId || 0)
      .pipe(finalize(() => {  }))
      .subscribe((res: IHouse[]) => { 
        this.houses = res as IHouse[];
        updateHouses(this.houses);
        console.log("My houses: ", this.houses);
        if((this.houses && this.houses.length > 0) && (this.authenticationService.credentials && this.authenticationService.credentials.userId && this.authenticationService.credentials.userId != 1)){
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      });
    });
  }

  addHouse(){
    this.router.navigate(['/houses/myhouses', 0]);
  }

  manageRooms(house: IHouse){
    this.router.navigate(['/houses/myrooms', house.id]);
  }

  viewHouse(house: IHouse){
    this.router.navigate(['/houses/detail', house.id]);
  }

}
