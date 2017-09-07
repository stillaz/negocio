import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuProductosPage } from './menu-productos';

@NgModule({
  declarations: [
    MenuProductosPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuProductosPage),
  ],
  exports: [
    MenuProductosPage
  ]
})
export class MenuProductosPageModule {}
