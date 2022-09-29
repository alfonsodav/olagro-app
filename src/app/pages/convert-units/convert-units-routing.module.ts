import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvertUnitsPage } from './convert-units.page';

const routes: Routes = [
  {
    path: '',
    component: ConvertUnitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConvertUnitsPageRoutingModule {}
