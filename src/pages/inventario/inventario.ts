import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { InventarioProvider } from '../../providers/inventario/inventario';

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
  
  inventario: any = {};
  modo = 'uno';
  idproducto = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public producto: ProductoProvider, public alertCtrl: AlertController, public modalCtrl: ModalController, private inventarioCtrl: InventarioProvider, public toastCtrl: ToastController) {
  }

  seleccionar(crear: boolean){
    if(this.idproducto){
      this.producto.getProductoById(this.idproducto)
      .then(producto => {
        if(producto){
          this.inventario.idproducto = producto.idproducto;
          this.inventario.descripcion = producto.descripcion;
          this.inventario.marca = producto.marca;
          this.inventario.grupo = producto.grupo;
          this.inventario.precio = producto.precio;
          this.inventario.cantidad = producto.cantidad;
          this.inventario.imagen = producto.imagen;
          this.inventario.cantidadIngreso = 0;
          this.inventario.costo = 0;
        } else if(crear){
          this.crear();
        }
      })
    }
  }

  crear() {
    let alert = this.alertCtrl.create({
      title: 'Producto no existe',
      message: '¿Desea crear el producto con el código ' + this.inventario.idproducto + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.inventario = {};
          }
        },
        {
          text: 'Si',
          handler: () => {
            let vistaDetalle = this.modalCtrl.create('DetalleProductoPage');
            vistaDetalle.present();
            vistaDetalle.onDidDismiss(data => {
              this.seleccionar(false);
            });
          }
        }
      ]
    });
    alert.present();
  }

  guardar(){
    if(this.modo === 'uno') this.inventario.cantidadIngreso++;
    this.inventario.cantidad = Number(this.inventario.cantidad) + Number(this.inventario.cantidadIngreso);
    this.inventarioCtrl.create(this.inventario)
    .then(res => {
      let toast = this.toastCtrl.create({
        message: 'Se agregó el producto al inventario',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.modo = 'uno';
      this.inventario = {};
      this.idproducto = '';
    }).catch(err => {
      alert("Error agregando producto al inventario");
      this.inventario.cantidad =- this.inventario.cantidadIngreso;
    });
  }

}
