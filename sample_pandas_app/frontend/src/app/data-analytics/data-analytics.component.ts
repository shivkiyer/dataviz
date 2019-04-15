import { Component } from '@angular/core';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html'
})
export class DataAnalyticsComponent {
  fileUpload: boolean = false;
  fileUploadMessage: string = '';

  newFileUploaded(fileDetails: string) {
    this.fileUpload = false;
    this.fileUploadMessage = `${fileDetails} has been upload successfully. It will appear in the drop down list of files.`
    setTimeout(() => {
      this.fileUploadMessage = '';
    }, 5000)
  }

}
