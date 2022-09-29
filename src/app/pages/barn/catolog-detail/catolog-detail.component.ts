import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarnService } from '@app/@core/services/barn.service';
import { ProductService } from '@app/@core/services/product.service';

@Component({
  selector: 'app-catolog-detail',
  templateUrl: './catolog-detail.component.html',
  styleUrls: ['./catolog-detail.component.scss'],
})
export class CatologDetailComponent implements OnInit {
  productLot = [];
  productLots = [];
  productTypes: any[];
  selectedProductLot: any;
  selectedProductType = '';
  selectedSeller = '0';
  totalAssigned = 0;
  sellers: any[];
  loading = false;
  mes = '';
  quincena = '';
  nMes = 0;

  constructor(
    private productService: ProductService,
    public barnService: BarnService,
    private activate: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.getProductTypes();
    let dateIni;
    let dateEnd;
    this.activate.queryParams.subscribe(fecha => {
      this.mes = fecha.mes;
      this.quincena = fecha.quincena;
      this.nMes = Number(fecha.Nmes);
      let days = 1;
      if (this.quincena === '2') {
        days = 15;
      }
      const date = new Date();
      let year = date.getFullYear();
      if (fecha.Nmes === '11' && date.getMonth() === 0) {
        year = year - 1;
      }
      dateIni = new Date(year, fecha.Nmes, days).toISOString();
      dateEnd = new Date(date.getFullYear(), fecha.Nmes, days + 15).toISOString();
    });
    this.getProductsBarn(dateIni, dateEnd);
  }

  getProductTypes(): void {
    this.productService.getProductTypes('').subscribe(
      response => {
        this.productTypes = response.data;
      },
      error => console.log(error)
    );
  }

  getProductsBarn(fechaIni, fechaFin): void {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const queryParams = `?fecha_ini=${fechaIni}&fecha_fin=${fechaFin}`;
    this.barnService.getBarns(queryParams).subscribe(
      response => {
        this.productLots.push(...response.reverse());
      },
      error => console.log(error)
    );
  }
  bookingBarn(id): void {
    this.router.navigate(['/product/bookings', id], { queryParams: { barn: 'true' } });
  }
}
