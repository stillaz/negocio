import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Printer } from '@ionic-native/printer';
import { Venta } from '../../providers/venta/venta-class';
import { Persona } from '../../providers/persona/persona-class';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the DetalleVentaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-venta',
  templateUrl: 'detalle-venta.html',
})
export class DetalleVentaPage {

  busqueda: string = '';
  datosVenta: Venta;
  productos: any;
  productosCarrito: any[];
  carrito: any[] = [];
  totalVenta: number;
  fecha: String = new Date().toISOString();
  nroVenta: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public producto: ProductoProvider, public printer: Printer) {
    this.datosVenta = this.navParams.data;
    this.getProductos();
  }

  getProductos(){
    this.producto.getProductosGrupedColumnas(5).then((productos) =>{
      this.productos = productos;
    }).catch(err => alert(err));
  }

  ionViewDidLoad() {
    this.ver();
  }

  productosFiltrados(){
    if(this.busqueda){
      this.producto.getProductosFiltrado(this.busqueda).then((productos) =>{
        this.productos = productos;
      }).catch(err => alert(err));
    } else {
      this.getProductos();
    }
  }

  ver(){
    let vistaDetalle = this.modalCtrl.create('DetallePersonaPage',{ persona: new Persona(null, null, null, null),  });
    vistaDetalle.onDidDismiss(data => {
      this.datosVenta.idCliente = data;
    });
    vistaDetalle.present();
  }

  calcularTotal(){
    this.totalVenta = this.carrito.reduce((a, b) => {
      return a + b.total;
    }, 0); 
  }

  agregar(producto){
    let key = producto.idproducto;
    let productoCarrito = this.carrito.find(producto => producto.idproducto == key);
    if(productoCarrito === undefined){
      productoCarrito = {idproducto: producto.idproducto, producto: producto, cantidad: 0, total: 0};
      this.carrito.push(productoCarrito);
    } 

    this.carrito.forEach(item => {
      if(item.idproducto == key) {
        item.cantidad ++;
        item.total = item.cantidad * item.producto.precio;
      }
    });

    this.calcularTotal();
  }

  borrar(index){
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  print(){ 
    this.printer.isAvailable().then(function(){
      this.printer.print("https://www.techiediaries.com").then(function(){
          alert("printing done successfully !");
        },function(){
          alert("Error while printing !");
        });
    }, function(){
      alert('Error : printing is unavailable on your device ');
    });
  }

}
