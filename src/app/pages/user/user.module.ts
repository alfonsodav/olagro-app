import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UserPageRoutingModule} from './user-routing.module';

import {UserPage} from './user.page';
import {ShareModule} from '@app/pages/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserPageRoutingModule,
    ShareModule
  ],
  declarations: [UserPage]
})
export class UserPageModule {
}
