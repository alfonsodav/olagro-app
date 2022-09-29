/* eslint-disable @typescript-eslint/naming-convention */
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { BarnService } from '@app/@core/services/barn.service';
import { ProductService } from '@app/@core/services/product.service';
import { Storage } from '@capacitor/storage';
import { AlertController } from '@ionic/angular';

export class NumberValidator {
  static validGreaterThanZero(fc: FormControl) {
    if (fc.value === 0 || fc.value === '0') {
      return ({ validGreaterThanZero: true });
    } else {
      return (null);
    }
  }
}

@Component({
  selector: 'app-barn-detail',
  templateUrl: './barn-detail.component.html',
  styleUrls: ['./barn-detail.component.scss'],
})
export class BarnDetailComponent implements OnInit {
  barn: any;
  productType = [];
  sellers = [];
  productTypes = [];
  productMassMeasurements = [];

  user: any;
  onlyUser = false;
  saving = false;
  errorMessage = '';
  selectedSeller = '0';
  selectedFile: File = null;
  selectedImage: File = null;
  minDate = new Date();

  barnStoreForm = new FormGroup({
    user_id: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productTypeId: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, NumberValidator.validGreaterThanZero]),
    productMassMeasurementId: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, NumberValidator.validGreaterThanZero]),
    estimated_production: new FormControl(
      { value: 0, disabled: false },
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'), NumberValidator.validGreaterThanZero]),
    harvest_date: new FormControl(
      { value: '', disabled: false },
      [Validators.required]),
    cultivated_area: new FormControl(
      { value: 0, disabled: false },
      [Validators.required]),
    cultivated_area_address: new FormControl(
      { value: '', disabled: false },
      [Validators.required]),
    production_mode: new FormControl(
      { value: '', disabled: false },
      [Validators.required]),
    price: new FormControl(
      { value: 0.00, disabled: false },
      [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'), NumberValidator.validGreaterThanZero]),
    status: new FormControl(
      { value: '' }
    ),
    total: new FormControl(
      { value: 0.00, disabled: true }
    )
  });


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barnService: BarnService,
    private productTypeService: ProductService,
    private userService: AuthService,
    private alertController: AlertController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getProductTypes();
    this.getSellers();
    this.getProductMassMeasurements();
    this.getUser();
  }
  getUser(): void {
    this.auth.user$.subscribe(data => this.user = data);
    if (this.user.roles[0].name === 'Productor Individual') {
      this.onlyUser = true;
    }
    if (this.user.roles[0].name === 'Productor Grupal') {
      this.onlyUser = true;
    }
    if (this.user.roles[0].name === 'Productor Representante Grupo') {
      this.onlyUser = true;
    }
    if (this.onlyUser) {
      this.selectedSeller = this.user.id.toString();
    }
  }
  getSellers(): void {
    this.userService.getSellers().subscribe(
      response => {
        this.sellers = response.data;
      });
  }

  getProductTypes(): void {
    this.productTypeService.getProductTypes('').subscribe(
      response => this.productTypes = response.data);
  }

  getProductMassMeasurements(): void {
    this.productTypeService.getProductMassMeasurements('').subscribe(
      response => {
        this.productMassMeasurements = response.data;
        this.getBarn();
      }
    );
  }

  setDateControls() {
    this.minDate.setHours(0, 0, 0, 0);
    this.barnStoreForm.setValidators(this.verifyDates());
    this.barnStoreForm.updateValueAndValidity();
  }

  verifyDates(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      this.barnStoreForm.controls.harvest_date.setErrors(null);

      if (!this.isValidDate(new Date(this.barnStoreForm.controls.harvest_date.value))) {
        this.barnStoreForm.controls.harvest_date.setErrors({ invalidDate: true });
        return;
      }

      const minDate1 = this.minDate.getTime();
      let date1: any;
      date1 = new Date(this.barnStoreForm.controls.harvest_date.value);
      date1 = date1.getTime();

      if (date1 < minDate1) {
        this.barnStoreForm.controls.harvest_date.setErrors({ minDate: true });
        return;
      }

      return;
    };
  }

  isValidDate(date) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }

  getBarn(): void {
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        const id = params.id;

        this.barnService.getBarn(id).subscribe(
          response => this.handleResponse(response.data),
          error => this.errorMessage = error
        );
      }
    });
  }

  handleResponse(response: any) {
    this.barn = response;
    this.minDate = new Date(this.barn.harvest_date + 'T00:00:00');
    this.barnStoreForm.controls.user_id.setValue(this.barn.user_id);
    this.barnStoreForm.controls.productTypeId.setValue(this.barn.productTypeId);
    this.barnStoreForm.controls.cultivated_area.setValue(this.barn.cultivated_area);
    this.barnStoreForm.controls.estimated_production.setValue(this.barn.estimated_production);
    this.barnStoreForm.controls.productMassMeasurementId.setValue(this.barn.productMassMeasurementId);
    this.barnStoreForm.controls.production_mode.setValue(this.barn.production_mode);
    this.barnStoreForm.controls.harvest_date.setValue(this.barn.harvest_date + 'T00:00:00');
    this.barnStoreForm.controls.price.setValue(this.barn.price);
    this.barnStoreForm.controls.cultivated_area_address.setValue(this.barn.cultivated_area_address);
    this.barnStoreForm.controls.status.setValue(this.barn.status);
  }


  onSave() {
    this.saving = true;
    if (this.barn) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    const newbarn = {
      user_id: this.barnStoreForm.controls.user_id.value,
      productTypeId: this.barnStoreForm.controls.productTypeId.value,
      cultivated_area: this.barnStoreForm.controls.cultivated_area.value,
      estimated_production: this.barnStoreForm.controls.estimated_production.value,
      productMassMeasurementId: this.barnStoreForm.controls.productMassMeasurementId.value,
      production_mode: this.barnStoreForm.controls.production_mode.value,
      harvest_date: formatDate(new Date(this.barnStoreForm.controls.harvest_date.value), 'yyyy/MM/dd', 'es-HN'),
      price: this.barnStoreForm.controls.price.value,
      cultivated_area_address: this.barnStoreForm.controls.cultivated_area_address.value,
      status: 'unverified',
      barnImageName: this.selectedImage ? this.selectedImage.name : '',
      barn_image: this.selectedImage  ? this.selectedImage : null,
      barn_file: this.selectedFile  ? this.selectedFile : null,
      barnFileName: this.selectedFile ? this.selectedFile.name : '',
    };
    const barn = new FormData();
    for (const key in newbarn) {
      if (Object.prototype.hasOwnProperty.call(newbarn, key)) {
        barn.append(key, newbarn[key]);
      }
    }

    this.barnService.addBarn(barn).subscribe(
      response => this.handleSaveUpdateResponse(response),
      error => this.errorMessage = error
    );
  }

  async handleSaveUpdateResponse(response: any) {
    this.saving = false;
    const alert = await this.alertController.create({
      header: this.barn ? 'Lote actualizado' : 'Lote registrado',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/barn']);

  }

  update() {
    this.barn.user_id = this.barnStoreForm.controls.user_id.value;
    this.barn.productTypeId = this.barnStoreForm.controls.productTypeId.value;
    this.barn.cultivated_area = String(this.barnStoreForm.controls.cultivated_area.value);
    this.barn.estimated_production = this.barnStoreForm.controls.estimated_production.value;
    this.barn.productMassMeasurementId = this.barnStoreForm.controls.productMassMeasurementId.value;
    this.barn.production_mode = this.barnStoreForm.controls.production_mode.value;
    this.barn.harvest_date = this.barnStoreForm.controls.harvest_date.value;
    this.barn.price = this.barnStoreForm.controls.price.value;
    this.barn.cultivated_area_address = this.barnStoreForm.controls.cultivated_area_address.value;
    this.barn.status = this.barnStoreForm.controls.status.value;
    this.barn.barnImageName = this.selectedImage ? this.selectedImage.name : '';
    this.barn.barn_image = this.selectedImage ? this.selectedImage : null;
    this.barn.barnFileName = this.selectedFile ? this.selectedFile.name : '';
    this.barn.barn_file = this.selectedFile ? this.selectedFile : null;
    const barn = new FormData();
    barn.append('_method', 'PUT');
    for (const key in this.barn) {
      if (Object.prototype.hasOwnProperty.call(this.barn, key)) {
        barn.append(key, this.barn[key]);
      }
    }

    this.barnService.updateBarn(barn, this.barn.id).subscribe(
      response => this.handleSaveUpdateResponse(response),
      error => this.errorMessage = error
    );
  }
  onlyVerifie() {
    if (!this.user) {
      return false;
    }
    if (!['Verificador', 'Administrador Sistema', 'Promotor', 'Gerente General'].includes(this.user.roles[0].name)) {
      return false;
    }
    return true;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
