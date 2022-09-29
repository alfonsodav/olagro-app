import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@app/@core/services/product.service';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProductLotPublishDialogComponent } from './product-lot-publish-dialog/product-lot-publish-dialog.component';

@Component({
  selector: 'app-lot-list',
  templateUrl: './lot-list.page.html',
  styleUrls: ['./lot-list.page.scss'],
})
export class LotListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data = [];
  observable: Observable<any>;
  subject = new Subject();
  pageIndex = 0;
  searchKey = '';
  pageSize = 10;
  selectedStatus = '1';
  total;

  constructor(
    public productLot: ProductService,
    public modalController: ModalController,
    private router: Router,
    private activate: ActivatedRoute
  ) {}

  ngOnInit() {
    this.observable = this.subject.pipe(
      debounceTime(500),
      map(() => {
        this.getProduct();
      })
    );
    this.observable.subscribe();
    this.activate.queryParamMap.subscribe((data) => {
      this.searchKey = data.get('key');
      this.searchKey = this.searchKey ? this.searchKey.trim() : '';
      this.getProduct();
    });
  }

  getProduct() {
    this.productLot
      .getProductLots(
        `?per_page=${this.pageSize}&page=${this.pageIndex + 1}&search=${
          this.searchKey
        }&status=${this.selectedStatus}`
      )
      .subscribe(
        (data) => {
          if (this.searchKey) {
            this.data = data.data;
          } else {
            this.data.push(...data.data);
          }
          this.total = data.meta.pagination.total;
        },
        (error) => console.error(error),
        () => this.infiniteScroll.complete()
      );
  }

  changePage() {
    this.pageIndex += 1;
    if (this.data.length < this.total) {
      this.getProduct();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }
  search(value) {
    this.searchKey = value;
    this.subject.next();
  }
  showDetail(id) {
    this.router.navigate(['product/buy', id]);
  }
  async publishModal(id) {
    const modal = await this.modalController.create({
      component: ProductLotPublishDialogComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id,
      },
    });
    return await modal.present();
  }
}
