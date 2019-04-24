import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  showForm: boolean = false;

  newFileUploaded: string = '';
  fileUploadForm: FormGroup = new FormGroup({
    file_description: new FormControl(null),
    make_public: new FormControl(false)
  });

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
        this.errorMessage = '';
        this.showForm = true;
        this.newFileUploaded = data.body['file_name'];
      }, error => {
        this.errorMessage = error.error.message;
        if (error.status == 401) {
          this.userAuthService.clearToken();
          this.userAuthService.accountStatus.next(false);
        }
      });
  }

  fileUpdate() {
    const fileUploaded = {
      ...this.fileUploadForm.value,
      file_name: this.newFileUploaded
    };
    this.fileUploadService.updateFile(fileUploaded).subscribe(
      data => {
        this.errorMessage = '';
        this.fileDetails.emit(this.newFileUploaded);
      },
      errors => {
        if (errors.status == 401) {
          this.userAuthService.clearToken();
          this.userAuthService.accountStatus.next(false);
        }
        this.errorMessage = errors.error.message;
      }
    );
  }

  uploadCancel() {
    this.fileUploadService.cancelUpload(this.newFileUploaded).subscribe(
      data => {
        this.errorMessage = '';
        this.fileDetails.emit('');
      },
      errors => {
        this.errorMessage = errors.error.message;
      }
    );

  }

}
