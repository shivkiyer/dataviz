import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../../services/user.service';
import { UserAuthService } from './../../services/user-auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  userLoggedIn: boolean = false;
  smallWindow: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private userAuthService: UserAuthService
  ) {
    this.onResize();
  }

  ngOnInit() {
    /**
    Checks status of user and displays Login or Logout
    */
    // If token is present, user is logged in.
    // This will happen only when app is loaded.
    if (this.userAuthService.getJWTToken().length>0) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    // This is needed if any other service emits a signal
    // through accountStatus subhect that a user's token has expired.
    this.userAuthService.accountStatus.subscribe(
      status => {
        this.userLoggedIn = false;
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    /**
    To check the width to display menu bar as hamburger.
    */
    if (window.innerWidth < 960) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  userLogout() {
    /**
    When user clicks on logout button on header.
    */
    this.userService.logoutUser().subscribe(
      response => {
        this.userLoggedIn = false;
        this.router.navigate(['']);
      },
      errors => {
        console.log(errors);
      }
    );
  }

}
