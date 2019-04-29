import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html'
})
export class FileBrowserComponent {
  @Input() userFileList: any;
  @Input() publicFileList: any;
  @Input() userLoggedIn: boolean;
  userFileSelection: string = 'Select';
  publicFileSelection: string = 'Select';
  @Output() userFile = new EventEmitter<string>();
  @Output() publicFile = new EventEmitter<string>();

  loadUserFile() {
    if (this.userFileSelection != 'Select') {
      this.userFile.emit(this.userFileSelection);
    }
  }

  loadPublicFile() {
    if (this.publicFileSelection != 'Select') {
      this.publicFile.emit(this.publicFileSelection);
    }
  }

}
