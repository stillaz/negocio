import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController } from 'ionic-angular';

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

  pages: any[] = [
    { title: 'Inventario', component: 'InventarioPage', icon: 'alert' }
  ];

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuProductosPage');
  }

  openPage(page) {
    this.navCtrl.push(page.component);
    this.navCtrl.viewWillUnload.subscribe(() =>{
      this.viewCtrl.dismiss();
    });
  }

}
