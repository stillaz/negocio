import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the ProductosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html'
})
export class ProductosPage {

  rootPage: 'ProductosPage';

  busqueda: string = '';
  productos: any;

  pages: any[] = [
    { title: 'Precios', component: 'PreciosPage', icon: 'pricetags' },
    { title: 'Inventario', component: 'InventarioPage', icon: 'shirt' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public producto: ProductoProvider, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.getProductos();
  }

  getProductos(){
    this.producto.getProductosGruopedGrupo().then((productos) =>{
      this.productos = productos;
    }).catch(err => alert(err));
  }

  agregar(){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage');
    vistaDetalle.present();
  }

  ver(producto){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
    vistaDetalle.present();
  }

  productosFiltrados(){
    if(this.busqueda){
      this.producto.getProductosFiltrado(this.busqueda).then((productos) =>{
        this.productos = productos;
      });
    } else {
      this.getProductos();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductosPage');
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

  menu(myEvent) {
    let popover = this.popoverCtrl.create('MenuProductosPage');
    popover.present({
      ev: myEvent
    });
  }

}
