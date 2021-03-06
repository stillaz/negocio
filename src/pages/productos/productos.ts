import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ActionSheetController, Events } from 'ionic-angular';
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
  modo = 'dos';
  filtro: string;
  gruposeleccion: string;
  marcaseleccion: string;
  alerta: number;
  mostrarAlerta = true;

  pages: any[] = [
    { title: 'Productos en alerta', component: 'ListaProductosAlertaPage', icon: 'alert' },
    { title: 'Productos más vendidos', component: '', icon: 'trending-up' },
    { title: 'Productos menos vendidos', component: '', icon: 'trending-down' },
    { title: 'Histórico inventario', component: '', icon: 'list-box' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public producto: ProductoProvider, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController, public events: Events) {
  }

  getProductos() {
    this.producto.getProductosGruopedGrupo().then(productos => {
      this.productos = productos;
    }).catch(err => alert("Error al cargar datos"));

    this.producto.getProductosAlerta().then(res => {
      this.events.publish('productos:alerta');
      this.alerta = res.length;
      this.pages[0].badge = this.alerta;
      if (this.mostrarAlerta && this.alerta > 0) {
        alert("Tienes productos en alerta en el inventario");
        this.mostrarAlerta = false;
      }
    });
  }

  agregar() {
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage');
    vistaDetalle.present();
    vistaDetalle.onDidDismiss(data => {
      this.filtrar();
    });
  }

  ver(producto) {
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
    vistaDetalle.present();
    vistaDetalle.onDidDismiss(data => {
      this.filtrar();
    });
  }

  filtrar() {
    if (this.busqueda) {
      this.producto.getProductosFiltrado(this.busqueda, 'descripcion').then((productos) => {
        this.productos = productos;
      });
    } else {
      this.getProductos();
    }
  }

  ionViewWillEnter() {
    this.getProductos();
    this.gruposeleccion = 'Todos los grupos';
    this.marcaseleccion = 'Todas las marcas';
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

  menu(myEvent) {
    let popover = this.popoverCtrl.create('MenuProductosPage');
    popover.onDidDismiss(data => {
      this.getProductos();
    });
    popover.present({
      ev: myEvent
    });
  }

  precio(producto) {
    let vistaDetalle = this.modalCtrl.create('DetallePrecioPage', producto);
    vistaDetalle.present();
  }

  filtrosGrupos() {
    let filtros: any = [];
    filtros.push({
      text: 'Todos los grupos', handler: () => {
        this.getProductos();
        this.filtro = null;
        this.gruposeleccion = 'Todos los grupos';
        this.marcaseleccion = 'Todas las marcas';
      }
    });

    this.producto.getGrupos().then(grupos => {
      for (let grupo of grupos) {
        filtros.push({
          text: grupo, handler: () => {
            this.filtro = 'grupo';
            this.producto.getProductosFiltrado(grupo, this.filtro).then((productos) => {
              this.productos = productos;
            });
            this.gruposeleccion = grupo;
            this.marcaseleccion = 'Todas las marcas';
          }
        });
      }
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Grupos',
        buttons: filtros,
        cssClass: 'actionSheet1'
      });
      actionSheet.present();
    });
  }

  filtrosMarcas() {
    let filtros: any = [];
    filtros.push({
      text: 'Todas las marcas', handler: () => {
        this.getProductos();
        this.filtro = null;
        this.marcaseleccion = 'Todas las marcas';
        this.gruposeleccion = 'Todos los grupos';
      }
    });

    this.producto.getMarcas().then(marcas => {
      for (let marca of marcas) {
        filtros.push({
          text: marca, handler: () => {
            this.filtro = 'marca';
            this.producto.getProductosFiltrado(marca, this.filtro).then((productos) => {
              this.productos = productos;
            });
            this.marcaseleccion = marca;
            this.gruposeleccion = 'Todos los grupos';
          }
        });
      }
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Marcas',
        buttons: filtros
      });
      actionSheet.present();
    });
  }

  irAlertas() {
    this.navCtrl.push('ListaProductosAlertaPage');
  }

}
