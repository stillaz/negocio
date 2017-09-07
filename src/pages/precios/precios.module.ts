import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreciosPage } from './precios';

@NgModule({
  declarations: [
    PreciosPage,
  ],
  imports: [
    IonicPageModule.forChild(PreciosPage),
  ],
  exports: [
    PreciosPage
  ]
})
export class PreciosPageModule {}
