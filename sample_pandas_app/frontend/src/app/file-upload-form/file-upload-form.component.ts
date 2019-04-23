import { Component, Output, EventEmitter } from '@angular/core';

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
  @Output() fileDetails = new EventEmitter<any>();

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
        this.fileDetails.emit(data.body['file_name']);
        console.log(data);
      }, error => {
        this.errorMessage = error.error.message;
        if (error.status == 401) {
          this.userAuthService.clearToken();
          this.userAuthService.accountStatus.next(false);
        }
      });
  }

}
