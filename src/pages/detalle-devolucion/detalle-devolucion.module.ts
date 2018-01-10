import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleDevolucionPage } from './detalle-devolucion';

@NgModule({
  declarations: [
    DetalleDevolucionPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleDevolucionPage),
  ],
  exports: [
    DetalleDevolucionPage
  ]
})
export class DetalleDevolucionPageModule {}
