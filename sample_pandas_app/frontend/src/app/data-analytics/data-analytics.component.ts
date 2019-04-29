import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserAuthService } from './../services/user-auth.service';
import { FileManagementService } from './../services/file-management.service';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html'
})
export class DataAnalyticsComponent implements OnInit {
  errorMessage: string = '';
  fileUpload: boolean = false;
  fileUploadMessage: string = '';
  userFileList = ['Select'];
  publicFileList = ['Select'];
  userLoggedIn: boolean = false;
  userFileSelection: string = 'Select';
  publicFileSelection: string = 'Select';

  constructor(
    private userAuthService: UserAuthService,
    private fileManagementService: FileManagementService
  ) {}

  ngOnInit() {
    this.userLoggedIn = this.userAuthService.getJWTToken().length>0 ? true : false;
    this.fileManagementService.fetch_files().subscribe(
      data => {
        this.userFileList = [...this.fileManagementService.userFileList];
        this.publicFileList = [...this.fileManagementService.publicFileList];
        this.errorMessage = '';
      },
      errors => {
        this.errorMessage = errors.error.message;
      }
    );
  }

  newFileUploaded(fileDetails: string) {
    this.fileUpload = false;
    if (fileDetails.length > 0) {
      this.errorMessage = '';
      this.userFileList.push(fileDetails);
      this.fileManagementService.userFileList.push(fileDetails);
      this.fileUploadMessage = `${fileDetails} has been upload successfully. It will appear in the drop down list of files.`
    } else {
      this.fileUploadMessage = '';
      this.errorMessage = 'Upload canceled.';
    }

    setTimeout(() => {
      this.fileUploadMessage = '';
      this.errorMessage = '';
    }, 5000);
  }

  loadUserFile(fileName: string) {
    console.log(fileName);
  }

  loadPublicFile(fileName: string) {
    console.log(fileName);
  }

}
