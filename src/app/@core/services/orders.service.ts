import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import {environment} from '@env/environment';
import { BarnService } from './barn.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { alertController } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService{
  apiUrl = this.auth.apiUrl;
  private ordersURL = this.apiUrl + '/orders';

  constructor(private auth: AuthService, private http: HttpClient){
  }
  getOrders(queryParams: string): Observable<any> {
    return this.auth.http.get<any>(this.ordersURL + queryParams, {headers: this.auth.headers});
  }

  getOrder(id: number): Observable<any> {
    return this.http.get(this.ordersURL + `/${id}`, {headers: this.auth.headers});
  }
  updateStateOrder(order, id: number): Observable<any> {
    const {orderBuyer, ...data} = order;
    return this.http.put<any>(this.ordersURL + `/${id}`, data, {headers: this.auth.headers});
  }

  updateOrder(order, id: number): Observable<any> {
    const formData = new FormData();
    // formData.append('productLotId', order.productLotId.toString());
    formData.append('orderDate', order.orderDate.toString());
    formData.append('userIdBuyer', order.userIdBuyer.toString());
    formData.append('deliveryAddress', order.deliveryAddress.toString());
    formData.append('expectedDeliveryDate', order.expectedDeliveryDate.toString());
    formData.append('incoterm', order.incoterm.toString());
    formData.append('freeTransport', order.freeTransport.toString());
    if (order.handedToCarrierDate) {
      formData.append('handedToCarrierDate', order.handedToCarrierDate.toString());
    }
    if (order.quantityHandedToCarrier) {
      formData.append('quantityHandedToCarrier', order.quantityHandedToCarrier.toString());
    }
    if (order.qualityHandedToCarrier) {
      formData.append('qualityHandedToCarrier', order.qualityHandedToCarrier.toString());
    }
    formData.append('_method', 'PUT');

    return this.http.post<any>(this.ordersURL + `/${id}`, formData, {headers: this.auth.headers});
  }

  addOrder(order): Observable<any> {
    const formData = new FormData();
    formData.append('productLotId', order.productLotId.toString());
    formData.append('orderDate', order.orderDate.toString());
    formData.append('userIdBuyer', order.userIdBuyer.toString());
    formData.append('deliveryAddress', order.deliveryAddress.toString());
    formData.append('expectedDeliveryDate', order.expectedDeliveryDate.toString());
    formData.append('incoterm', order.incoterm.toString());
    return this.http.post(this.ordersURL, formData, {headers: this.auth.headers});
  }
  addBarnOrder(data) {
    return this.http.post(this.ordersURL, data, {headers: this.auth.headers});
  }

  checkout(userId: number): Observable<any> {
    const formData = new FormData();
    return this.http.post<any>(this.ordersURL + '/addCart' + `/${userId}`, formData, {headers: this.auth.headers});
  }
}
