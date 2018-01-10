import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ActionSheetController } from 'ionic-angular';
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
  modo = 'uno';
  filtro: string;
  gruposeleccion: string;
  marcaseleccion: string;

  pages: any[] = [
    { title: 'Productos en alerta', component: '', icon: 'alert' },
    { title: 'Productos más vendidos', component: '', icon: 'trending-up' },
    { title: 'Productos menos vendidos', component: '', icon: 'trending-down' },
    { title: 'Histórico inventario', component: '', icon: 'list-box' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public producto: ProductoProvider, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController) {
  }

  getProductos(){
    if(this.modo == 'uno'){
      this.producto.getProductosGruopedGrupo().then(productos =>{
        this.productos = productos;
      }).catch(err => alert("Error al cargar datos"));
    } else if(this.modo == 'dos'){
      this.producto.getProductosGroupedColumnas(5).then(productos =>{
        this.productos = productos;
      }).catch(err => alert("Error al cargar datos"));
    }
  }

  agregar(){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage');
    vistaDetalle.present();
    vistaDetalle.onDidDismiss(data => {
      this.filtrar();
    });
  }

  ver(producto){
    let vistaDetalle = this.modalCtrl.create('DetalleProductoPage', producto);
    vistaDetalle.present();
    vistaDetalle.onDidDismiss(data => {
      this.filtrar();
    });
  }

  filtrar(){
    if(this.busqueda){
      this.producto.getProductosFiltrado(this.busqueda, 'descripcion').then((productos) =>{
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
    popover.onDidDismiss(data =>{
      this.getProductos();
    });
    popover.present({
      ev: myEvent
    });
  }

  precio(producto){
    let vistaDetalle = this.modalCtrl.create('DetallePrecioPage', producto);
    vistaDetalle.present();
  }

  filtrosGrupos(){
    let filtros: any = [];
    filtros.push({ text: 'Todos los grupos', handler: () => {
      this.getProductos();
      this.filtro = null;
      this.gruposeleccion = 'Todos los grupos';
      this.marcaseleccion = 'Todas las marcas';
    }});

    this.producto.getGrupos().then(grupos => {
      for(let grupo of grupos){
        filtros.push({ text: grupo, handler: () => {
          this.filtro = 'grupo';
          this.producto.getProductosFiltrado(grupo, this.filtro).then((productos) =>{
            this.productos = productos;
          });
          this.gruposeleccion = grupo;
          this.marcaseleccion = 'Todas las marcas';
        }});
      }
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Grupos',
        buttons: filtros
      });
      actionSheet.present();
    });
  }

  filtrosMarcas(){
    let filtros: any = [];
    filtros.push({ text: 'Todas las marcas', handler: () => {
      this.getProductos();
      this.filtro = null;
      this.marcaseleccion = 'Todas las marcas';
      this.gruposeleccion = 'Todos los grupos';
    }});

    this.producto.getMarcas().then(marcas => {
      for(let marca of marcas){
        filtros.push({ text: marca, handler: () => {
          this.filtro = 'marca';
          this.producto.getProductosFiltrado(marca, this.filtro).then((productos) =>{
            this.productos = productos;
          });
          this.marcaseleccion = marca;
          this.gruposeleccion = 'Todos los grupos';
        }});
      }
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Marcas',
        buttons: filtros
      });
      actionSheet.present();
    });
  }

}
