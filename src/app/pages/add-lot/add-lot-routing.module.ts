import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddLotPage} from './add-lot.page';
import {LogedinGuard} from '@core/guard/logedin.guard';
import {DetailComponent} from '@app/pages/add-lot/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: AddLotPage,
    canActivate: [LogedinGuard]
  },
  {
    path: 'detail',
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLotPageRoutingModule {
}
