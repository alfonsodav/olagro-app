import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConvertUnitsPageRoutingModule } from './convert-units-routing.module';

import { ConvertUnitsPage } from './convert-units.page';
import { ShareModule } from '../share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareModule,
    ConvertUnitsPageRoutingModule
  ],
  declarations: [ConvertUnitsPage]
})
export class ConvertUnitsPageModule {}
