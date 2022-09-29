/* eslint-disable @typescript-eslint/naming-convention */
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '@core/services/product.service';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { Storage } from '@capacitor/storage';
import {AlertController} from '@ionic/angular';
import { AuthService } from '@app/@core/services/auth.service';
import { formatDate } from '@angular/common';


class NumberValidator {
  static validGreaterThanZero(fc: FormControl) {
    if (fc.value === 0 || fc.value === '0') {
      return ({validGreaterThanZero: true});
    } else {
      return null;
    }
  }
}

export class Product {
  constructor(
    public product_code: number,
    public product_name: string,
    public product_type_code: number,
    public product_type_name: string,
    public product_image: string,
    public product_status: string,
    public product_date_created: any,
    public product_date_updated: any,
    public resourceFile?: any,
  ) {
  }
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix

export class DetailComponent implements OnInit {
  user: any;
  id;
  selectedFile: any = null;
  productClasses: any[]= [];
  productTypes: any[]= [];
  productList: any[]= [];
  selectedQualityDescription = '';
  newProduct = false;
  selectedProductType = 0;
  productLote: any;
  productQualities: any[]= [];
  productMassMeasurements: any[]= [];
  purchaseTypes: any[]= [];
  sellers: any[]= [];
  selectedSeller = 0;
  minDate = new Date();
  onlyUser = false;
  saving = false;
  errorMessage = '';
  productLotForm = new FormGroup({
    productLotSellerId: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productId: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productMassMeasurementId: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productQualityId: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productLotQuantity: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'), NumberValidator.validGreaterThanZero]),
    productLotAvailableDate: new FormControl(
      {value: '', disabled: false},
      [Validators.required]),
    productLotCultivatedArea: new FormControl(
      {value: 0, disabled: false},
      [Validators.required]),
    productLotCultivatedAreaAddress: new FormControl(
      {value: '', disabled: false},
      [Validators.required]),
    productLotCultivatedAreaPerformance: new FormControl(
      {value: '', disabled: false},
      [Validators.required]),
    productLotProductionMode: new FormControl(
      {value: '', disabled: false},
      [Validators.required]),
    productLotSaleType: new FormControl(
      {value: 0, disabled: false},
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productLotSalePrice: new FormControl(
      {value: 0.00, disabled: false},
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'), NumberValidator.validGreaterThanZero]),
    productLotPickupAddress: new FormControl(
      {value: '', disabled: false},
      [Validators.required])
  });

  productForm = new FormGroup({
    product_name: new FormControl(
      {value: '', disabled: false},
      [Validators.required, Validators.maxLength(100)]),
    product_image: new FormControl(
      {value: '', disabled: true},
      [Validators.required, Validators.maxLength(1000)]),
    product_type_code: new FormControl(
      {value: 0, disabled: false},
      [Validators.required]),
    resourceMedia: new FormControl(
      {value: '', disabled: false})
  });


  constructor(private activate: ActivatedRoute, private auth: AuthService,
              private router: Router, private  productLot: ProductService, private alertIo: AlertController) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(data => this.user = data);

    this.getProductTypes();
    this.activate.queryParams.subscribe(data => {
      this.newProduct = data.newProduct === 'true';
      this.id = isNaN(Number(data.newProduct)) ? false: Number(data.newProduct);
    });
    if (!this.newProduct && this.id) {
      this.preLoad().then(() => this.getProductById(this.id));
    } else {
      this.preLoad();
    }
  }
  async preLoad(){
    this.getProducts();
    this.getProductMassMeasurements();
    this.getProductQualities();
    this.getPurchaseTypes();
  }
  async myAlert(text){
    const alerta = await this.alertIo.create({message: text});
    return await alerta.present();
  }

  getProductById(id) {
    this.productLot.getProductLot(id).subscribe(data => {
      console.log(data.data);
      this.productLotForm.controls.productLotSellerId.setValue(data.data.productLotSellerId);
      this.productLotForm.controls.productId.setValue(data.data.productId);
      this.productLotForm.controls.productMassMeasurementId.setValue(data.data.productMassMeasurementId);
      this.productLotForm.controls.productQualityId.setValue(data.data.productQualityId);
      this.productLotForm.controls.productLotQuantity.setValue(data.data.productLotQuantity);
      this.productLotForm.controls.productLotAvailableDate.setValue(data.data.productLotAvailableDate);
      this.productLotForm.controls.productLotCultivatedArea.setValue(data.data.productLotCultivatedArea);
      this.productLotForm.controls.productLotCultivatedAreaAddress.setValue(data.data.productLotCultivatedAreaAddress);
      this.productLotForm.controls.productLotCultivatedAreaPerformance.setValue(data.data.productLotCultivatedAreaPerformance);
      this.productLotForm.controls.productLotProductionMode.setValue(data.data.productLotProductionMode);
      this.productLotForm.controls.productLotSaleType.setValue(data.data.productLotSaleType);
      this.productLotForm.controls.productLotSalePrice.setValue(data.data.productLotSalePrice);
      this.productLotForm.controls.productLotPickupAddress.setValue(data.data.productLotPickupAddress);
    });
  }

  getProductTypes(): void {
    this.productLot.getProductTypes('').subscribe(
      response => this.productTypes = response.data
    );
  }

  getProducts(): void {
    this.productLot.getProducts('').subscribe(
      response => this.productList = response.data
    );
  }

  getProductQualities(): void {
    this.selectedQualityDescription = '';
    const queryParams = `?type=${this.selectedProductType}`;
    this.productLot.getProductQualities(queryParams).subscribe(
      response => {
      this.productQualities = response.data;
    }
    );
  }

  onProductSelected(event: any) {
    const selectedProductId = event.value;
    // @ts-ignore
    const selectedProduct = this.productList.find(x => x.product_code === selectedProductId);
    // @ts-ignore
    this.selectedProductType = selectedProduct.product_type_code;
    this.getProductQualities();
  }

  onQualitySelected(event: any) {
    const selectedQualityId = event.value;
    // @ts-ignore
    const selectedQuality = this.productQualities.find(x => x.product_quality_code === selectedQualityId);
    // @ts-ignore
    this.selectedQualityDescription = selectedQuality.product_quality_description;
  }

  verifyDates(): ValidatorFn {
    return (): ValidationErrors => {
      this.productLotForm.controls.productLotAvailableDate.setErrors(null);

      if (!this.isValidDate(new Date(this.productLotForm.controls.productLotAvailableDate.value))) {
        this.productLotForm.controls.productLotAvailableDate.setErrors({invalidDate: true});
        return;
      }

      const minDate1 = this.minDate.getTime();
      let date1: any;
      date1 = new Date(this.productLotForm.controls.productLotAvailableDate.value);
      date1 = date1.getTime();

      if (date1 < minDate1) {
        this.productLotForm.controls.productLotAvailableDate.setErrors({minDate: true});
        return;
      }

      return;
    };
  }

  isValidDate(date) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }

  getProductMassMeasurements(): void {
    this.productLot.getProductMassMeasurements('').subscribe(
      response => this.productMassMeasurements = response.data
    );
  }

  async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      quality: 80,
    });

    return capturedPhoto.base64String;
  }

  async takeProductPhoto(event) {
    this.selectedFile = event.target.files[0];
    this.productForm.controls.product_image.setValue(this.selectedFile.name);
    /* const productPhoto = await this.addNewToGallery();
     this.productForm.controls.product_image.setValue('data:image/png;base64,' + productPhoto);
    */
  }

  onSave() {
    const imagen = this.productForm.get('product_image').value;
    if (!imagen.trim() && imagen.length === 0) {
      this.myAlert('La imagen del producto no ha sido seleccionada.');
      return null;
    }
    this.save();
  }
  save() {
    const newProduct: any = {};
    newProduct.product_name = this.productForm.controls.product_name.value;
    newProduct.product_type_code = this.productForm.controls.product_type_code.value;
    newProduct.product_image = this.productForm.controls.product_image.value;
    newProduct.resourceFile = this.selectedFile;

    this.productLot.addProduct(newProduct).subscribe(
      response => {
        this.myAlert('Producto creado exitosamente!.');
        this.router.navigate(['/add-lot']);
      },
      error => {
        this.myAlert('Ocurrio un error inesperado');
      }
    );
  }

  saveLot() {
    const newproductLot = {
      productLotSellerId: this.productLotForm.controls.productLotSellerId.value,
      productId: this.productLotForm.controls.productId.value,
      productMassMeasurementId: this.productLotForm.controls.productMassMeasurementId.value,
      productQualityId: this.productLotForm.controls.productQualityId.value,
      productLotQuantity: this.productLotForm.controls.productLotQuantity.value,
      productLotAvailableDate: formatDate(this.productLotForm.controls.productLotAvailableDate.value, 'yyyy/MM/dd', 'es-HN'),
      productLotCultivatedArea: this.productLotForm.controls.productLotCultivatedArea.value,
      productLotCultivatedAreaAddress: this.productLotForm.controls.productLotCultivatedAreaAddress.value,
      productLotCultivatedAreaPerformance: this.productLotForm.controls.productLotCultivatedAreaPerformance.value,
      productLotProductionMode: this.productLotForm.controls.productLotProductionMode.value,
      productLotSaleType: this.productLotForm.controls.productLotSaleType.value,
      productLotSalePrice: this.productLotForm.controls.productLotSalePrice.value,
      productLotPickupAddress: this.productLotForm.controls.productLotPickupAddress.value
    };
    if (this.id){
      this.productLot.updateProductLot(newproductLot, this.id).subscribe(response => {
        this.myAlert('Lote actualizado');
      }, error => {
        this.myAlert('Ocurrio un error inesperado');
        console.log(error);
      });
    } else{
      this.productLot.addProductLot(newproductLot).subscribe(
        response => {
          this.myAlert('Lote de producto registrado');
        }, error => {
          this.myAlert('Ocurrio un error inesperado');
          console.log(error);
        });
    }

  }

  getPurchaseTypes(): void {
    this.productLot.getPurchaseTypes().subscribe(
      response => this.purchaseTypes = response.data);
  }
}


