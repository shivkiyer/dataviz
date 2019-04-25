import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

import { environment } from './../../environments/environment';
import { UserAuthService } from './../services/user-auth.service';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html'
})
export class DataAnalyticsComponent implements OnInit {
  errorMessage: string = '';
  fileUpload: boolean = false;
  fileUploadMessage: string = '';
  apiURL: string = environment.configSettings.apiURL;
  userFileObjectList = [];
  userFileList = ['Select'];
  publicFileObjectList = [];
  publicFileList = ['Select'];
  userLoggedIn: boolean = false;
  userFileSelection: string = 'Select';
  publicFileSelection: string = 'Select';

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.userLoggedIn = this.userAuthService.getJWTToken().length>0 ? true : false;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userAuthService.getJWTToken()
    });
    this.http.get(this.apiURL + 'fetch-files/', {headers}).subscribe(
      data => {
        this.userFileObjectList = data['user_file_list'];
        this.publicFileObjectList = data['public_file_list'];
        data['user_file_list'].forEach(item => {
          this.userFileList.push(item['file_name']);
        });
        data['public_file_list'].forEach(item => {
          this.publicFileList.push(item['file_name']);
        });
      },
      errors => {
        console.log(errors);
      }
    );
  }

  newFileUploaded(fileDetails: string) {
    this.fileUpload = false;
    if (fileDetails.length > 0) {
      this.errorMessage = '';
      this.fileUploadMessage = `${fileDetails} has been upload successfully. It will appear in the drop down list of files.`
    } else {
      this.fileUploadMessage = '';
      this.errorMessage = 'Upload canceled.'
    }

    setTimeout(() => {
      this.fileUploadMessage = '';
      this.errorMessage = '';
    }, 5000)
  }

}
