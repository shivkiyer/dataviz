import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserAuthService } from './../services/user-auth.service';
import { FileManagementService } from './../services/file-management.service';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.css']
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
  displayFrame: boolean = false;
  dataFrame: any = {};

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
    this.fileManagementService.loadUserFile(fileName).subscribe(
      data => {
        this.dataFrame = JSON.parse(data['dataframe']);
        this.displayFrame = true;
        this.errorMessage = '';
      },
      errors => {
        this.errorMessage = errors.error.message;
      }
    );
  }

  loadPublicFile(fileName: string) {
    this.loadUserFile(fileName);
  }

  userDeleteFile(fileName: string) {
    this.fileManagementService.deleteUserFile(fileName).subscribe(
      data => {
        this.userFileList = [...this.fileManagementService.userFileList];
        this.errorMessage = '';
      },
      errors => {
        this.errorMessage = errors.error.message;
      }
    );
  }

}
