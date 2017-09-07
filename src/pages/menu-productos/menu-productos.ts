import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

/**
 * Generated class for the MenuProductosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu-productos',
  templateUrl: 'menu-productos.html',
})
export class MenuProductosPage {

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuProductosPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
