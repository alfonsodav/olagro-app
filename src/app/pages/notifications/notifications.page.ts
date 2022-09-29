import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@app/@core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  dataSource = [];
  constructor(private notifications: NotificationsService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(): void {
    this.notifications.getNotifications().subscribe(res => {
      this.dataSource = res;
    });
  }

  defineCase(row) {
    let asunto = '';
    if (row.user_id) {
      asunto = 'Usuario';
    }
    if (row.barn_id) {
      asunto = 'Granero';
    }
    if (row.orderId) {
      asunto = 'Orden de compra';
    }
    return asunto;
  }
  onView(notification) {
    notification.status = 0;
    this.notifications.updateNotification(notification.id, notification).subscribe(data => {
      console.log(data);
    });
  }

}
