import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '@core/services/product.service';
import {IonInfiniteScroll} from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';



@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data = [];
  observable: Observable<any>;
  subject = new Subject();
  pageIndex = 0;
  searchKey = '';
  pageSize = 10;
  total;

  constructor(private  productLot: ProductService, private router: Router, private activate: ActivatedRoute) {
  }

  ngOnInit() {
    this.observable = this.subject.pipe(
      debounceTime(500),
      map(() => {
          this.getProduct();
        }
      )
    );
    this.observable.subscribe();
    this.activate.queryParamMap.subscribe((data) => {
      this.searchKey = data.get('key');
      this.searchKey = this.searchKey ? this.searchKey.trim() : '';
      this.getProduct();
    });
  }

  getProduct() {
    this.productLot.getProductLots(
      `?per_page=${this.pageSize}&page=${this.pageIndex + 1}&search=${this.searchKey}&salesType=1&status=1&published=1`).subscribe(data => {
      console.log(data);
      if (this.searchKey){
        this.data = data.data;
      } else if (this.pageIndex === 0) {
      this.data = [];
      this.data.push(...data.data);
      } else {
        this.data.push(...data.data);
      }
      this.total = data.meta.pagination.total;
    }, error => console.error(error), ()=> this.infiniteScroll.complete()
  );
  }

  changePage() {
    this.pageIndex += 1;
    if (this.data.length < this.total){
      this.getProduct();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }
  search(value){
    console.log(value);
    this.searchKey = value;
    this.subject.next();
  }
  showDetail(id){
    this.router.navigate(['product/buy',id]);
  }
}
