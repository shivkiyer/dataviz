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
          this.userFileList = ['Select'];
          this.publicFileList = ['Select'];
          this.userFileObjectList = data['user_file_list'];
          this.publicFileObjectList = data['public_file_list'];
          data['user_file_list'].forEach((item, index) => {
            this.userFileList.push(item['file_name']);
          });
          data['public_file_list'].forEach((item, index) => {
            this.publicFileList.push(`${item['file_name']} *by* ${this.publicFileObjectList[index]['username']}`);
          });
        }
      )
    );
  }


  loadPublicFile(fileName: string): Observable<any> {
    // let [file_name] = fileName.split('*by*');
    // file_name = file_name.trim();
    // if (user_name) {
    //   user_name = user_name.trim();
    // }
    const headers = new HttpHeaders({
      // 'Content': 'text/plain',
      'Authorization': this.userAuthService.getJWTToken()
    });
    // const postObject = {
    //   file_name: file_name,
    //   user_name: user_name
    // };
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
                  // JSON.stringify(postObject),
                  {headers}
              );
  }


  loadUserFile(fileName: string): Observable<any> {
    return this.loadPublicFile(fileName);
  }


  deleteUserFile(fileName: string): Observable<any> {
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
                    this.userFileList.splice(deleteIndex, 1);
                    this.userFileObjectList.splice(deleteIndex-1, 1);
                  }
                )
              );
  }

}
