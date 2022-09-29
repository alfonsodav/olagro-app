import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductLot } from '@app/@core/models/product-lot';
import { ProductService } from '@app/@core/services/product.service';

@Component({
  selector: 'app-shopping-cart-detail',
  templateUrl: './shopping-cart-detail.component.html',
  styleUrls: ['./shopping-cart-detail.component.scss'],
})
export class ShoppingCartDetailComponent implements OnInit {
  productLot: any;
  loading = false;

  constructor(
    private productLotsService: ProductService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.getProductLot();
  }

  getProductLot(): void {
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.loading = true;
        const id = +params.id;
        this.productLotsService.getProductLot(id).subscribe(
          response => this.handleResponse(response.data),
          error => this.handleError(error)
        );
      }
    });
  }

  protected handleResponse(response: ProductLot) {
    this.loading = false;
    this.productLot = response;
  }

  protected handleError(error: any) {
    this.loading = false;
    console.error(error);
  }
}
