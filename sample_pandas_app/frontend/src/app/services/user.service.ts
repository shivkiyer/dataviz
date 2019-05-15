import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    /**
    Send login/password to backend to create new user.
    */
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(
      this.apiBaseURL + 'user/register/',
      userInfo.value,
      {headers: headers}
    );
  }

  loginUser(userInfo: any) {
    /**
    Send login/password to backend to get a JWT token.
    */
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(
      this.apiBaseURL + 'user/login/',
      userInfo.value,
      {
        headers: headers,
        observe: 'response'
      }
    ).pipe(
      map(
        response => {
          this.userAuthService.setJWTToken(response);
          return;
        }
      )
    );
  }

  logoutUser() {
    /**
    Remove the token from the backend
    */
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });
    return this.http.delete(
      this.apiBaseURL + 'user/logout/',
      {
        headers: headers,
        observe: 'response'
      }
    ).pipe(
      map(
        response => {
          this.clearToken();
          return response;
        }
      )
    );
  }

  clearToken() {
    /**
    Removes the JWT token.
    */
    this.userAuthService.clearToken();
  }

}
