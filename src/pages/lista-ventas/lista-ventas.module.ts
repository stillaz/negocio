import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaVentasPage } from './lista-ventas';

@NgModule({
  declarations: [
    ListaVentasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaVentasPage),
  ],
  exports: [
    ListaVentasPage
  ]
})
export class ListaVentasPageModule {}
