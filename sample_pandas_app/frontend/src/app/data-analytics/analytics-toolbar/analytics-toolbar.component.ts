import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { FileManagementService } from './../../services/file-management.service';

@Component({
  selector: 'app-analytics-toolbar',
  templateUrl: './analytics-toolbar.component.html',
  styleUrls: ['./analytics-toolbar.component.css']
})
export class AnalyticsToolbarComponent implements OnInit {
  @Output() dataframe = new EventEmitter<any>();
  @Output() displayFrame = new EventEmitter<boolean>();
  fileList = [];

  constructor(
    private fileManagementService: FileManagementService
  ) {}

  extractFileNames(fileObjects: any) {
    return fileObjects.map(
      item => item[Object.keys(item)[0]]
    );
  }

  ngOnInit() {
    this.fileList = this.extractFileNames(this.fileManagementService.loadedFileList);
    this.fileManagementService.dataFileListener.subscribe(
      data => {
        if (data) {
          this.fileList = this.extractFileNames(data);
        }
      }
    );
  }

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
