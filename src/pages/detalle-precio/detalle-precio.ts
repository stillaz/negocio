import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProductoPrecioProvider } from '../../providers/producto-precio/producto-precio';

/**
 * Generated class for the DetallePrecioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-precio',
  templateUrl: 'detalle-precio.html',
})
export class DetallePrecioPage {

  producto;
  modo = 'uno';
  minima;
  maxima;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private precio: ProductoPrecioProvider, private toastCtrl: ToastController) {
    this.producto = this.navParams.data;
    this.producto.precioanterior = this.producto.precio;
  }

  ionViewDidLoad() {
    let fechaactual = new Date(new Date().setHours(0, 0, 0, 0));
    this.minima = fechaactual.toISOString();
    this.maxima = new Date(this.maxima.setFullYear(fechaactual.getFullYear() + 1)).toISOString();
  }

  seleccionar(){
    this.producto.precio = this.producto.precioanterior;
    this.producto.descuento = 0;
    if(this.modo === 'dos'){
      this.producto.fechaFin = new Date().toISOString();
    }
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

  guardar(){
    if((this.producto.precio !== this.producto.precioanterior) || this.producto.descuento){
      this.precio.create(this.producto).then(res =>{
        let toast = this.toastCtrl.create({ 
          message: this.modo === 'uno' ? 'El precio del producto ha sido modificado' : 'El descuento ha sido aplicado',
          duration: 3000,
          position: 'top'
        });
        this.viewCtrl.dismiss(toast.present());
      }).catch(err => alert("Error al crear precio"));
    } else {
      this.viewCtrl.dismiss();
    }
  }

}
