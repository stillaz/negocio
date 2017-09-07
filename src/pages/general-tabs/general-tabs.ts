import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the GeneralTabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-general-tabs',
  templateUrl: 'general-tabs.html'
})
@IonicPage()
export class GeneralTabsPage {

  productosRoot = 'ProductosPage'
  ventasRoot = 'VentasPage'
  usuariosRoot = 'UsuariosPage'
  proveedoresRoot = 'ProveedoresPage'


  constructor(public navCtrl: NavController) {}

}
