import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AuthService } from '@app/@core/services/auth.service';

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.page.html',
  styleUrls: ['./add-lot.page.scss'],
})
export class AddLotPage implements OnInit {
  data = [];
  pageIndex = 0;
  searchKey = '';
  pageSize = 10;
  selectedSeller = '0';
  total;
  productTypes = [];

  constructor(private productLot: ProductService, private router: Router, private auth: AuthService) {}

  ngOnInit() {
    let user: any = {};
    this.auth.user$.subscribe(data => user = data);
    this.selectedSeller = user.id.toString();
    this.getProductTypes();
  }
  getProductTypes(): void {
    this.productLot.getProductTypes('').subscribe((response) => {
      this.productTypes = response.data;
      this.getProduct();
    });
  }

  getProduct() {
    this.productLot
      .getProductLots(
        `?per_page=${this.pageSize}&page=${this.pageIndex + 1}&search=${
          this.searchKey
        }&seller=${this.selectedSeller}`
      )
      .subscribe(
        (data) => {
          if (this.searchKey) {
            this.data = data.data.map((product) => {
              product.product_type_name = this.productTypes.find((type) => {
                if (type.id === product.productTypeId) {
                  return type.product_type_name;
                }
              });
            });
          } else {
            const products = data.data.map((product) => {
              const tipo = this.productTypes.find(
                (type) => type.product_type_code === Number(product.productTypeId)
              );
              product.product_type_name = tipo.product_type_name;
              return product;
            });
            this.data.push(...products);
          }
          // this.total = data.meta.pagination.total;
        },
        (error) => console.error(error)
      );
  }

  showDetail(nuevo?) {
    this.router.navigate(['add-lot/detail'], {
      queryParams: { newProduct: nuevo },
    });
  }
}
