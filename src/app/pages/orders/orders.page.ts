import {Component, OnInit} from '@angular/core';
import {OrdersService} from '@core/services/orders.service';
import {Router} from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AuthService } from '@app/@core/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  active = false;
  user: any= {};
  pageSize = 25;
  pageLength = 1;
  pageIndex = 0;
  orders;
  orderActive = [];
  selectedOrderStatus;
  data;
  constructor(private order: OrdersService, private router: Router, private auth: AuthService) {
    this.auth.user$.subscribe(data => this.user = data);
  }

  ngOnInit() {
    if ((this.user.roles[0].name === 'Comprador')) {
      /*this.selectedBuyer = this.user.id;
      this.disableBuyers = true;*/
    }
    if ((this.user.roles[0].name === 'Productor Individual' ||
      this.user.roles[0].name === 'Productor Grupal' ||
      this.user.roles[0].name === 'Productor Representante Grupo')) {
      /*  this.selectedSeller = this.user.id;
        this.disableSellers = true;*/
    }
    this.getOrders();
  }

  getOrders(): void {
    const queryParams = `?per_page=${this.pageSize}&page=${this.pageIndex + 1}`;
    this.order.getOrders(queryParams).subscribe(
      response => {
        console.log(response);
        this.orderActive = response.data.filter(order => order.orderStatus === 1);
        this.orders = response.data;
        this.pageLength = 1;
        if (response.meta) {
          if (response.meta.pagination) {
            this.pageLength = response.meta.pagination.total;
            this.pageIndex = response.meta.pagination.current_page - 1;
          }
        }
        this.data = this.orders;
      },
      error => console.log(error)
    );
  }
  selectOrder(id){
    this.router.navigate(['orders/detail', id]);
  }
  segmentChanged() {
    this.active = !this.active;
  }
}
