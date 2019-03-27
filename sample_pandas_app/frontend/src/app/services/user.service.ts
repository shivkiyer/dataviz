import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';

import { UserAuthService } from './user-auth.service';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  apiBaseURL = environment.configSettings.apiURL;

  registerUser(userInfo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(
      this.apiBaseURL + 'user/',
      userInfo.value,
      {headers: headers}
    );
  }

  loginUser(userInfo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(
      this.apiBaseURL + 'user/login/',
      userInfo.value,
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  logoutUser() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });
    return this.http.post(
      this.apiBaseURL + 'user/logout/',
      '',
      {
        headers: headers,
        observe: 'response'
      }
    );
  }

  clearToken() {
    this.userAuthService.clearToken();
  }

}
