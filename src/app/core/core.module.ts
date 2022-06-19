import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { I18nService } from './i18n.service';
import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { QuoteService } from './services/quote.service';
import { RoomService } from './services/room.service';
import { OpenGuard } from './authentication/open.guard';
import { AdminGuard } from './authentication/admin.guard';
import { TokenInterceptor } from './http/token.interceptor';
import { HouseService } from './services/house.service';
import { AddressService } from './services/address.service';
import { CustomMatPaginator } from './custom-ui/CustomMatPaginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UserService } from './services/user.service';
import { ContactService } from './services/contact.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    OpenGuard,
    AdminGuard,
    I18nService,
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    TokenInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginator},
    QuoteService,
    RoomService,
    HouseService,
    AddressService,
    UserService,
    ContactService
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}
