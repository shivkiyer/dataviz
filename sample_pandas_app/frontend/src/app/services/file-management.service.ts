import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { UserAuthService } from './../services/user-auth.service';

@Injectable()
export class FileManagementService {

  apiURL: string = environment.configSettings.apiURL;
  userFileObjectList = [];
  userFileList = ['Select'];
  publicFileObjectList = [];
  publicFileList = ['Select'];

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  fetch_files(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });

    return this.http.get(this.apiURL + 'fetch-files/', {headers}).pipe(
      map(
        data => {
          this.userFileObjectList = data['user_file_list'];
          this.publicFileObjectList = data['public_file_list'];
          data['user_file_list'].forEach(item => {
            this.userFileList.push(item['file_name']);
          });
          data['public_file_list'].forEach(item => {
            this.publicFileList.push(item['file_name']);
          });
        }
      )
    );
  }

}
