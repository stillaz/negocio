import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePrecioPage } from './detalle-precio';

@NgModule({
  declarations: [
    DetallePrecioPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePrecioPage),
  ],
  exports: [
    DetallePrecioPage
  ]
})
export class DetallePrecioPageModule {}
