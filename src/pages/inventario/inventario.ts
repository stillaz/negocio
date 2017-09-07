import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { Inventario } from '../../providers/inventario/inventario-class';

/**
 * Generated class for the InventarioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inventario',
  templateUrl: 'inventario.html',
})
export class InventarioPage {

  producto: any;
  inventario: Inventario;
  modo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public productoProvider: ProductoProvider, public alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.modo = "uno";
    this.producto = {};
    this.inventario = new Inventario(null, null, null);
  }

  getProducto(crear){
    if(this.inventario.idproducto != null){
      this.producto = this.productoProvider.getProductoById(this.inventario.idproducto);
      if(crear && this.producto == null){
        this.confirmarCrearProducto({});
        this.producto = {};
      }
    }
  }

  confirmarCrearProducto(producto) {
    let alert = this.alertCtrl.create({
      title: 'Producto no existe',
      message: '¿Desea crear el producto con el código ' + producto.idproducto + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.inventario.idproducto = null;
          }
        },
        {
          text: 'Si',
          handler: () => {
            let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
            vistaDetalle.present();
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    this.getProducto(false);
  }

}
