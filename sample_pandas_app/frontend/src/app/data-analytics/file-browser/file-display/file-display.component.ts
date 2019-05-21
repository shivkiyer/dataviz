import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { FileManagementService } from './../../../services/file-management.service';

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html'
})
export class FileDisplayComponent implements OnInit {

  constructor(
    private fileManagementService: FileManagementService
  ) {}

  @Input() userFileBrowser: boolean;
  @Input() fileName: string;
  fileDetails: any;
  @Output() hideCommand = new EventEmitter<boolean>();
  showEditForm: boolean = false;

  ngOnInit() {
    /**
    When display component is created, it extracts the details
    from the fileManagementService.
    */
    this.fileDetails = this.fileManagementService.showFileDetails(this.fileName);
  }

  hideDisplay() {
    /**
    When user clicks the Hide button.
    */
    this.hideCommand.emit(true);
  }

  editFileDetails() {
    /**
    When user clicks on the Edit button,
    an edit form is displayed.
    */
    this.showEditForm = true;
  }

  redisplayFile() {
    /**
    After editing, the new file details need to extracted
    again from fileManagementService.
    */
    this.fileDetails = this.fileManagementService.showFileDetails(this.fileName);
    this.showEditForm = false;
  }

}
