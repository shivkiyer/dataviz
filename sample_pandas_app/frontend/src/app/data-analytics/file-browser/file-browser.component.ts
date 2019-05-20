import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent {
  @Input() userFileBrowser: boolean;
  @Input() fileList: any;
  @Input() userLoggedIn: boolean;
  // By default, files are at Select placeholder.
  fileSelection: string = 'Select';
  @Output() fileSelected = new EventEmitter<string>();
  @Output() deleteFile = new EventEmitter<string>();
  confirmDeleteMessage: boolean = false;
  showFileName: string;
  showFileDetails: boolean = false;

  loadFile() {
    /**
    When user clicks load button, emits the filename selected.
    */
    if (this.fileSelection != 'Select') {
      this.fileSelected.emit(this.fileSelection);
    }
  }

  deleteFileMessage() {
    /**
    When a user wants to delete a file, display a confirmation.
    */
    if (this.fileSelection != 'Select') {
      this.confirmDeleteMessage = true;
    }
  }

  confirmedDelete() {
    /**
    If user says yes to the delete, send this file for deletion.
    */
    if (this.fileSelection != 'Select') {
      this.deleteFile.emit(this.fileSelection);
      this.confirmDeleteMessage = false;
      this.fileSelection = 'Select'
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
