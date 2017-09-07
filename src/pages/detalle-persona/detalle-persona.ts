import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Persona } from '../../providers/persona/persona-class'

/**
 * Generated class for the DetallePersonaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-persona',
  templateUrl: 'detalle-persona.html',
})
export class DetallePersonaPage {

  datosPersona: Persona;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController ) {
    this.datosPersona = navParams.data;
  }

  guardar(){
    this.viewCtrl.dismiss(this.datosPersona.idPersona);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallePersonaPage');
  }

}
