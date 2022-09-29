/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Barn } from './../models/barn';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BarnService {
  public calendar = [{
    mes: 'enero',
    numberMes: 0,
    quincena: 1, data: [], productTypes: [],
  }, {
    mes: 'enero',
    numberMes: 0,
    quincena: 2, data: [], productTypes: []
  },
  {
    mes: 'febrero',
    numberMes: 1,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'febrero',
    numberMes: 1,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'marzo',
    numberMes: 2,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'marzo',
    numberMes: 2,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'abril',
    numberMes: 3,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'abril',
    numberMes: 3,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'mayo',
    numberMes: 4,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'mayo',
    numberMes: 4,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'junio',
    numberMes: 5,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'junio',
    numberMes: 5,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'julio',
    numberMes: 6,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'julio',
    numberMes: 6,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'agosto',
    numberMes: 7,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'agosto',
    numberMes: 7,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'septiembre',
    numberMes: 8,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'septiembre',
    numberMes: 8,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'octubre',
    numberMes: 9,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'octubre',
    numberMes: 9,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'noviembre',
    numberMes: 10,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'noviembre',
    numberMes: 10,
    quincena: 2, data: [], productTypes: []
  }, {
    mes: 'diciembre',
    numberMes: 11,
    quincena: 1, data: [], productTypes: []
  }, {
    mes: 'diciembre',
    numberMes: 11,
    quincena: 2, data: [], productTypes: []
  }];
  onload = true;
  private barnUrl = `https://api.olagro.org/api/barn`;
  private productImagesUrl = `https://api.olagro.org/api/productImages`;

  constructor(private auth: AuthService, private http: HttpClient ){
  }

  /** GET contents from contents endpoint */
  getBarns(queryParams: string): Observable<Barn[]> {
    return this.http.get<Barn[]>(`${this.barnUrl}${queryParams}`, { headers: this.auth.headers });
  }

  /** GET content detail from content-detail endpoint */
  getBarn(id: number): Observable<any> {
    return this.http.get<Barn>(`${this.barnUrl}/${id}`, { headers: this.auth.headers });
  }

  /** POST content to contents endpoint */
  addBarn(barn): Observable<Barn> {
    const formData = new FormData();
    formData.append('user_id', String(barn.user_id));
    formData.append('productTypeId', String(barn.productTypeId));
    formData.append('cultivated_area', String(barn.cultivated_area));
    formData.append('cultivated_area_address', String(barn.cultivated_area_address));
    formData.append('estimated_production', String(barn.estimated_production));
    formData.append('productMassMeasurementId', String(barn.productMassMeasurementId));
    formData.append('production_mode', barn.production_mode);
    formData.append('harvest_date', barn.harvest_date);
    formData.append('price', String(barn.price));
    formData.append('status', barn.status);

    return this.http.post<Barn>(this.barnUrl, barn, { headers: this.auth.headers });
  }

  /** PUT content to contents endpoint */
  updateBarn(barn, id: number): Observable<Barn> {
    return this.http.post<Barn>(this.barnUrl + `/${id}`, barn, { headers: this.auth.headers });
  }
  updateStateBarn(barn, id: number): Observable<any> {
    return this.http.put<Barn>(this.barnUrl + `/${id}`, barn, { headers: this.auth.headers });
  }

  /** DELETE content content endpoint */
  deleteBarn(id: number, userId: number): Observable<Barn> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        user_id: userId
      }
    };
    return this.http.delete<Barn>(this.barnUrl + `/${id}`, { headers: this.auth.headers });
  }

  /** GET contents from contents endpoint */
  getBarnImages(): Observable<any[]> {
    return this.http.get<any[]>(this.productImagesUrl);
  }
}
