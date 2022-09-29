import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  data = [];
  date: Date;
  apiUrl = this.auth.apiUrl;
  notiUrl = `${this.apiUrl}/notificacion`;
  headers = this.auth.headers;
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router
  ) {}

  getNotifications(): Observable<any> {
    return this.http.get<any>(this.notiUrl, { headers: this.headers });
  }

  updateNotification(id, noti) {
    return this.http.put(this.notiUrl + '/' + id, noti, {
      headers: this.headers,
    });
  }
  async launcherAlert() {
    const oldDate = this.date.getTime();
    const notiDate = new Date(this.data[0].created_at).getTime();
    if (oldDate > notiDate) {
      const snack = await this.alertController.create({
        message: 'Tiene Notificaciones Nuevas',
        buttons: [
          {
            text: 'Ver',
            handler: () => this.router.navigate(['/notificaciones']),
          },
        ],
      });
    }
  }
}
