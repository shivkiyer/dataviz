import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';

import { FileUploadService } from './services/file-upload.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FileUploadFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
