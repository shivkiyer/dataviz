import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent {
  @Input() userFileList: any;
  @Input() publicFileList: any;
  @Input() userLoggedIn: boolean;
  // By default, both user and public files are at Select placeholder.
  userFileSelection: string = 'Select';
  publicFileSelection: string = 'Select';
  @Output() userFile = new EventEmitter<string>();
  @Output() publicFile = new EventEmitter<string>();
  @Output() deleteFile = new EventEmitter<string>();
  confirmDeleteMessage: boolean = false;

  loadUserFile() {
    /**
    When user clicks load button, emits the filename selected.
    */
    if (this.userFileSelection != 'Select') {
      this.userFile.emit(this.userFileSelection);
    }
  }

  loadPublicFile() {
    /**
    When a public file is selected from drop down.
    */
    if (this.publicFileSelection != 'Select') {
      this.publicFile.emit(this.publicFileSelection);
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
      this.userFileSelection = 'Select'
    }
  }

}
