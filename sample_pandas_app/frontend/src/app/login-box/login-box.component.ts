import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './../services/user.service';
import { UserAuthService } from './../services/user-auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './login-box.component.html',
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

  loginUser() {
    this.userService.loginUser(this.userLoginForm).subscribe(
      response => {
        this.userAuthService.setJWTToken(response);
        this.statusMessage = 'Login successful! Just a moment ...';
        setTimeout(() => {
          this.router.navigate(['/new-company/']);
        }, 1500);
      },
      errors => {
        this.statusMessage = errors.error.message;
      }
    );
  }

}
