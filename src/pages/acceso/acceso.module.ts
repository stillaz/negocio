import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccesoPage } from './acceso';

@NgModule({
  declarations: [
    AccesoPage,
  ],
  imports: [
    IonicPageModule.forChild(AccesoPage),
  ],
  exports: [
    AccesoPage
  ]
})
export class AccesoPageModule {}
