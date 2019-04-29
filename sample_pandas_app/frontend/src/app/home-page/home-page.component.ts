import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FileUploadFormComponent } from './../file-upload-form/file-upload-form.component';
import { UserAuthService } from './../services/user-auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(
    private router: Router,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    if (this.userAuthService.getJWTToken().length>0) {
      this.router.navigate(['/data-analytics']);
    }
  }
}
