import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { OrdersService } from '@app/@core/services/orders.service';
import { ProductService } from '@app/@core/services/product.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-barn-order',
  templateUrl: './barn-order.component.html',
  styleUrls: ['./barn-order.component.scss'],
})
export class BarnOrderComponent implements OnInit {
  loadingProductTypes = true;
  barnOrderForm = new FormGroup({
    productTypeId: new FormControl({ value: 0, disabled: false }, [
      Validators.required,
    ]),
    orderTotal: new FormControl({ value: 0, disabled: false }, [
      Validators.required,
      Validators.pattern('^[0-9]*.?[0-9]*$'),
    ]),
    deliveryAddress: new FormControl({ value: '', disabled: false }),
    expectedDeliveryDate: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    incoterm: new FormControl({ value: '', disebled: false }, [
      Validators.required,
    ]),
  });
  user;
  errorMessage = '';
  productTypes = [];
  saving = false;
  public markers: any[];
  public lat: number;
  public lng: number;
  public zoom: number;
  requireCoord = false;
  coordinatesAddress: any = null;

  constructor(
    private productTypeService: ProductService,
    private orderService: OrdersService,
    private router: Router,
    private auth: AuthService
  ) {
    this.lat = 14.140674380012081;
    this.lng = -87.23879919064126;
    this.zoom = 8;
    this.markers = [];
  }

  ngOnInit() {
    this.getProductTypes();
  }
  setPoint(event) {
    console.log(event);
    this.coordinatesAddress = event.coords;
    this.markers = [
      {
        position: event.coords,
        label: {
          color: 'black',
          text: 'Destino',
        },
      },
    ];
  }

  getProductTypes(): void {
    this.loadingProductTypes = true;
    this.productTypeService.getProductTypes('').subscribe(
      (response) => this.handleProductTypesResponse(response),
      (error) => this.handleProductTypesError(error)
    );
  }

  onSave() {
    this.saving = true;
    this.auth.user$.subscribe((data) => (this.user = data));
    console.log(this.barnOrderForm.controls.expectedDeliveryDate.value);
    const order = {
      userIdBuyer: this.user.id,
      productTypeId: this.barnOrderForm.controls.productTypeId.value,
      orderTotal: this.barnOrderForm.controls.orderTotal.value,
      deliveryAddress: this.barnOrderForm.controls.deliveryAddress.value,
      coordinatesAddress: this.coordinatesAddress,
      typeOrder: 'barn',
      product: [],
      incoterm: this.barnOrderForm.controls.incoterm.value,
      orderDate: formatDate(new Date(), 'yyyy/MM/dd', 'es-HN'),
      expectedDeliveryDate: formatDate(
        this.barnOrderForm.controls.expectedDeliveryDate.value,
        'yyyy/MM/dd',
        'es-HN'
      ),
    };
    this.orderService.addBarnOrder(order).subscribe((data) => {
      this.saving = false;
      this.router.navigate(['/barn/catalogue']);
    });
  }
  onErrorClear() {
    this.errorMessage = '';
  }
  protected handleProductTypesResponse(response: any) {
    this.loadingProductTypes = false;
    this.productTypes = response.data;
  }

  protected handleProductTypesError(error: any) {
    this.loadingProductTypes = false;
    console.error(error);
  }
}
