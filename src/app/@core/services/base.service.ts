import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Storage } from '@capacitor/storage';


export interface RequesOptions {
  headers?: {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  baseUrl = environment.endpoint;
  apiUrl = environment.apiUrl;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    //this.headers = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'multipart/form-data',
    //});
  }

  get authOptions(): RequesOptions {
    return {
      headers: this.authHeaders,
    };
  }

  get authHeaders(): { [name: string]: string } {
    let token = '';
    Storage.get({ key: 'token' }).then((data) => (token = data.value));
    return {
      authorization: token,
    };
  }

  get refreshHeaders(): { [name: string]: string } {
    let token = '';
    Storage.get({ key: 'token' }).then((data) => (token = data.value));
    return {
      authorization: token,
    };
  }
}
