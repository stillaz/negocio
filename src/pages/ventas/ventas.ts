import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Venta } from '../../providers/venta/venta-class';
import { VentaProvider } from '../../providers/venta/venta';

/**
 * Generated class for the VentasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ventas',
  templateUrl: 'ventas.html',
})
export class VentasPage {

  venta: Array<Venta>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ventas: VentaProvider) {
    this.venta = ventas.getVentas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
  }

  nuevo(){
    this.navCtrl.push('DetalleVentaPage', new Venta(null, null, null, null, null));
  }

}
