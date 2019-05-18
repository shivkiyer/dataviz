import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-file-browser',
  templateUrl: './user-file-browser.component.html',
  styleUrls: ['./../file-browser.component.css']
})
export class UserFileBrowserComponent {
  @Input() userFileList: any;
  @Input() userLoggedIn: boolean;
  // By default, user files are at Select placeholder.
  userFileSelection: string = 'Select';
  @Output() userFile = new EventEmitter<string>();
  @Output() deleteFile = new EventEmitter<string>();
  confirmDeleteMessage: boolean = false;
  showFileName: string;
  showFileDetails: boolean = false;

  loadUserFile() {
    /**
    When user clicks load button, emits the filename selected.
    */
    if (this.userFileSelection != 'Select') {
      this.userFile.emit(this.userFileSelection);
    }
  }

  deleteUserFile() {
    /**
    When a user wants to delete a file, display a confirmation.
    */
    if (this.userFileSelection != 'Select') {
      this.confirmDeleteMessage = true;
    }
  }

  confirmedDelete() {
    /**
    If user says yes to the delete, send this file for deletion.
    */
    if (this.userFileSelection != 'Select') {
      this.deleteFile.emit(this.userFileSelection);
      this.confirmDeleteMessage = false;
      this.userFileSelection = 'Select';
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
