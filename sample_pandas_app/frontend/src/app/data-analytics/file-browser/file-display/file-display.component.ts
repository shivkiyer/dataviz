import { Component, Input, OnInit } from '@angular/core';

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

  ngOnInit() {
    this.fileDetails = this.fileManagementService.showFileDetails(this.fileName);
  }
}
