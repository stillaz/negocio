import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuVentasPage } from './menu-ventas';

@NgModule({
  declarations: [
    MenuVentasPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuVentasPage),
  ],
  exports: [
    MenuVentasPage
  ]
})
export class MenuVentasPageModule {}
