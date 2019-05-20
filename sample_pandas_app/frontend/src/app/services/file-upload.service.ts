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
    /**
    Sends a file uploaded to the backend
    */
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    })
    const endpoint = this.apiURL + 'file-upload/';
    // The contents of the file are added to FormData
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
            // Receive confirmation that file has been added.
            this.fileManagementService.userFileList.push(fileToUpload.name);
            // Receive the latest list of user's file from backend.
            this.fileManagementService.userFileObjectList = [...data.body['file_list']];
            return data;
          }
        )
      );
  }

  updateFile(fileToUpdate: any): Observable<any> {
    /**
    Send file details - description and public status.
    */
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
                  this.fileManagementService.userFileObjectList = [...data['file_list']];
                  this.fileManagementService.userFileList = this.fileManagementService.userFileObjectList.map(
                    (item) => {
                      return item['file_name'];
                    }
                  );
                  this.fileManagementService.userFileList.splice(0, 0, 'Select');
                  return data;
                }
              )
            );
  }

  cancelUpload(fileName: string): Observable<any> {
    /**
    Remove the file from list of files and delete from backend.
    */
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
