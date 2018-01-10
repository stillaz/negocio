import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { CajaProvider } from '../../providers/caja/caja';

/**
 * Generated class for the DetalleCajaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-caja',
  templateUrl: 'detalle-caja.html',
})
export class DetalleCajaPage {

  cajaDetalle: any;
  fechaCaja: any;
  total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private cajaService: CajaProvider, private viewCtrl: ViewController) {
    this.cajaDetalle = this.navParams.data.listaPendienteCaja;
    this.total = 0;
    this.cajaDetalle.forEach(venta => {
      this.total = (venta.total < venta.pago) ? Number(this.total) + (Number(venta.pago) - Number(venta.devuelta)) : Number(this.total) + Number(venta.pago);
    });
    this.fechaCaja = this.navParams.data.fechaCaja;
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
            caja.listaVentas = this.cajaDetalle;
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
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleCajaPage');
  }

}
