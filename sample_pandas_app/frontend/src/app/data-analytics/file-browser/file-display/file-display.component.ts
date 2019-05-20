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

  @Input() fileName: string;
  fileDetails: any;
  @Output() hideCommand = new EventEmitter<boolean>();
  showEditForm: boolean = false;

  ngOnInit() {
    this.fileDetails = this.fileManagementService.showFileDetails(this.fileName);
  }

  hideDisplay() {
    this.hideCommand.emit(true);
  }

  editFileDetails() {
    this.showEditForm = true;
  }

  redisplayFile() {
    this.fileDetails = this.fileManagementService.showFileDetails(this.fileName);
    this.showEditForm = false;
  }

}
