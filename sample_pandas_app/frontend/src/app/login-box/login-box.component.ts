import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './../services/user.service';
import { UserAuthService } from './../services/user-auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent {

  constructor(
    private userService: UserService,
    private router: Router,
    private userAuthService: UserAuthService
  ) {}

  userLoginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  statusMessage: string = '';
  errorMessage: string = '';

  loginUser() {
    this.userService.loginUser(this.userLoginForm).subscribe(
      response => {
        this.userAuthService.setJWTToken(response);
        this.statusMessage = 'Login successful! Just a moment ...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/data-analytics/']);
        }, 1500);
      },
      errors => {
        this.errorMessage = errors.error.message;
        this.statusMessage = '';
      }
    );
  }

}
