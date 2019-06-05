import { Component, OnInit } from '@angular/core';

import { FileManagementService } from './../../services/file-management.service';

@Component({
  selector: 'app-user-commands',
  templateUrl: './user-commands.component.html'
})
export class UserCommandsComponent implements OnInit {

  constructor(
    private fileManagementService: FileManagementService
  ) {}

  dataFrame: any;
  displayFrame: boolean = false;
  showToolbar: boolean = false;

  ngOnInit() {
    this.fileManagementService.dataFileListener.subscribe(
      data => {
        if (data) {
          this.showToolbar = true;
        }
      }
    );
  }

  showDataFrame(data: any) {
    this.dataFrame = data;
    this.displayFrame = true;
  }

}
