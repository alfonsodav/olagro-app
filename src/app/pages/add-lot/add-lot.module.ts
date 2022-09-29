import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddLotPageRoutingModule} from './add-lot-routing.module';

import {AddLotPage} from './add-lot.page';
import {ShareModule} from '@app/pages/share/share.module';
import {DetailComponent} from '@app/pages/add-lot/detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddLotPageRoutingModule,
    ShareModule
  ],
  declarations: [AddLotPage, DetailComponent]
})
export class AddLotPageModule {
}
