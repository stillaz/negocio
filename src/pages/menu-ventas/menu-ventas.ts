import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

/**
 * Generated class for the MenuVentasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu-ventas',
  templateUrl: 'menu-ventas.html',
})
export class MenuVentasPage {

  pages: any[] = [
    { title: 'Pagos', component: 'PagosPage', icon: '' },
    { title: 'Devoluciones', component: 'DevolucionesPage', icon: '' },
    { title: 'Caja', component: 'CajaPage', icon: '' },
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
