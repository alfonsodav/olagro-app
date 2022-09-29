import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotListPageRoutingModule } from './lot-list-routing.module';

import { LotListPage } from './lot-list.page';
import { ShareModule } from '../share/share.module';
import { ProductLotPublishDialogComponent } from './product-lot-publish-dialog/product-lot-publish-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
    LotListPageRoutingModule
  ],
  declarations: [LotListPage, ProductLotPublishDialogComponent]
})
export class LotListPageModule {}
