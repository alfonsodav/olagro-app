import { Component, OnInit } from '@angular/core';
import { Barn } from '@app/@core/models/barn';
import { AuthService } from '@app/@core/services/auth.service';
import { BarnService } from '@app/@core/services/barn.service';
import { ProductService } from '@app/@core/services/product.service';
import { Storage } from '@capacitor/storage';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-barn',
  templateUrl: './barn.page.html',
  styleUrls: ['./barn.page.scss'],
})
export class BarnPage implements OnInit {
  dataSource;
  dataBarn: any[] = [];
  productTypes = [];
  selectedProductType = '';
  pageSize = 25;
  pageLength = 1;
  pageIndex = 0;
  loading = false;
  loadingProductTypes = false;
  loadingProductClasses = false;
  searchKey = '';
  timer: any;
  user;
  constructor(
    private productTypeService: ProductService,
    private barnListService: BarnService,
    private alertController: AlertController,
    private auth: AuthService
  ) {
    this.auth.user$.subscribe(data => this.user = data);
   }

  ngOnInit() {
    this.getProductTypes();
    this.getBarnList();
  }

  getProductTypes(): void {
    this.loadingProductTypes = true;
    this.productTypeService.getProductTypes('').subscribe(
      response => response,
      error => error
    );
  }

  getBarnList(): void {
    this.barnListService.getBarns('').subscribe(res => {
      console.log(res);
      this.dataSource = res;
      this.dataBarn = res;
    });
  }

  onSeachClear() {
    this.searchKey = '';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.getBarnList(); }, 1500);
  }

  onProductTypeSelected(event: any) {
    this.selectedProductType = event.value;
    this.getBarnList();
  }

  applyFilter(event: Event) {
    this.searchKey = (event.target as HTMLInputElement).value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.getBarnList(); }, 1500);
  }

  onChangePage(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getBarnList();
  }

  async onDeleteBarn(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'alert-delete-class',
      header: '¿Desea eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar producto',
          handler: (event = true) => {
            this.barnListService.deleteBarn(id, 1).subscribe(
              response => {
                this.getBarnList();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
  noBuyers() {
    if (!this.user) {
      return false;
    }
    if (['Comprador'].includes(this.user.roles[0].name)) {
      return false;
    }
    return true;
  }
  translateStatus(status) {
    let result = '';
    switch (status) {
      case 'verified':
        result = 'Verificado';
        break;
      case 'unverified':
        result = 'No verificado';
        break;
      case 'marketed':
        result = 'Vendido';
        break;
      case 'retained':
        result = 'Retenido';
        break;
    }
    return result;
  }
}
