import { Component, OnInit } from '@angular/core';
import { BarnService } from '@app/@core/services/barn.service';
import { ProductService } from '@app/@core/services/product.service';

@Component({
  selector: 'app-barn-list',
  templateUrl: './barn-list.component.html',
  styleUrls: ['./barn-list.component.scss'],
})
export class BarnListComponent implements OnInit {
  dataSource = [];
  productTypes = [];
  constructor(
    private productTypeService: ProductService,
    public barnListService: BarnService) { }

  ngOnInit() {
    this.getProductType();
    if (this.barnListService.onload) {
      this.getBarnList();
    }
  }
  getProductType() {
    this.productTypeService.getProductTypes('').subscribe(response => {
      this.productTypes = response.data;
    });
  }

  getBarnList(): void {
    this.barnListService.getBarns(`?status='verified'`).subscribe(res => {
      this.dataSource = res;
      this.proccesForMonth(res);
    });
  }
  proccesForMonth(data) {
    const date = new Date().getTime() - 2592000000; // fecha actual menos 30 dias en milisegundos
    data.forEach(lot => {
      if (new Date(lot.harvest_date).getTime() < date) {
        return;
      }
      const month = new Date(lot.harvest_date).getMonth();
      const day = new Date(lot.harvest_date).getDate() + 1;
      this.barnListService.calendar.forEach(mes => {
        const quincenaNumber = day < 16 ? 1 : 2;
        if (mes.numberMes === month && mes.quincena === quincenaNumber) {
          mes.data.push(lot);
          if (mes.productTypes.find(type => type.id === lot.productTypeId)) {
            mes.productTypes.forEach(
              type => {
                if (type.id === lot.productTypeId) {
                  type.total = type.total + (lot.estimated_production - lot.available_quantity);
                  type.averagePrice = (type.averagePrice + lot.price) / 2;
                }
              });
          } else {
            mes.productTypes.push({
              id: lot.productTypeId,
              name: lot.productType.productType,
              total: lot.estimated_production - lot.available_quantity,
              medida: lot.productMassMeasurement.productMassMeasurement,
              averagePrice: lot.price
            });
          }
        }
      });
    });
    // dar estilo de tabla normal
    // this.calendar.forEach(quincena => this.lotesByType(quincena));
  }
}
