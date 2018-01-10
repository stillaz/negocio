import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';

/**
 * Generated class for the GeneralTabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-general-tabs',
  templateUrl: 'general-tabs.html'
})
@IonicPage()
export class GeneralTabsPage {

  allTabs = [];

  productosRoot = 'ProductosPage'
  ventasRoot = 'VentasPage'
  usuariosRoot = 'UsuariosPage'
  proveedoresRoot = 'ProveedoresPage'

  constructor(public navCtrl: NavController, public productoService: ProductoProvider, public events: Events, public detectorRef: ChangeDetectorRef) {
    this.allTabs = [
      { root:'ProductosPage',  title:'Productos', icon:'shirt', badge: 0 },
      { root:'VentasPage',  title:'Ventas', icon:'cash' },
      { root:'UsuariosPage',  title:'Usuarios', icon:'contact' },
      { root:'ProveedoresPage',  title:'Proveedores', icon:'information-circle' }
    ]
    this.actualizarAlertas();
    this.events.subscribe('productos:alerta', _badgeValue => {
      this.actualizarAlertas();
      detectorRef.detectChanges();
    });
  }

  actualizarAlertas(){
    this.productoService.getProductosAlerta().then(res => {
      this.allTabs[0].badge = res.length;
    })
  }

}
