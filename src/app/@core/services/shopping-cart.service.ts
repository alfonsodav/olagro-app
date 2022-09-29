/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService{
  private shoppingCartUrl = this.auth.apiUrl + '/shoppingCarts';
  constructor(private auth: AuthService, private http: HttpClient){
  }


  /** GET Shopping Cart from a user endpoint */
  getUserShoppingCart(userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(
      this.shoppingCartUrl + `/user/${userId}`,
      { headers: this.auth.headers }
    );
  }

  /** POST Shopping Cart add a product lot */
  addProductLot(shoppingCart: any): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(this.shoppingCartUrl, shoppingCart, {
      headers: this.auth.headers,
    });
  }

  /** DELETE content content endpoint */
  removeProductLot(
    sCartId: number,
    id: number,
    userId: number
  ): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(this.shoppingCartUrl + '/item', {
      headers: this.auth.headers,
      body: {
        shoppingCartId: sCartId,
        productLotId: id,
        user_id: userId,
      },
    });
  }
}
