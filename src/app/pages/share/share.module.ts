import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShareRoutingModule } from './share-routing.module';
import {CatalogoComponent} from '@app/pages/share/catalogo/catalogo.component';
import {NewsComponent} from '@app/pages/share/news/news.component';
import {ProductComponent} from '@app/pages/share/product/product.component';
import {SideMenuComponent} from '@app/pages/share/side-menu/side-menu.component';
import {HeaderComponent} from '@app/pages/share/header/header.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [CatalogoComponent, NewsComponent, ProductComponent, SideMenuComponent, HeaderComponent],
    exports: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        ShareRoutingModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class ShareModule { }
