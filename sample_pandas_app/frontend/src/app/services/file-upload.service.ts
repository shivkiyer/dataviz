import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileUploadService {
  constructor(
    private httpClient: HttpClient
  ) {}

  postFile(fileToUpload: File): Observable<any> {
      const endpoint = 'http://localhost:8010/api/test/';
      const formData: FormData = new FormData();
      formData.append('fileKey', fileToUpload, fileToUpload.name);
      return this.httpClient
        .post(endpoint, formData,
          {
            withCredentials: true
          }
        );
  }


}
