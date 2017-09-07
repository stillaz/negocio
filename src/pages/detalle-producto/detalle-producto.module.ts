import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleProductoPage } from './detalle-producto';

@NgModule({
  declarations: [
    DetalleProductoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleProductoPage),
  ],
  exports: [
    DetalleProductoPage
  ]
})
export class DetalleProductoPageModule {}
