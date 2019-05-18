import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-public-file-browser',
  templateUrl: './public-file-browser.component.html',
  styleUrls: ['./../file-browser.component.css']
})
export class PublicFileBrowserComponent {
  @Input() publicFileList: any;
  // By default, public files are at Select placeholder.
  publicFileSelection: string = 'Select';
  @Output() publicFile = new EventEmitter<string>();
  showFileName: string;
  showFileDetails: boolean = false;

  loadPublicFile() {
    /**
    When a public file is selected from drop down.
    */
    if (this.publicFileSelection != 'Select') {
      this.publicFile.emit(this.publicFileSelection);
      this.showFileDetails = false;
    }
  }

  displayFileDetails(file: any) {
    this.showFileDetails = false;
    const fileName = file.target.value;
    if (fileName != 'Select') {
      setTimeout(() => {
        this.showFileDetails = true;
        this.showFileName = fileName;
      }, 100);
    }
  }
}
