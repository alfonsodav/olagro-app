import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  headers = this.auth.headers;
  private paymentURL = 'https://api.olagro.org/api' + '/invoicePayment';
  private paymentMethodsURL = 'https://api.olagro.org/api' + '/paymentMethods';
  constructor(private auth: AuthService, private http: HttpClient){
  }

  getPaymentMethods(queryParams: string): Observable<any[]> {
    return this.http.get<any[]>(this.paymentMethodsURL + queryParams, {headers: this.headers});
  }
  addPayment(payment: any): Observable<any> {
    const formData = new FormData();
    formData.append('paymentDate', payment.paymentDate.toString());
    formData.append('orderId', payment.orderId.toString());
    formData.append('paymentMethodId', payment.paymentMethodId.toString());
    formData.append('paymentAmount', payment.paymentAmount.toString());
    if (payment.paymentBankName) {
      formData.append('paymentBankName', payment.paymentBankName.toString());
    }
    if (payment.paymentBankAccount) {
      formData.append('paymentBankAccount', payment.paymentBankAccount.toString());
    }
    if (payment.paymentCardNumber) {
      formData.append('paymentCardNumber', payment.paymentCardNumber.toString());
    }
    if (payment.paymentCheckNumber) {
      formData.append('paymentCheckNumber', payment.paymentCheckNumber.toString());
    }
    if (payment.paymentTransactionNumber) {
      formData.append('paymentTransactionNumber', payment.paymentTransactionNumber.toString());
    }
    formData.append('paymentType', payment.paymentType);

    return this.http.post<any>(this.paymentURL, formData, {headers: this.headers});
  }

}
