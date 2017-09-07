import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DetallePrecioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-precio',
  templateUrl: 'detalle-precio.html',
})
export class DetallePrecioPage {

  producto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.producto = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallePrecioPage');
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

}
