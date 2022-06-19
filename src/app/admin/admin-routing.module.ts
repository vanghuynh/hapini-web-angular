import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '@app/core';
import { AdminHouseListComponent } from './admin-house-list/admin-houselist.component';
import { Shell } from '@app/shell/shell.service';
import { AdminRoomListComponent } from "./admin-room-list/admin-roomlist.component";
import { ApproveRoomComponent } from "./approve-room/approve-room.component";

// const routes: Routes = [
//   // Module is lazy loaded, see app-routing.module.ts
//   { path: 'room', component: ListComponent, data: { title: extract('Room Search') } }
// ];

const routes: Routes = [
  Shell.childRoutesAdminAuth([
    { path: 'admin-house', component: AdminHouseListComponent, data: { title: extract('Admin Houses') } },
    { path: 'admin-room', component: AdminRoomListComponent, data: { title: extract('Admin Rooms') } },
    { path: 'admin-room-approve/:roomId', component: ApproveRoomComponent, data: { title: extract('Admin Approve Room') } },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }
