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
  showToolbar: boolean = false;

  constructor(
    private userAuthService: UserAuthService,
    private fileManagementService: FileManagementService
  ) {}

  ngOnInit() {
    /**
    Checks if a user is logged in when user comes to this page.
    Accordingly shows files that user can load.
    */
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
    /**
    Shows either a success or error message after a file is uploaded.
    */
    this.fileUpload = false;
    // fileDetails is emitted by file-upload-form when a file is uploaded.
    if (fileDetails.length > 0) {
      this.errorMessage = '';
      this.userFileList.push(fileDetails);
      this.fileUploadMessage = `${fileDetails} has been upload successfully. It will appear in the drop down list of files.`
    } else {
      this.fileUploadMessage = '';
      this.errorMessage = 'Upload canceled.';
    }

    // The message is displayed only for 5s.
    setTimeout(() => {
      this.fileUploadMessage = '';
      this.errorMessage = '';
    }, 5000);
  }

  loadUserFile(fileName: string) {
    /**
    Loads a file chosen by user from drop down list in file-browser.
    */
    this.fileManagementService.loadUserFile(fileName).subscribe(
      (data) => {
        this.dataFrame = data;
        // this.displayFrame = true;
        this.showToolbar = true;
        this.errorMessage = '';
      },
      errors => {
        this.errorMessage = errors.error.message;
      }
    );
  }

  loadPublicFile(fileName: string) {
    /**
    The method is the same whether user file or public file.
    */
    this.loadUserFile(fileName);
  }

  userDeleteFile(fileName: string) {
    /**
    Deletes a file the user chooses from drop-down box file-browser.
    */
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
