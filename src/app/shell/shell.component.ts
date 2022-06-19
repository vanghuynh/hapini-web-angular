import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import {Location} from '@angular/common';
import { AuthenticationService, I18nService } from '@app/core';
import { PlatformLocation } from '@angular/common'
import { IHouse } from '@app/model/interfaces';
import { updateHouses } from "@app/core/util/common.util";
import { HouseService } from '@app/core/services/house.service';
import { finalize } from 'rxjs/operators';
import { IPagedResults } from '@app/model/interfaces';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor(private router: Router,
              private titleService: Title,
              private media: MediaObserver,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private location: Location,
              private platformLocation: PlatformLocation,
              private houseService: HouseService) {
                this.router.events.subscribe(event => {
                  if(event instanceof NavigationEnd){
                    let eventNavigation: NavigationEnd = event;
                    console.log("path: ", eventNavigation.url);
                    if(eventNavigation.url && eventNavigation.url != '/houses/myhouses' &&
                       eventNavigation.url != '/houses' &&
                       eventNavigation.url != '/' &&
                       !eventNavigation.url.includes("houses/search")){
                         this.canBack = true;
                    } else{
                      this.canBack = false;
                    }
                  }
                });
                this.platformLocation.onPopState((event)=>{
                  console.log("onPopState: ", event)
                });
              }

  isLogin: boolean = false;
  canBack: boolean = false;
  houses: IHouse[];
  isAdmin: boolean = false;
  currentLang: string;

  ngOnInit() {
    this.currentLang = this.i18nService.language;
    console.log("Current lang: ", this.currentLang);
    this.isLogin = this.authenticationService.isAuthenticated();
    this.isAdmin = this.authenticationService.isAuthenticated() && this.authenticationService.isAdminAuthenticated();
    this.getHouses(0, 5, true, "APPROVE", "APPROVE");
  }

  private getHouses(pageIndex: number, pageSize: number, available: boolean, houseStatus: string, roomStatus: string){
    this.houseService.getHousesPageByHotPost(pageIndex,pageSize,available,houseStatus,roomStatus)
    .pipe(finalize(() => { console.log("finished loading") }))
    .subscribe((res: IPagedResults<IHouse[]>) => { 
      if(res && res.content){
        this.houses = res.content as IHouse[];
        updateHouses(this.houses);
      } else {
        this.houses = [];
      }
    });
  }
  setLanguage(language: string) {
    this.i18nService.language = language;
    this.currentLang = this.i18nService.language;
    console.log("Current lang: ", this.currentLang);
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
    this.isLogin = this.authenticationService.isAuthenticated();
  }

  login(){
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  back(){
    this.location.back();
  }

  addHouse(){
    if(!this.isLogin){
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      this.router.navigate(['/houses/myhouses'], { replaceUrl: false });
    }
  }

  viewHouse(house: IHouse){
    this.router.navigate(['/houses/detail', house.id]);
  }
}
