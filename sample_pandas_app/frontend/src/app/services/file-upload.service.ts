import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { UserAuthService } from './../services/user-auth.service';

@Injectable()
export class FileUploadService {
  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  apiURL: string = environment.configSettings.apiURL;

  postFile(fileToUpload: File): Observable<any> {
      const headers = new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Authorization': this.userAuthService.getJWTToken()
      })
      const endpoint = this.apiURL + 'file-upload/';
      const formData: FormData = new FormData();
      formData.append('fileKey', fileToUpload, fileToUpload.name);
      return this.httpClient
        .post(endpoint, formData,
          {
            // withCredentials: true,
            headers,
            observe: 'response'
          }
        );
  }


}
