/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';

import { ProductComponent } from '@app/pages/share/product/product.component';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-product-buy',
  templateUrl: './product-buy.page.html',
  styleUrls: ['./product-buy.page.scss'],
})
export class ProductBuyPage extends ProductComponent {

  addToCart() {
    let user;
    this.auth.user$.subscribe(data => user = data);
    const newShoppingCartDetail = {
      user_id: parseInt(user.id, 10),
      productLotId: this.product.productLotId
    };

    this.shoppingService.addProductLot(newShoppingCartDetail).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/product/shopping-cart']);
      },
      error => console.log(error)
    );
  }
  onBookins() {
    this.router.navigate(['/product/bookings', this.product.productLotId]);
  }
}
