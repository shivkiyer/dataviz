import { Component } from '@angular/core';

import { FileUploadService } from './../services/file-upload.service';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html'
})
export class FileUploadFormComponent {
  constructor(
    private fileUploadService: FileUploadService
  ) {}

  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

}
