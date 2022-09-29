import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { OrdersService } from '@app/@core/services/orders.service';
import { ShoppingCartService } from '@app/@core/services/shopping-cart.service';
import { Storage } from '@capacitor/storage';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  public productLots: any[];
  shoppingCart: any;
  errorMessage = '';
  saving= false;
  user;
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private ordersService: OrdersService,
    private toast: ToastController,
    private alertControl: AlertController,
    public actionSheetController: ActionSheetController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getShoppingCart();
  }

  getShoppingCart(): void {
    this.auth.user$.subscribe(data => this.user = data);
    this.shoppingCartService.getUserShoppingCart(this.user.id).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  handleResponse(response) {
    console.log(response);
    this.shoppingCart = response.data || {productLots: []};
    this.productLots = this.shoppingCart.productLots;
  }

  handleError(error: any) {
    this.errorMessage = '';
  }

  calculation() {
    let sum = 0;
    if (this.shoppingCart && this.shoppingCart.productLots && this.shoppingCart.productLots.length > 0) {
      for (const productLot of this.shoppingCart.productLots) {
        sum += productLot.productLotSalePrice;
      }
    }

    return sum;
  }

  async onDeleteProductLot(id: number) {
    const dialogRef = await this.alertControl.create({
      message: '¿Desea retirar lote de producto del carro de compra?',
      header: 'Confirmación',
      buttons: [{
        text: 'No'
      }, {text: 'Si', handler: ()=> true}]
    });
    await dialogRef.present();
    const { ...result } = await dialogRef.onWillDismiss();
    console.log(result);

    if (result) {
      this.shoppingCartService.removeProductLot(this.shoppingCart.id, id, 1).subscribe(
        response => {
          this.getShoppingCart();
          this.toast.create({
            message: 'Lote de producto retirado de carro de compra', duration: 500
          });
        }
      );
    }
  }

  onCheckout() {
    this.ordersService.checkout(this.user.id).subscribe(
      response => this.handleCheckoutResponse(response),
      error => this.handleError(error)
    );
  }


  handleCheckoutResponse(response) {
    this.toast.create({
      message: 'orden realizada',
      duration: 500
    })
      .then(
        () => this.router.navigate(['/share/catalog'])
      );
  }

  onErrorClear() {
    this.errorMessage = '';
  }
  async presentActionSheet(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Quieres?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Ver Detalle',
        icon: 'eye',
        handler: () => {
          this.router.navigate(['detail', id]);
        }
      }, {
        text: 'Retirar de Carro de Compra',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.onDeleteProductLot(id);
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
