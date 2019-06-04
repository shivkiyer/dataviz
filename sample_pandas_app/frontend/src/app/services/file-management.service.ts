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
  loadedFileList: {[fileId: number]: string}[] = [];
  loadedFileHeaders = [];

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
          this.userFileObjectList = data['user_file_list'];
          this.publicFileObjectList = data['public_file_list'];
          // userfilelist and publicfilelist are for the drop downs.
          this.userFileList = data['user_file_list'].map(
              item => item['file_name']
          );
          this.userFileList.splice(0, 0, 'Select');
          this.publicFileList = data['public_file_list'].map((item, index) =>
              `${item['file_name']} *by* ${this.publicFileObjectList[index]['username']}`
          );
          this.publicFileList.splice(0, 0, 'Select');
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
    this.loadedFileList.push({[fileId]: fileName});
    return this.http.get(`${this.apiURL}load-file/${fileId}/`,
                  {headers}
              ).pipe(
                map(
                  data => {
                    this.loadedFileHeaders.push(JSON.parse(data['dataframe']));
                    return this.loadedFileHeaders[this.loadedFileHeaders.length-1];
                  }
                )
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



  fetchDataFrame(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.userAuthService.getJWTToken()
    });
    const fileId: number = Object.keys(this.loadedFileList[this.loadedFileList.length-1])[0];
    return this.http.get(`${this.apiURL}load-file/${fileId}/`,
            {headers}
        );
  }

}
