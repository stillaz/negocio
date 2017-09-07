import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProveedoresPage } from './proveedores';

@NgModule({
  declarations: [
    ProveedoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ProveedoresPage),
  ],
  exports: [
    ProveedoresPage
  ]
})
export class ProveedoresPageModule {}
