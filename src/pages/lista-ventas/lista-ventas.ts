import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { VentaProvider } from '../../providers/venta/venta';

/**
 * Generated class for the ListaVentasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-ventas',
  templateUrl: 'lista-ventas.html',
})
export class ListaVentasPage {

  ventas: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private ventaService: VentaProvider) {
  }

  ionViewDidLoad() {
    this.getVentas();
  }

  getVentas() {
    let items = [];
    let actual = moment(new Date);
    this.ventaService.getVentas().then(ventas => {
      let anterior = moment(actual).add(-1, 'day');
      items.push(this.getVentasBy(ventas, actual, 'day', 11));
      items.push(this.getVentasBy(ventas, anterior, 'day', 12));

      anterior = moment(actual).add(-1, 'week');
      items.push(this.getVentasBy(ventas, actual, 'week', 21));
      items.push(this.getVentasBy(ventas, anterior, 'week', 22));

      anterior = moment(actual).add(-1, 'month');
      items.push(this.getVentasBy(ventas, actual, 'month', 31));
      items.push(this.getVentasBy(ventas, anterior, 'month', 32));

      anterior = moment(actual).add(-1, 'year');
      items.push(this.getVentasBy(ventas, actual, 'year', 41));
      items.push(this.getVentasBy(ventas, anterior, 'year', 42));

      this.ventas = items;
    }).catch(err => alert("Error cargando ventas"));
  }

  getVentasBy(ventas: any, fecha: moment.Moment, tipo, id: number): any {
    let contador: number = 0;
    let total: number = 0;
    let texto: string;
    let inicial = moment(fecha).startOf(tipo);
    let final = moment(fecha).endOf(tipo);
    let diferencia = moment(new Date()).diff(fecha, tipo);
    let cierrePendiente = '';
    let listaVentas = [];
    let listaPendienteCerrar = [];
    ventas.forEach(venta => {
      if (inicial.isSameOrAfter(venta.fecha, tipo) && final.isSameOrBefore(venta.fecha, tipo)) {
        total += venta.total;
        contador++;
        listaVentas.push(venta);
        if (venta.cerrada !== 'true') {
          listaPendienteCerrar.push(venta);
          if (tipo === 'day') {
            cierrePendiente = 'cerrar';
          }
        }
      }

      switch (tipo) {
        case 'day':
          texto = diferencia == 0 ? 'hoy' : diferencia == 1 ? 'ayer' : 'hace ' + diferencia + ' días';
          break;

        case 'week':
          texto = diferencia == 0 ? 'esta semana' : diferencia == 1 ? 'semana anterior' : 'hace ' + diferencia + ' semanas';
          break;

        case 'month':
          texto = diferencia == 0 ? 'este mes' : diferencia == 1 ? 'mes anterior' : 'hace ' + diferencia + ' meses';
          break;

        case 'year':
          texto = diferencia == 0 ? 'este año' : diferencia == 1 ? 'año anterior' : 'hace ' + diferencia + ' años';
          break;
      }
    });
    return { id: id, ventas: contador, totalVentas: total, fecha: texto, cerrar: cierrePendiente, detalle: listaVentas, cierre: listaPendienteCerrar, fechaCaja: fecha.toDate() };
  }

}
