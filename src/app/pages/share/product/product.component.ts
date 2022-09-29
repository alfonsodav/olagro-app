import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { OrdersService } from '@core/services/orders.service';
import { ShoppingCartService } from '@app/@core/services/shopping-cart.service';
import { AuthService } from '@app/@core/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: any;
  observable: Observable<any>;
  subject = new Subject();
  searchKey = '';
  messageError;

  constructor(
    private productService: ProductService,
    public router: Router,
    public shoppingService: ShoppingCartService,
    private activate: ActivatedRoute,
    public orderService: OrdersService,
    public auth: AuthService) {
  }

  ngOnInit() {
    this.observable = this.subject.pipe(
      debounceTime(1000),
      map(() => {
        this.router.navigate(['share/catalog'], { queryParams: { key: this.searchKey } });
      }
      )
    );
    this.observable.subscribe();
    this.getProduct();
  }

  getProduct() {
    const id = this.activate.snapshot.params.id;
    this.productService.getProductLot(id).subscribe(data => {
      this.product = data.data;
      console.log(this.product);
    });
  }

  search(value) {
    console.log(value);
    this.searchKey = value ? value.trim() : '';
    this.subject.next();
  }

  goLogin() {
    this.router.navigate(['']);
  }
}
