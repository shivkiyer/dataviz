import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {

  userLoggedIn: boolean = false;
  smallWindow: boolean = false;

  constructor() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth < 960) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

}
