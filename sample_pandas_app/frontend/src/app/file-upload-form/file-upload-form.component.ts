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
    /**
    This method is called when there is any change in the
    file selection input field.
    */
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    /**
    Send the file to the backend for storage.
    */
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
        this.errorMessage = '';
        // Display the form to change description and public fields.
        this.showForm = true;
        this.newFileUploaded = data.body['file_name'];
      }, error => {
        this.errorMessage = error.error.message;
        if (error.status == 401) {
          this.userAuthService.clearToken();
          // When a user's token has expired, this sends
          // a signal across the app.
          this.userAuthService.accountStatus.next(false);
        }
      });
  }

  fileUpdate() {
    /**
    When user clicks submit button after entering file details.
    */
    const fileUploaded = {
      ...this.fileUploadForm.value,
      file_name: this.newFileUploaded
    };
    this.fileUploadService.updateFile(fileUploaded).subscribe(
      data => {
        this.errorMessage = '';
        // Emit the name of the file to data-analytics
        this.fileDetails.emit(this.newFileUploaded);
      },
      errors => {
        if (errors.status == 401) {
          this.userAuthService.clearToken();
          // When a user's token has expired, this sends
          // a signal across the app.
          this.userAuthService.accountStatus.next(false);
        }
        this.errorMessage = errors.error.message;
      }
    );
  }

  uploadCancel() {
    /**
    Cancel the upload.
    */
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
