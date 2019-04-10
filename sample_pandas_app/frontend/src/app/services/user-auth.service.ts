import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { JWTToken } from './../models/jwt-token.model';

@Injectable()
export class UserAuthService {

  accountStatus = new Subject();

  getJWTToken(): string {
    return JWTToken.jwtToken;
  }

  setJWTToken(response: any) {
    if (response.headers.get("authorization")) {
      JWTToken.jwtToken = response.headers.get("authorization");
    }
  }

  clearToken() {
    JWTToken.jwtToken = '';
  }

}
