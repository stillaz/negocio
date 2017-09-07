import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';

/**
 * Generated class for the ProveedoresPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-proveedores',
  templateUrl: 'proveedores.html',
})
export class ProveedoresPage {

  proveedores: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, proveedor: ProveedorProvider) {
    this.proveedores = proveedor.getProveedores();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProveedoresPage');
  }

}
