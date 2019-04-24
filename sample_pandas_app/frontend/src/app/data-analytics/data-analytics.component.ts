import { Component } from '@angular/core';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html'
})
export class DataAnalyticsComponent {
  errorMessage: string = '';
  fileUpload: boolean = false;
  fileUploadMessage: string = '';

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
