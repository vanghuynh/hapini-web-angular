import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { Credentials } from '@app/model/interfaces';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService) {
    this.createForm();
  }

  ngOnInit() { }

  login() {
    this.isLoading = true;
    console.log("form value: ", this.loginForm.value);
    this.authenticationService.getAuthTokenPassword(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(finalize(() => {
        this.loginForm.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(res => {
        console.log('Login res:', res);
        const credentials: Credentials = {
          username: res.username,
          token: res.access_token,
          refreshToken: res.refresh_token,
          userId: res.userId,
          authority: res.authority
        }
        this.authenticationService.setCredentials(credentials, this.loginForm.value.remember);

        this.route.queryParams.subscribe(
          params => this.router.navigate([ params.redirect || '/houses/myhouses'], { replaceUrl: true })
        );
      }, error => {
        console.log('Login error:', error);
        this.error = error;
      });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: ['', Validators.required],
      remember: true
    });
  }

  registerAccount(){
    this.router.navigate(['/register'], { replaceUrl: true });
  }

  forgetPassword(){
    this.router.navigate(['/forgetpass'], { replaceUrl: true });
  }

}
