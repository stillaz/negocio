import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevolucionesPage } from './devoluciones';

@NgModule({
  declarations: [
    DevolucionesPage,
  ],
  imports: [
    IonicPageModule.forChild(DevolucionesPage),
  ],
  exports: [
    DevolucionesPage
  ]
})
export class DevolucionesPageModule {}
