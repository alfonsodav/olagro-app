/* eslint-disable @typescript-eslint/naming-convention */
import { formatDate } from '@angular/common';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '@app/@core/services/auth.service';
import { ProductService } from '@app/@core/services/product.service';
import { Storage } from '@capacitor/storage';
import { ModalController, ToastController } from '@ionic/angular';



export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-product-lot-publish-dialog',
  templateUrl: './product-lot-publish-dialog.component.html',
  styleUrls: ['./product-lot-publish-dialog.component.scss'],
})
export class ProductLotPublishDialogComponent implements OnInit {
  @Input() id: '';
  loading = false;
  saving = false;
  errorMessage = '';
  Date = new Date();
  maximo = new Date().getFullYear();
  minDate = this.Date.toISOString();

  productLotForm = new FormGroup({
    endDate: new FormControl(
      { value: '', disabled: false }, [Validators.required])
  });

  constructor(
    private productLotService: ProductService,
    public modalController: ModalController,
    private toastControl: ToastController,
    private auth: AuthService
  ) { }

  ngOnInit() {
   // this.setDateControls();
   this.maximo = this.Date.getFullYear() + 1;
  }

  onSavePublishDate(): void {
    this.saving = true;
    let user;
    this.auth.user$.subscribe(data => user = data);
    const productLot = {
      productLotId: this.id,
      productLotSaleType: 1,
      productLotExpirationDate: formatDate(new Date(this.productLotForm.controls.endDate.value), 'yyyy/MM/dd', 'es-HN'),
      user_id: user.id
    };
    this.productLotService.publishProductLot(productLot).subscribe(
      response => this.handlePublishResponse(response),
      error => this.handleError(error)
    );
  }
  async handlePublishResponse(response: any) {
    this.saving = false;
    const snack = await this.toastControl.create({ message: 'Lote de producto publicado', duration: 500 });
    snack.present().then(() => {
      this.modalController.dismiss({
        dismissed: true
      });
    });
  }

  handleError(error: any) {
    this.saving = false;
    this.errorMessage = error;
  }

  onCancelClick(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }


  onErrorClear() {
    this.errorMessage = '';
  }

  setDateControls() {
    this.Date.setHours(0, 0, 0, 0);
    this.productLotForm.setValidators(this.verifyDates());
    this.productLotForm.updateValueAndValidity();
  }

  verifyDates(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      this.productLotForm.controls.endDate.setErrors(null);

      if (!this.isValidDate(this.productLotForm.controls.endDate.value)) {
        this.productLotForm.controls.endDate.setErrors({ invalidDate: true });
        return;
      }

      const minDate1 = this.Date.getTime();
      let date1: any;
      date1 = new Date(this.productLotForm.controls.endDate.value);
      date1 = date1.getTime();
      if (date1 < minDate1) {
        this.productLotForm.controls.endDate.setErrors({ minDate: true });
        return;
      }

      return;
    };
  }

  isValidDate(date) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }
}
