import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the ListaProductosAlertaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-productos-alerta',
  templateUrl: 'lista-productos-alerta.html',
})
export class ListaProductosAlertaPage {

  productosAlerta: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private productoService: ProductoProvider, public modalCtrl: ModalController) {
    this.productoService.getProductosAlerta().then(res => {
      this.productosAlerta = res;
    });
  }

  ver(producto){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
    vistaDetalle.present();
  }

}
