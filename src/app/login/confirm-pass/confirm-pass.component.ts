import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IUserPassword } from '@app/model/interfaces';
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
  selector: 'confirm-pass',
  templateUrl: './confirm-pass.component.html',
  styleUrls: ['./confirm-pass.component.scss']
})
export class ConfirmPassComponent implements OnInit {

  code: string;
  message: string;
  title: string;
  
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
      this.activatedRoute.params.forEach((params: Params) => {
        console.log("params: ", params);
        this.code = params['code'];
        if("FORGET" == this.code){
          this.title = this.i18nService.instant("confirm.forgetTitle");
          this.message = this.i18nService.instant("confirm.forgetMessage");
        }
      });
  }

  ngOnInit() {
    console.log("Input params: ", this.code);
  }

  goHome(){
    this.router.navigate(['/']);
  }
}
