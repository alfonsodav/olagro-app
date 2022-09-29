import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocaleService} from '@core/services/locale.service';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user: any = {};
  editGroup: FormGroup;
  /*editGroup = new FormGroup({
    phone: new FormControl(['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]),
    departmentId: new FormControl(['', [Validators.required]]),
    municipalityId:new FormControl(['', [Validators.required]]),
    address: new FormControl(['', [Validators.required]]),
    lat:new FormControl(['']),
    long: new FormControl([''])
    }
  );*/
  datos: any;
  loading = true;
  loadingDepartamentos = false;
  loadingMunicipios = false;
  mensaje: any;
  errores: any;
  public departamentos: any;
  public municipios: any[];

  constructor(private formbuilder: FormBuilder, private locale: LocaleService,
              private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.editGroup = this.formbuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      departmentId: ['', [Validators.required]],
      municipalityId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      lat: [''],
      long: ['']
    });
    this.getDepartamentos();
    this.getUserInfo();
  }


  async getUserInfo() {
    this.loading = true;
    (await this.auth.inicial()).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  getDepartamentos(): void {
    this.loadingDepartamentos = true;
    this.locale.getDepartament().subscribe(
      response => this.handleDepartamentosResponse(response),
      error => this.handleDepartamentosError(error)
    );
  }

  onDepartamentosChange(event: any) {
    const selectedDepartamentoId = event.target.value;
    this.locale.getMunicipe(selectedDepartamentoId).subscribe((datos: []) => {
      this.municipios = datos;
      if(!this.municipios.find(muni => muni.id === this.editGroup.controls.municipalityId.value)){
        this.editGroup.controls.municipalityId.reset();
      }
    });
  }

  getMunicipios(): void {
    this.loadingMunicipios = true;
    this.locale.getMunicipe(this.datos.departmentId).subscribe(
      response => this.handleMunicipiosResponse(response),
      error => this.handleMunicipiosError(error)
    );
  }

  validar() {
    this.auth.configuraciones(
      this.datos.id,
      this.editGroup.controls.phone.value,
      this.editGroup.controls.departmentId.value,
      this.editGroup.controls.municipalityId.value,
      this.editGroup.controls.address.value,
      this.editGroup.controls.lat.value,
      this.editGroup.controls.long.value
    ).subscribe(
      datos => {
        this.mensaje = datos;
        this.router.navigate(['home']);
      },
      error => {
        this.mensaje = error.error.message;
        this.errores = error.error.errors;
      });
    if (!this.editGroup.invalid) {
      return;
    }
  }
  backHome(){
    this.router.navigate(['home']);
  }

  protected handleDepartamentosResponse(response: any) {
    this.loadingDepartamentos = false;
    this.departamentos = response;
  }

  protected handleDepartamentosError(error) {
    this.loadingDepartamentos = false;
    console.error(error);
  }

  protected handleMunicipiosResponse(response: any) {
    this.loadingMunicipios = false;
    this.municipios = response;
    this.editGroup.get('municipalityId').setValue(this.datos.municipalityId);
  }

  protected handleMunicipiosError(error) {
    this.loadingMunicipios = false;
    console.error(error);
  }

  protected handleResponse(response: any) {
    this.loading = false;
    this.datos = response;
    console.log(this.datos);
    this.editGroup.get('phone').setValue(this.datos.phone);
    this.editGroup.get('departmentId').setValue(this.datos.departmentId);
    this.editGroup.get('address').setValue(this.datos.address);
    this.editGroup.get('lat').setValue(this.datos.lat);
    this.editGroup.get('long').setValue(this.datos.long);

    this.getMunicipios();
  }

  protected handleError(error: any) {
    this.loading = false;
    console.error(error);
  }

}
