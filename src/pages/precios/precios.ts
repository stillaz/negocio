import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController} from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the PreciosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-precios',
  templateUrl: 'precios.html',
})
export class PreciosPage {

  busqueda: string = '';
  productos: any;
  selectedAll = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public producto: ProductoProvider, public modalCtrl: ModalController) {
    //this.productos = producto.getProductos();
  }

  productosFiltrados(){
    this.producto.getProductosFiltrado(this.busqueda).then(productos => this.productos = productos);
  }

  filtrosGrupos(){
    let grupos: any = [];
    grupos[0] = { text: 'Todos los grupos', handler: () => {
                    //this.productos = this.producto.getProductos();
                  }};

    this.producto.getGrupos().forEach((grupo, i) => {
      grupos[i + 1] = { text: grupo, handler: () => {
           //this.productos = this.producto.getProductos().filter(producto => producto.grupo.toLowerCase().indexOf(grupo.toLowerCase()) > -1);
          }
        }
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Grupos',
      buttons: grupos
    });
    actionSheet.present();
  }

  filtrosMarcas(){
    let marcas: any = [];

    marcas[0] = { text: 'Todas las marcas', handler: () => {
                    //this.productos = this.producto.getProductos();
                  }
                };

    for(let i = 1; i < 11; i++){
      let marca = 'Marca ' + i;
      marcas[i] = { text: marca, handler: () => {
            //this.productos = this.producto.getProductos().filter(producto => producto.marca.toLowerCase().indexOf(marca.toLowerCase()) > -1);
          }
        }
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Marcas',
      buttons: marcas
    });
    actionSheet.present();
  }

  irPrecio(producto){
    let vistaDetalle = this.modalCtrl.create('DetallePrecioPage', producto);
    vistaDetalle.present();
  }

  ver(producto){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
    vistaDetalle.present();
  }

  checkAll(){
    this.selectedAll = true;
  }

  descheckAll(){
    this.selectedAll = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreciosPage');
  }

}
