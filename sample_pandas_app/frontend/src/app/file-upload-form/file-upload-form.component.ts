import { Component } from '@angular/core';

import { FileUploadService } from './../services/file-upload.service';
import { UserAuthService } from './../services/user-auth.service';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css']
})
export class FileUploadFormComponent {
  constructor(
    private fileUploadService: FileUploadService,
    private userAuthService: UserAuthService
  ) {}

  fileToUpload: File = null;
  errorMessage: string = '';

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.userAuthService.clearToken();
        this.userAuthService.accountStatus.next(false);
      });
  }

}
