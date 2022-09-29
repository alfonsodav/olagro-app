import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@core/services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ProductService } from '@app/@core/services/product.service';
import { BarnService } from '@app/@core/services/barn.service';
import { Storage } from '@capacitor/storage';
import { AuthService } from '@app/@core/services/auth.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orden: any;
  productList = [];
  rol;
  constructor(
    private order: OrdersService,
    private activate: ActivatedRoute,
    private productServ: ProductService,
    private barnService: BarnService,
    private auth: AuthService,
    public actionSheetController: ActionSheetController,
    private alertIo: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.getOrder();
    this.getUserInfo();
  }
  getUserInfo() {
    this.auth.user$.subscribe((data) => (this.rol = data.roles[0]));
  }
  getOrder(): void {
    this.activate.params.subscribe((params) => {
      if (params.id && params.id > 0) {
        const id = +params.id;
        this.order.getOrder(id).subscribe(
          (response) => this.handleResponse(response.data),
          (error) => console.log(error),
          () => console.log(this.orden)
        );
      }
    });
  }
  handleResponse(response: any) {
    this.orden = response;
    console.log(this.orden.product);
    if (this.orden.product && Array.isArray(this.orden.product)) {
      if (this.orden.typeOrder !== 'barn') {
        console.log('entro');
        this.orden.product.forEach((data) => this.getProductLot(data.id));
      } else {
        this.orden.product.forEach((data) => this.getLotBarn(data.id));
      }
    } else {
      if (this.orden.typeOrder !== 'barn') {
        this.getProductLot(this.orden.product[0].id);
      } else {
        this.getLotBarn(this.orden.product);
      }
    }
  }
  getProductLot(id) {
    this.productServ.getProductLot(id).subscribe((data) => {
      this.productList.push(data.data);
      console.log(data.data);
    });
  }
  getLotBarn(id) {
    this.barnService.getBarn(id).subscribe((data) => {
      this.productList.push(data.data);
      console.log(data.data);
    });
  }
  async myAlert(message: string) {
    const customAlert = await this.alertIo.create({
      message,
      mode: 'ios',
      buttons: [
        {
          text: 'Seguir viendo',
          role: 'cancel',
          handler: () => console.log('cancel'),
        },
        { text: 'Ir a listado', handler: () => this.router.navigate(['/orders']) },
      ],
    });
    await customAlert.present();
  }
  updateOrder(state): any {
    console.log('actualizando', state);
    const miorden = this.orden;
    miorden.orderStatus = state;
    // miorden.deliveryAddress = 'mi nueva casa';
    this.order
      .updateStateOrder(miorden, this.orden.orderId)
      .subscribe((data) => {console.log(data);
      this.myAlert('Orden actualizada correctamente.');
    });
  }
  async changeStatus(status) {
    const sheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cerrar orden',
          role: 'destructive',
          icon: 'close-circle-outline',
          handler: () => {
            this.updateOrder(2);
          },
        },
        {
          text: 'Cancelar orden',
          role: 'destructive',
          icon: 'close-circle',
          handler: () => {
            this.updateOrder(3);
          },
        },
      ],
    });
    console.log(status);
    if (status === 1) {
      await sheet.present();
    }
  }

  validateRol() {
    if (
      this.rol.name === 'Administrador Sistema' ||
      this.rol.name === 'Gerente General' ||
      this.rol.name === 'Promotor'
    ) {
      return true;
    }
    return false;
  }
}
