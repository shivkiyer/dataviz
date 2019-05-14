import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { UserAuthService } from './user-auth.service';
import { FileManagementService } from './file-management.service';

@Injectable()
export class FileUploadService {
  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService,
    private fileManagementService: FileManagementService
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
        ).pipe(
          map(
            data => {
              this.fileManagementService.userFileList.push(fileToUpload.name);
              this.fileManagementService.userFileObjectList = [...data.body['file_list']];
              return data;
            }
          )
        );
  }

  updateFile(fileToUpdate: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });
    return this.httpClient.patch(
            this.apiURL + 'file-update/',
            fileToUpdate,
            {headers}).pipe(
              map(
                data => {
                  return data;
                }
              )
            );
  }

  cancelUpload(fileName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });
    const filePos = this.fileManagementService.userFileList.indexOf(fileName) - 1;
    const fileId = this.fileManagementService.userFileObjectList[filePos]['id'];
    return this.httpClient.delete(`${this.apiURL}delete-file/${fileId}/`,
            {headers}
          );
  }

}
