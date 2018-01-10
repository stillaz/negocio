import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, Events } from 'ionic-angular';
import { VentaProvider } from '../../providers/venta/venta';
import { CajaProvider } from '../../providers/caja/caja';
import * as moment from 'moment';

/**
 * Generated class for the VentasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ventas',
  templateUrl: 'ventas.html',
})
export class VentasPage {

  ventas;
  total: number;
  fechaCaja: Date;

  pages: any[] = [
    { title: 'Historial de ventas', component: 'ListaVentasPage', icon: 'stats' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public venta: VentaProvider, public popoverCtrl: PopoverController, private cajaService: CajaProvider, public alertCtrl: AlertController, public events: Events) {
  }

  ionViewDidLoad(){
    this.fechaCaja = new Date();
    this.getVentas();
  }

  nuevo() {
    this.navCtrl.push('DetalleVentaPage');
    this.navCtrl.viewWillUnload.subscribe(() => {
      this.getVentas();
      this.events.publish('productos:alerta');
    });
  }

  getVentas() {
    this.total = 0;
    let inicial = moment(this.fechaCaja).startOf('day');
    let final = moment(this.fechaCaja).endOf('day');
    this.venta.getVentasByUsuarioFecha(inicial.toDate(), final.toDate()).then(ventas => {
      ventas.forEach(venta => {
        this.total = (venta.total < venta.pago) ? Number(this.total) + (Number(venta.pago) - Number(venta.devuelta)) : Number(this.total) + Number(venta.pago);
      });
      this.ventas = ventas;
    }).catch(err => alert("Error cargando ventas"));
  }

  menu(myEvent) {
    let popover = this.popoverCtrl.create('MenuVentasPage');
    popover.onDidDismiss(data => {
      this.getVentas();
    });
    popover.present({
      ev: myEvent
    });
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

  alertaCerrarCaja() {
    let caja: any = {};
    let total = this.total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    let fechaCaja = this.fechaCaja.toLocaleString();

    let prompt = this.alertCtrl.create({
      title: 'Caja ' + fechaCaja,
      message: "Total: " + total,
      inputs: [
        {
          label: 'Paga',
          name: 'pago',
          placeholder: '$ 0',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: data => {
            caja.fecha = this.fechaCaja;
            caja.totalcaja = this.total;
            caja.pago = data.pago;
            caja.fechaCierre = new Date();
            caja.diferencia = data.pago - caja.totalcaja;
            caja.idusuario = 0;
            caja.listaVentas = this.ventas;
            let diferenciaText = caja.diferencia.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            });
            let mensaje = caja.diferencia === 0 ? "" : caja.diferencia > 0 ? "La caja tiene un valor superior de " + diferenciaText : "La caja tiene un valor negativo de " + diferenciaText;
            if (mensaje === "") {
              this.cajaService.create(caja);
            } else {
              let alert = this.alertCtrl.create({
                title: 'Caja descuadrada',
                subTitle: mensaje,
                message: 'Desea continuar',
                buttons: [{
                  text: 'Si',
                  handler: () => {
                    this.cajaService.create(caja);
                  },
                },
                {
                  text: 'No',
                  role: 'cancel'
                }]
              });
              alert.present();
            }
          }
        }
      ]
    });
    prompt.present();
  }

}
