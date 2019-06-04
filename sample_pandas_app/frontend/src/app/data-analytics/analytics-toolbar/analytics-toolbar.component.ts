import { Component, Output, EventEmitter } from '@angular/core';

import { FileManagementService } from './../../services/file-management.service';

@Component({
  selector: 'app-analytics-toolbar',
  templateUrl: './analytics-toolbar.component.html',
  styleUrls: ['./analytics-toolbar.component.css']
})
export class AnalyticsToolbarComponent {
  @Output() dataframe = new EventEmitter<any>();
  @Output() displayFrame = new EventEmitter<boolean>();

  constructor(
    private fileManagementService: FileManagementService
  ) {}

  startQuery() {
    this.fileManagementService.fetchDataFrame().subscribe(
      data => {
        this.dataframe.emit(data);
        this.displayFrame.emit(true);
      },
      error => {
        console.log(error);
      }
    )
  }

}
