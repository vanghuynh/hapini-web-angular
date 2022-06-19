import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IUser, IUserPassword } from '@app/model/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { UserService } from '@app/core/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { I18nService } from '@app/core';

@Component({
  selector: 'user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
  
  constructor(private houseService: HouseService,
    private fb: FormBuilder,
    private HttpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private addressService: AddressService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private i18nService: I18nService) {
    }

  userName: string;

  ngOnInit() {
    this.userName = this.authenticationService.credentials.username;

  }

  changePassword(){
    this.router.navigate(['/changepass'], { replaceUrl: true });
  }
}
