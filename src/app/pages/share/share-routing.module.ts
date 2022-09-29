import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogoComponent} from '@app/pages/share/catalogo/catalogo.component';
import {ProductComponent} from '@app/pages/share/product/product.component';
import {NewsComponent} from '@app/pages/share/news/news.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogoComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent
  },
  {
    path: 'new/:id',
    component: NewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule { }
