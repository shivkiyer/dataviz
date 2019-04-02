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
    if (this.userAuthService.getJWTToken().length>0) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth < 960) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  userLogout() {
    this.userService.logoutUser().subscribe(
      response => {
        this.userService.clearToken();
        this.userLoggedIn = false;
        this.router.navigate(['']);
      },
      errors => {
        console.log(errors);
      }
    );
  }

}
