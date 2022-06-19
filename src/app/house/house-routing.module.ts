import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HouseDetailComponent } from './house-detail/house-detail.component';
import { extract } from '@app/core';
import { HouseListComponent } from './house-list/houselist.component';
import { Shell } from '@app/shell/shell.service';
import { NewHouseComponent } from './new-house/newhouse.component';
import { MyHouseListComponent } from "./my-house-list/myhouselist.component";
import { NewRoomComponent } from "./new-room/new-room.component";
import { MyRoomListComponent } from "./my-room-list/myroomlist.component";
import { HouseContactComponent } from "./house-contact/house-contact.component";
import { RoomDetailComponent } from "./room-detail/room-detail.component";
import { EnableRoomComponent } from "./enable-room/enable-room.component";
// const routes: Routes = [
//   // Module is lazy loaded, see app-routing.module.ts
//   { path: 'room', component: ListComponent, data: { title: extract('Room Search') } }
// ];

const routes: Routes = [
  Shell.childRoutesWithoutAuth([
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: HouseListComponent, data: { title: extract('APP_NAME') } },
    { path: 'search/:params', component: HouseListComponent, data: { title: extract('APP_NAME') } },
    { path: 'detail/:houseId', component: HouseDetailComponent, data: { title: extract('House Detail') } },
    { path: 'contact/:contactId', component: HouseContactComponent, data: { title: extract('House Contact') } },
    { path: 'room/:houseId/:roomId', component: RoomDetailComponent, data: { title: extract('Room Detail') } }
  ]),
  Shell.childRoutes([
  //Shell.childRoutesWithoutAuth([
    { path: 'myhouses', component: MyHouseListComponent, data: { title: extract('My Houses') } },
    { path: 'myhouses/:houseId', component: NewHouseComponent, data: { title: extract('New House') } },
    { path: 'enableroom/:houseId/:roomId', component: EnableRoomComponent, data: { title: extract('Enable Room') } },
    { path: 'myhouses/:houseId/:roomId', component: NewRoomComponent, data: { title: extract('New Room') } },
    { path: 'myrooms/:houseId', component: MyRoomListComponent, data: { title: extract('Room List') } },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HouseRoutingModule { }
