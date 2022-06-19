import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  { path: 'about', loadChildren: () => import('app/about/about.module').then(m => m.AboutModule) },
  { path: 'houses', loadChildren: () => import('app/house/house.module').then(m => m.HouseModule) },
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '/houses', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
