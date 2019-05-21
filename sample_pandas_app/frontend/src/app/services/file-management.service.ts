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
    /**
    Get all files from backend that a user can access.
    */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });

    return this.http.get(this.apiURL + 'fetch-files/', {headers}).pipe(
      map(
        data => {
          // The backend sends back the user's files and public files.
          this.userFileList = ['Select'];
          this.publicFileList = ['Select'];
          this.userFileObjectList = data['user_file_list'];
          this.publicFileObjectList = data['public_file_list'];
          // userfilelist and publicfilelist are for the drop downs.
          data['user_file_list'].forEach((item, index) => {
            this.userFileList.push(item['file_name']);
          });
          data['public_file_list'].forEach((item, index) => {
            this.publicFileList.push(
              `${item['file_name']} *by* ${this.publicFileObjectList[index]['username']}`
            );
          });
        }
      )
    );
  }


  loadPublicFile(fileName: string): Observable<any> {
    /**
    Retrieve the contents of a public file.
    */
    const headers = new HttpHeaders({
      // 'Content': 'text/plain',
      'Authorization': this.userAuthService.getJWTToken()
    });
    let fileIndex;
    let fileId;
    fileIndex = this.publicFileList.indexOf(fileName);
    if (fileIndex < 0) {
      fileIndex = this.userFileList.indexOf(fileName);
      fileId = this.userFileObjectList[fileIndex-1]['id'];
    } else {
      fileId = this.publicFileObjectList[fileIndex-1]['id'];
    }
    return this.http.get(`${this.apiURL}load-file/${fileId}`,
                  {headers}
              );
  }


  loadUserFile(fileName: string): Observable<any> {
    /**
    Retrieve the contents of a user's file.
    */
    return this.loadPublicFile(fileName);
  }


  deleteUserFile(fileName: string): Observable<any> {
    /**
    Delete a user's file from backend.
    */
    const headers = new HttpHeaders({
      // 'Content': 'text/plain',
      'Authorization': this.userAuthService.getJWTToken()
    });
    const deleteIndex = this.userFileList.indexOf(fileName);
    const deleteId = this.userFileObjectList[deleteIndex-1]['id']
    return this.http.delete(`${this.apiURL}delete-file/${deleteId}/`,
                  {headers}
              ).pipe(
                map(
                  data => {
                    // Remove it from local lists.
                    this.userFileList.splice(deleteIndex, 1);
                    this.userFileObjectList.splice(deleteIndex-1, 1);
                  }
                )
              );
  }


  showFileDetails(fileName: string): any {
    /**
    Extract details of a file based on the file name
    First check for the file in the public file list
    and then in the user file list.
    */
    let fileIndex: number;
    fileIndex = this.publicFileList.indexOf(fileName);
    if (fileIndex < 0) {
      fileIndex = this.userFileList.indexOf(fileName);
      return this.userFileObjectList[fileIndex-1];
    } else {
      return this.publicFileObjectList[fileIndex-1];
    }
  }

}
