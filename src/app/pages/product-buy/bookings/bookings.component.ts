/* eslint-disable @typescript-eslint/naming-convention */
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { BarnService } from '@app/@core/services/barn.service';
import { OrdersService } from '@app/@core/services/orders.service';
import { PaymentService } from '@app/@core/services/payment.service';
import { ProductService } from '@app/@core/services/product.service';
import { NumberValidator } from '@app/pages/barn/barn-detail/barn-detail.component';
import { Storage } from '@capacitor/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  orderForm = new FormGroup({
    productTypeId: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, NumberValidator.validGreaterThanZero]),
    orderTotal: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'), NumberValidator.validGreaterThanZero]),
    expectedDeliveryDate: new FormControl(
      { value: '', disabled: false },
      [Validators.required]),
  });
  paymentForm = new FormGroup({
    payment_id: new FormControl(
      { value: 0, disabled: false },
      [Validators.required]),
    payment_date: new FormControl(
      { value: '', disabled: false },
      [Validators.required]),
    orderId: new FormControl(
      { value: 0, disabled: false },
      [Validators.required]),
    payment_method_id: new FormControl(
      { value: 0, disabled: false },
      [Validators.required]),
    payment_amount: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
    payment_bank_account: new FormControl(
      { value: '', disabled: true }),
    payment_bank_name: new FormControl(
      { value: '', disabled: true }),
    payment_card_number: new FormControl(
      { value: '', disabled: true }),
    payment_check_number: new FormControl(
      { value: '', disabled: true }),
    payment_transaction_number: new FormControl(
      { value: '', disabled: true })
  });
  selectedPaymentType: number;
  deliveryAddress: '';
  incoterm = '';
  details = {
    amount: 0,
    concept: '',
    numberRef: '',
    paymentMethod: ''
  };
  paymentMethods: any[];
  product;
  orderTotal = 0;
  user: any = {};
  fromBarn = false;
  constructor(
    private router: Router, private activate: ActivatedRoute,
    private paymentService: PaymentService, public toastController: ToastController,
    private productSer: ProductService, private orderServ: OrdersService,
    private barnService: BarnService,
    private auth: AuthService) {
     }

  ngOnInit() {
    let id = null;
    this.auth.user$.subscribe(data => this.user = data);
    this.activate.params.subscribe(r => {
      id = r.id;
    });
    this.activate.queryParams.subscribe(data => {
      if (data.barn === 'true') {
        this.fromBarn = true;
      }
      this.getProductLot(id);
    });

    this.getPaymentMethods();
  }

  getPaymentMethods(): void {
    this.paymentService.getPaymentMethods('').subscribe(
      response => this.handlePaymentMethodsResponse(response),
      error => console.log(error)
    );
  }
  handlePaymentMethodsResponse(response: any) {
    this.paymentMethods = response.data;
  }

  handlePaymentMethodsError(error) {
    console.error(error);
  }
  getProductLot(id) {
    if (this.fromBarn) {
      this.barnService.getBarn(id).subscribe(data => {
        this.product = data.data;
        this.orderTotal = this.product.price * (this.product.estimated_production - this.product.available_quantity);
        console.log(this.orderTotal);
        console.log(data);
      });
    } else {
      this.productSer.getProductLot(id).subscribe(data => {
        this.product = data.data;
        console.log(data);
        this.orderTotal = this.product.productLotSalePrice * this.product.productLotQuantity;
      });
    }
  }
  onSave() {
    const order: any = {
      userIdBuyer: this.user.id,
      productTypeId: this.product.productTypeId,
      orderTotal: this.orderTotal,
      deliveryAddress: this.deliveryAddress,
      typeOrder: 'catalog',
      incoterm: this.incoterm,
      orderDate: formatDate(new Date(), 'yyyy/MM/dd', 'es-HN'),
      expectedDeliveryDate: this.product.harvest_date || formatDate(this.product.productLotAvailableDate, 'yyyy/MM/dd', 'es-HN'),
      // details: JSON.stringify(this.details)
    };
    if (this.fromBarn) {
      order.orderedQuantity = this.product.estimated_production - this.product.available_quantity;
      order.product = [
        {
          id: this.product.id,
          quantity: this.product.estimated_production - this.product.available_quantity,
          price:  this.orderTotal
        }];
    } else {
      order.product = [
        {
          id: this.product.productLotId,
          quantity: this.product.productLotQuantity,
          price: this.product.productLotSalePrice * this.product.productLotQuantity
        }];
    }
    this.orderServ.addBarnOrder(order).subscribe(data => {
      console.log(data);
      this.savePayment(data);
    }, error => this.toastController.create({
      message: 'Ocurrio un error inesperado', duration: 2000
    })
    );
  };
  savePayment(order) {
    const newPayment = {
      paymentDate: formatDate(new Date(), 'yyyy/MM/dd', 'es-HN'),
      orderId: order.orderId,
      paymentType: 'aliquot',
      paymentMethodId: this.paymentForm.controls.payment_method_id.value,
      paymentAmount: this.paymentForm.controls.payment_amount.value,
      paymentBankName: this.paymentForm.controls.payment_bank_name.value,
      paymentBankAccount: this.paymentForm.controls.payment_bank_account.value,
      paymentCardNumber: this.paymentForm.controls.payment_card_number.value,
      paymentCheckNumber: this.paymentForm.controls.payment_check_number.value,
      paymentTransactionNumber: this.paymentForm.controls.payment_transaction_number.value
    };

    this.paymentService.addPayment(newPayment).subscribe(
      async () => {
        if(this.fromBarn){
          this.updateStateBarn();
        }
        await this.toastController.create({ message: 'Reserva creadad exitosamente', duration: 3000 });
        this.router.navigate(['/share/catalog']);
      },
      error => console.log(error)
    );
  }
  updateStateBarn() {
    this.product.status = 'marketed';
    this.product.available_quantity = this.product.estimated_production;
    this.barnService.updateStateBarn(this.product, this.product.id).subscribe(response => {
      console.log(response);
    });
  }
  onPaymentTypeChanged(event: any) {
    this.selectedPaymentType = event.value;
    switch (this.selectedPaymentType) {
      case 1: // Efectivo
        this.paymentForm.controls.payment_amount.validator = Validators.required;
        this.paymentForm.controls.payment_bank_name.validator = null;
        this.paymentForm.controls.payment_bank_account.validator = null;
        this.paymentForm.controls.payment_card_number.validator = null;
        this.paymentForm.controls.payment_check_number.validator = null;
        this.paymentForm.controls.payment_transaction_number.validator = null;

        this.paymentForm.controls.payment_amount.enable();
        this.paymentForm.controls.payment_bank_name.disable();
        this.paymentForm.controls.payment_bank_account.disable();
        this.paymentForm.controls.payment_card_number.disable();
        this.paymentForm.controls.payment_check_number.disable();
        this.paymentForm.controls.payment_transaction_number.disable();
        break;

      case 2: // Transferencia
        this.paymentForm.controls.payment_amount.validator = Validators.required;
        this.paymentForm.controls.payment_bank_name.validator = Validators.required;
        this.paymentForm.controls.payment_bank_account.validator = Validators.required;
        this.paymentForm.controls.payment_card_number.validator = null;
        this.paymentForm.controls.payment_check_number.validator = null;
        this.paymentForm.controls.payment_transaction_number.validator = Validators.required;

        this.paymentForm.controls.payment_amount.enable();
        this.paymentForm.controls.payment_bank_name.enable();
        this.paymentForm.controls.payment_bank_account.enable();
        this.paymentForm.controls.payment_card_number.disable();
        this.paymentForm.controls.payment_check_number.disable();
        this.paymentForm.controls.payment_transaction_number.enable();
        break;

      case 3: // Cheque
        this.paymentForm.controls.payment_amount.validator = Validators.required;
        this.paymentForm.controls.payment_bank_name.validator = Validators.required;
        this.paymentForm.controls.payment_bank_account.validator = Validators.required;
        this.paymentForm.controls.payment_card_number.validator = null;
        this.paymentForm.controls.payment_check_number.validator = Validators.required;
        this.paymentForm.controls.payment_transaction_number.validator = null;

        this.paymentForm.controls.payment_amount.enable();
        this.paymentForm.controls.payment_bank_name.enable();
        this.paymentForm.controls.payment_bank_account.enable();
        this.paymentForm.controls.payment_card_number.disable();
        this.paymentForm.controls.payment_check_number.enable();
        this.paymentForm.controls.payment_transaction_number.disable();
        break;

      case 4: // Tarjeta de Credito
        this.paymentForm.controls.payment_amount.validator = Validators.required;
        this.paymentForm.controls.payment_bank_name.validator = null;
        this.paymentForm.controls.payment_bank_account.validator = null;
        this.paymentForm.controls.payment_card_number.validator = Validators.required;
        this.paymentForm.controls.payment_check_number.validator = null;
        this.paymentForm.controls.payment_transaction_number.validator = Validators.required;

        this.paymentForm.controls.payment_amount.enable();
        this.paymentForm.controls.payment_bank_name.disable();
        this.paymentForm.controls.payment_bank_account.disable();
        this.paymentForm.controls.payment_card_number.enable();
        this.paymentForm.controls.payment_check_number.disable();
        this.paymentForm.controls.payment_transaction_number.enable();
        break;

      default:
        this.paymentForm.controls.payment_amount.validator = null;
        this.paymentForm.controls.payment_bank_name.validator = null;
        this.paymentForm.controls.payment_bank_account.validator = null;
        this.paymentForm.controls.payment_card_number.validator = null;
        this.paymentForm.controls.payment_check_number.validator = null;
        this.paymentForm.controls.payment_transaction_number.validator = null;

        this.paymentForm.controls.payment_amount.disable();
        this.paymentForm.controls.payment_bank_name.disable();
        this.paymentForm.controls.payment_bank_account.disable();
        this.paymentForm.controls.payment_card_number.disable();
        this.paymentForm.controls.payment_check_number.disable();
        this.paymentForm.controls.payment_transaction_number.disable();
        break;
    }
  }

}
