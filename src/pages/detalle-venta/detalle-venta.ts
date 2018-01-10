import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { ProductoProvider } from '../../providers/producto/producto';
import { VentaProvider } from '../../providers/venta/venta';
import { CreditoProvider } from '../../providers/credito/credito';

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

  busqueda: string;
  datosVenta: any;
  productos: any;
  carrito: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public producto: ProductoProvider, public printer: Printer, private venta: VentaProvider, private viewCtrl: ViewController, private alertCtrl: AlertController, private creditoProvider: CreditoProvider) {
    this.datosVenta = this.navParams.data;
    this.getProductos();
  }

  getProductos() {
    this.producto.getProductosGroupedColumnas(5).then((productos) => {
      this.productos = productos;
    }).catch(err => alert('Error cargando productos'));
  }

  ionViewDidLoad() {
    this.ver();
  }

  filtrar() {
    if (this.busqueda) {
      this.producto.getProductosFiltrado(this.busqueda, 'descripcion').then((productos) => {
        this.productos = productos;
      }).catch(err => alert(err));
    } else {
      this.getProductos();
    }
  }

  ver() {
    let vistaDetalle = this.modalCtrl.create('DetallePersonaPage');
    vistaDetalle.onDidDismiss(data => {
      if (!data) {
        this.datosVenta.idcliente = '';
        this.datosVenta.nombre = '';
      } else {
        this.datosVenta = data ? data : {};
      }
      this.datosVenta.fecha = new Date();
      this.venta.getIdVenta().then(res => {
        this.datosVenta.idventa = res;
      });
    });
    vistaDetalle.present();
  }

  calcularTotal() {
    this.datosVenta.total = this.carrito.reduce((a, b) => {
      return a + b.total;
    }, 0);
  }

  agregar(producto) {
    let key = producto.idproducto;
    let productoCarrito = this.carrito.find(producto => producto.idproducto == key);
    if (productoCarrito === undefined) {
      productoCarrito = { idproducto: producto.idproducto, producto: producto, cantidad: 0, total: 0 };
      this.carrito.push(productoCarrito);
    }

    this.carrito.forEach(item => {
      if (item.idproducto == key) {
        if (item.producto.cantidad > item.cantidad) {
          item.cantidad++;
          item.total = item.cantidad * item.producto.precio;
        } else {
          alert("No hay más existencias del producto");
        }
      }
    });

    this.calcularTotal();
  }

  borrar(index) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  getDocumento(): string {
    let documento = '<div align="center">' +
      'Empresa' +
      '<br/>' +
      '<br/>' +
      'Factura No. ' + this.datosVenta.idventa +
      '<br/>' +
      'Fecha: ' + this.datosVenta.fecha.toLocaleString() +
      '<br/>';
    if (this.datosVenta.idpersona) {
      documento += 'Cliente: ' + this.datosVenta.idpersona + ' ' + this.datosVenta.nombre;
    }
    documento += '</div>' +
      '<br/>' +
      '<br/>' +
      '<table style="width:100%">' +
      '<tr>' +
      '<th>Producto</th>' +
      '<th>Cantidad</th>' +
      '<th>Precio</th>' +
      '<th>Subtotal</th>' +
      '</tr>';
    this.carrito.forEach(item => {
      documento += '<tr>' +
        '<td>' + item.producto.descripcion + ' ' + item.producto.marca + '</td>' +
        '<td align="right">' + item.cantidad + '</td>' +
        '<td align="right"> $' + item.producto.precio + '</td>' +
        '<td align="right"> $' + item.total + '</td>' +
        '</tr>';
    });
    documento += '<tr>' +
      '<td colspan="4" align="right"><strong>Total: $</strong>' + this.datosVenta.total + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" align="right"><strong>Paga: $</strong>' + this.datosVenta.pago + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" align="right"><strong>Devuelta: $</strong>' + this.datosVenta.devuelta + '</td>' +
      '</tr>' +
      '</table>';
    return documento;
  }

  print() {
    this.printer.isAvailable().then((onsuccess: any) => {
      let options: PrintOptions = {
        name: 'venta' + this.datosVenta.idventa,
        printerId: 'printer007',
        duplex: true,
        landscape: true,
        grayscale: true
      };

      this.printer.print(this.getDocumento(), options).then((value: any) => {
      }, (error) => {
        alert('Error al imprimir');
      });
    }, (err) => {
      alert('Error al imprimir');
    });
  }

  guardar() {
    this.datosVenta.idusuario = 1;
    let total = this.datosVenta.total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    let prompt = this.alertCtrl.create({
      title: 'Venta ' + this.datosVenta.idventa,
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
            this.datosVenta.pago = data.pago;
            this.datosVenta.devuelta = this.datosVenta.pago - this.datosVenta.total;
            let devuelta = this.datosVenta.devuelta.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            });
            this.datosVenta.productos = this.carrito;
            this.datosVenta.activo = true;
            this.venta.create(this.datosVenta).then(() => {
              let alert;
              if (this.datosVenta.devuelta < 0 && this.datosVenta.idpersona != null) {
                alert = this.alertCtrl.create({
                  title: 'La venta queda en crédito',
                  subTitle: 'Crédito de: ' + devuelta,
                  buttons: [{
                    text: 'Aceptar',
                    handler: () => {
                      let datos = { "idusuario": 1, "idventa": this.datosVenta.idventa, "idpersona": this.datosVenta.idpersona, "totalcredito": - this.datosVenta.devuelta };
                      this.creditoProvider.createCredito(datos).then(res => {
                        this.print();
                        this.viewCtrl.dismiss();
                      }).catch(err => alert(err));
                    }
                  }]
                });
              } else {
                alert = this.alertCtrl.create({
                  title: 'Devuelta',
                  subTitle: devuelta,
                  buttons: [{
                    text: 'Aceptar',
                    handler: () => {
                      this.print();
                      this.viewCtrl.dismiss();
                    }
                  }]
                });
              }
              alert.present();
            }).catch(err => alert("Error al guardar"));
          }
        }
      ]
    });
    prompt.present();
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
