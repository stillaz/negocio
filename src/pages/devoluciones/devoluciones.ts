import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DevolucionProvider } from '../../providers/devolucion/devolucion';

/**
 * Generated class for the DevolucionesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-devoluciones',
  templateUrl: 'devoluciones.html',
})
export class DevolucionesPage {

  devoluciones;

  constructor(public navCtrl: NavController, public navParams: NavParams, private devolucion: DevolucionProvider) {
    this.getDevoluciones();
  }

  ionViewDidLoad() {
  }

  getDevoluciones(){
    let devoluciones = [];
    this.devolucion.getDevoluciones().then(devolucion => {
      devoluciones.push(devolucion);
    }).catch(err => alert("Error cargando devoluciones"));
    this.devoluciones = devoluciones;
  }

  nuevo(){
    this.navCtrl.push('DetalleDevolucionPage');
    this.navCtrl.viewWillUnload.subscribe(() => {
      this.getDevoluciones();
    });
  }

}
