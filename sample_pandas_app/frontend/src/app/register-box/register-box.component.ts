import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from './../services/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './register-box.component.html'
})
export class RegisterBoxComponent {

  constructor(
    private userService: UserService
  ) {}

  userRegistrationForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  statusMessage: string = '';
  errorMessage: string = '';

  registerUser() {
    this.userService.registerUser(this.userRegistrationForm).subscribe(
      response => {
        this.userRegistrationForm.reset();
        this.statusMessage = 'User successfully created. Use the login form with the username/password.';
        this.errorMessage = '';
      },
      errors => {
        this.errorMessage = 'Could not register user.';
        this.statusMessage = '';
      }
    );
  }

}
