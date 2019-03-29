import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';
import { PageHeaderComponent } from './page-sections/page-header/page-header.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { RegisterBoxComponent } from './register-box/register-box.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';

import { FileUploadService } from './services/file-upload.service';
import { UserService } from './services/user.service';
import { UserAuthService } from './services/user-auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FileUploadFormComponent,
    PageHeaderComponent,
    AboutPageComponent,
    LoginBoxComponent,
    RegisterBoxComponent,
    DataAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    FileUploadService,
    UserService,
    UserAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
