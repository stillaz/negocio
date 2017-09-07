import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AccesoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-acceso',
  templateUrl: 'acceso.html',
})
export class AccesoPage {

  user: string;
  pass: string;
  isLogged: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccesoPage');
  }

  Signup(){
    this.navCtrl.setRoot('GeneralTabsPage');
  }

}
