import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuBusquedaPage } from './menu-busqueda';

@NgModule({
  declarations: [
    MenuBusquedaPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuBusquedaPage),
  ],
  exports: [
    MenuBusquedaPage
  ]
})
export class MenuBusquedaPageModule {}
