/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { environment } from '@env/environment';
import { catchError, map, pluck, take, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@core/models/user';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  public user$ = new BehaviorSubject<any>(null);
  public token$ = new BehaviorSubject<any>(null);
  public headers: HttpHeaders = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Authorization: this.token$.value ?? '',
  });
  public rol = {};
  date: Date;
  loginStatus = false;
  constructor(
    public http: HttpClient,
    public router: Router,
    public alertController: AlertController
  ) {
    super();
    // this.headers =
    this.token();
    this.checkToken();
    }
  async getRol() {
    const obj = JSON.parse((await Storage.get({ key: 'user' })).value || '{}');
    this.rol = obj.roles;
  }

  login(phone, password) {
    return this.http
      .post(environment.endpoint + '/login', { phone, password })
      .pipe(map((datos: any) => {
        this.token$.next(datos.token_type + ' ' + datos.access_token);
        return datos;
      }));
  }

  token() {
    let token = '';
    return Storage.get({ key: 'token' }).then((data) => {
      token = data.value;
      if (token) {
        const tokenJson = token;
        const newLocal = 'token_type';
        const newLocal1 = 'access_token';
        let date;
        Storage.get({ key: 'dateTime' }).then((time) => (date = time.value));
        this.date = new Date(date);
        return tokenJson[newLocal] + ' ' + tokenJson[newLocal1];
      }
      return '';
    });
  }

  getCurrentHeader() {
    this.headers = this.headers.set('Authorization', this.token$.value);
  }

  async getCurrentUserId() {
    const user = JSON.parse((await Storage.get({ key: 'user' })).value);
    return user.id;
  }

  inicial() {
    this.getCurrentHeader();
    return this.http
      .get<any>(environment.endpoint + '/user', { headers: this.headers })
      .pipe(
        map((user) => {
          this.user$.next({ ...user, logedIn: true });
          this.rol = user.roles[1];
          return { ...user, logedIn: true };
        })
      );
  }

  configuraciones(id, phone, departmentId, municipalityId, address, lat, long) {
    return this.http
      .post(
        environment.endpoint + '/configuraciones/' + id,
        {
          phone,
          departmentId,
          municipalityId,
          address,
          lat,
          long,
        },
        { headers: this.headers }
      )
      .pipe(map((user) => user));
  }

  getAuthenticationDetails(): Observable<any> {
    const token = Storage.get({ key: 'token' }).then(
      async (data) => await data.value
    );

    if (!token) {
      this.user$.next({} as User);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return of(null);
    }

    return this.getUserByToken().pipe(
      tap((user: User) => {
        this.user$.next({ ...user, logedIn: true });
      })
    );
  }

  getUserByToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user`, this.authOptions).pipe(
      pluck('user'),
      take(1),
      catchError(() => of(null as User))
    );
  }

  async checkToken(): Promise<any> {
    let token: any = {};
    let user: any = null;
    token = (await Storage.get({ key: 'token' })).value;
    const date = (await Storage.get({ key: 'dateTime' })).value;
    this.date = new Date(date);
    user = JSON.parse((await Storage.get({ key: 'user' })).value);
    this.user$.next(user);
    if (user) {
      this.loginStatus =
        user.logedIn &&
        this.date.getTime() > new Date().getTime();
      this.token$.next(token);
      this.getCurrentHeader();
      return this.loginStatus;
    }
    this.loginStatus = false;
    return this.loginStatus;
  }

  public outlog() {
    this.user$.next(null);
    this.loginStatus = false;
    Storage.clear();
    this.router.navigate(['']);
  }
  getSellers(): Observable<any> {
    return this.http.get(environment.endpoint + '/sellers', {
      headers: this.headers,
    });
  }
}
