import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaProductosAlertaPage } from './lista-productos-alerta';

@NgModule({
  declarations: [
    ListaProductosAlertaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaProductosAlertaPage),
  ],
  exports: [
    ListaProductosAlertaPage
  ]
})
export class ListaProductosAlertaPageModule {}
