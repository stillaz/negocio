import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Persona } from '../../providers/persona/persona-class';

/**
 * Generated class for the DetalleUsuarioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-usuario',
  templateUrl: 'detalle-usuario.html',
})
export class DetalleUsuarioPage {

  datosUsuario: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.datosUsuario = this.navParams.data;
  }

  ionViewDidLoad() {
    this.ver();
  }

  ver(){
    let vistaDetalle = this.modalCtrl.create('DetallePersonaPage',{ persona: new Persona(null, null, null, null)});
    vistaDetalle.onDidDismiss(data => {
      this.datosUsuario.idpersona = data;
    });
    vistaDetalle.present();
  }
}
