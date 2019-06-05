import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataframe-display',
  templateUrl: './dataframe-display.component.html',
  styleUrls: ['./dataframe-display.component.css']
})
export class DataFrameDisplayComponent implements OnInit {

  @Input() dataFrame: any;
  rowLimit: number = 25;
  startIndex: number = 0;
  endIndex: number = 25;
  rowIndices: number[];

  generateRowIndices() {
    /**
    Generate a list from start to end.
    */
    this.rowIndices = [];
    for (let count=this.startIndex; count<this.endIndex; count++) {
      if (count>this.dataFrame['data'].length-1) {
        break;
      }
      this.rowIndices.push(count);
    }
  }

  ngOnInit() {
    /**
    On launch, the rows are from 0 to 24.
    */
    this.generateRowIndices();
  }

  nextRows() {
    /**
    As user clicks next rows button.
    */
    this.startIndex = this.endIndex;
    // Check for overflows.
    if (this.startIndex >= this.dataFrame['data'].length) {
      this.startIndex = this.dataFrame['data'].length;
    }
    this.endIndex = this.startIndex + this.rowLimit;
    if (this.endIndex >= this.dataFrame['data'].length) {
      this.endIndex = this.dataFrame['data'].length;
    }
    this.generateRowIndices();
  }

  previousRows() {
    /**
    As user clicks previous rows button.
    */
    this.endIndex = this.startIndex;
    // Check for underflows.
    if (this.endIndex <= 0) {
      this.endIndex = 0;
    }
    this.startIndex = this.endIndex - this.rowLimit;
    if (this.startIndex <= 0) {
      this.startIndex = 0;
    }
    this.generateRowIndices();
  }

}
