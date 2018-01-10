import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the MenuMarcasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu-busqueda',
  templateUrl: 'menu-busqueda.html',
})
export class MenuBusquedaPage {

  items: String[];
  busqueda: string;
  tipo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private producto: ProductoProvider, private alertCtrl: AlertController) {
    this.tipo = this.navParams.data.tipo;
    if(this.tipo == 'Marcas'){
      this.getMarcas();
    } else if(this.tipo == 'Grupos'){
      this.getGrupos();
    }
  }

  ionViewDidLoad() {
     
  }

  getMarcas(){
    this.producto.getMarcas()
    .then(marcas => this.items = marcas)
    .catch(err => alert("Error obteniendo datos"));
  }

  getGrupos(){
    this.producto.getGrupos()
    .then(grupos => this.items = grupos)
    .catch(err => alert("Error obteniendo datos"));
  }

  seleccionar(item){
    if(!this.items.find(data => data.toLowerCase() == item.toLowerCase())){
      let tipo = this.tipo == 'Marcas' ? 'la ' + this.tipo.slice(0, -1).toLowerCase() : 'el ' + this.tipo.slice(0, -1).toLowerCase();
      let alert = this.alertCtrl.create({
        title: 'Crear ' + this.tipo.slice(0, -1).toLowerCase(),
        message: '¿Desea crear ' + tipo + ' ' + item + '?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Si',
            handler: () => {
              this.viewCtrl.dismiss(item);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.viewCtrl.dismiss(item);
    }
  }

  filtrar(){
    if(this.tipo == 'Marcas'){
      if(this.busqueda){
        this.producto.getMarcasFiltrado(this.busqueda)
        .then(marcas => this.items = marcas)
        .catch(err => alert("Error obteniendo marcas"));
      } else {
        this.getMarcas();
      }
    } else if(this.tipo == 'Grupos'){
      if(this.busqueda){
        this.producto.getGruposFiltrado(this.busqueda)
        .then(grupos => this.items = grupos)
        .catch(err => alert("Error obteniendo marcas"));
      } else {
        this.getGrupos();
      }
    }
  }

}
