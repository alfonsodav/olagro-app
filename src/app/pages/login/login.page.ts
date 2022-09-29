import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';
import {User} from '@core/models/user';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  urlRetorno: string;
  datos: any;
  private executingLogin: boolean;
  private errorMessage: any;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async help()  {
    const alert = await this.authService.alertController.create({
      message: '¿Está marcando al número?',
      buttons: ['Continuar', 'Cancelar']});
    await alert.present();
  }

  onSubmit(){
    const {phone, password} = this.loginForm.value;
    this.authService.login(phone, password).subscribe((data: any) => {
      Storage.set({key:'token', value: data.token_type + ' ' + data.access_token});
      this.authService.token$.next(data.token_type + ' ' + data.access_token);
      Storage.set({ key: 'dateTime', value: data.expires_at });
      this.getUserInfo();
      this.authService.checkToken();
    });
  }
  async getUserInfo() {
    (await this.authService.inicial()).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  protected handleResponse(response: any) {
    this.datos = response;
    Storage.set({key:'user', value: JSON.stringify(response)});
    if (this.datos.passwordAttempt === true) {
      console.log('sin credencial');
    }

    const myUser: User = this.datos;
    if (myUser.roles[0].name === 'Administrador Sistema' ||
      myUser.roles[0].name === 'Administrador Mantenimiento' ||
      myUser.roles[0].name === 'Promotor' ||
      myUser.roles[0].name === 'Verificador') {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const minDate1 = todayDate.getTime();

      const endDate = new Date(myUser.endsDate);
      endDate.setHours(0, 0, 0, 0);
      const minDate2 = endDate.getTime();

      if (minDate1 > minDate2) {
        this.handleDoLoginError('El contrato ya finalizó. No puede ingresar a la plataforma.');
        return;
      }
    }
    this.authService.loginStatus = true;
    this.router.navigate(['welcome']);
  }

  protected handleError(error: any) {
    this.executingLogin = false;
    this.errorMessage = error;
  }

  protected handleDoLoginError(error: any) {
    this.executingLogin = false;
    console.log(error);
    // this.errorMessage = 'Datos Incorrectos';
    this.errorMessage = error;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


}
