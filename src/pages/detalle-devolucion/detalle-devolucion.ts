import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { ProductoProvider } from '../../providers/producto/producto';
import { VentaProvider } from '../../providers/venta/venta';
import { DevolucionProvider } from '../../providers/devolucion/devolucion';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { CreditoProvider } from '../../providers/credito/credito';

/**
 * Generated class for the DetalleDevolucionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-devolucion',
  templateUrl: 'detalle-devolucion.html',
})
export class DetalleDevolucionPage {

  modo: string;
  idventa: number;
  idpersona: number;
  producto;
  busqueda: string;
  datosDevolucion: any = {};
  productos;
  carrito = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private productoServicio: ProductoProvider, private ventaServicio: VentaProvider, public alertCtrl: AlertController, public viewCtrl: ViewController, private devolucionServicio: DevolucionProvider, private inventarioServicio: InventarioProvider, public printer: Printer, private creditoProvider: CreditoProvider) {
    devolucionServicio.getIdDevolucion().then(res => {
      this.datosDevolucion.iddevolucion = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleDevolucionPage');
  }

  filtrar() {
    if (this.busqueda) {
      this.productoServicio.getProductosFiltrado(this.busqueda, 'descripcion').then((productos) => {
        this.productos = productos;
      }).catch(err => alert(err));
    } else if (this.datosDevolucion.tipo === 'uno') {
      this.getProductos();
    }
  }

  obtener(producto) {
    this.busqueda = null;
    this.producto = producto;
  }

  seleccionar() {
    let datos = { idcliente: this.idpersona, idproducto: this.producto.idproducto };
    this.ventaServicio.getDetalleVentaByClienteProducto(datos).then(res => {
      if (res) {
        let prompt = this.alertCtrl.create();
        prompt.setTitle('Devolución de productos');
        prompt.addInput({
          type: 'number',
          placeholder: 'Cantidad de productos a devolver',
          name: 'cantidad',
        });

        prompt.addInput({
          type: 'text',
          placeholder: 'Motivo devolución',
          name: 'motivo'
        });

        prompt.addButton({
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            this.viewCtrl.dismiss();
          }
        });

        prompt.addButton({
          text: 'Aceptar',
          handler: data => {
            if (!data.cantidad || !data.motivo) {
              alert("Falta información");
              prompt.dismiss();
            } else if (data.cantidad > res.cantidad) {
              alert("La cantidad de productos es mayor a lo comprado");
              prompt.dismiss();
            } else {
              let alertTipo = this.alertCtrl.create();
              alertTipo.setTitle('Modo devolución');
              alertTipo.addInput({
                type: 'radio',
                label: 'Devolución por productos',
                value: 'uno',
                checked: true
              });

              alertTipo.addInput({
                type: 'radio',
                label: 'Devolución de dinero',
                value: 'dos',
              });

              alertTipo.addButton({
                text: 'Cancelar',
                role: 'cancel',
                handler: dataTipo => {
                  this.viewCtrl.dismiss();
                }
              });

              alertTipo.addButton({
                text: 'Aceptar',
                handler: dataTipo => {
                  this.datosDevolucion.cantidad = data.cantidad;
                  this.datosDevolucion.motivo = data.motivo;
                  this.datosDevolucion.tipo = dataTipo;
                  this.datosDevolucion.iddetalleventa = res.iddetalleventa;
                  this.datosDevolucion.precio = res.precio;
                  this.datosDevolucion.fecha = new Date();
                  this.datosDevolucion.total_devolucion = this.datosDevolucion.precio * this.datosDevolucion.cantidad;
                  if (dataTipo === 'dos') {
                    let alertDevolucionDinero = this.alertCtrl.create();
                    alertDevolucionDinero.setTitle('Devolución de productos');
                    alertDevolucionDinero.setMessage('Total a devolver: ' + this.datosDevolucion.total_devolucion);
                    alertDevolucionDinero.addInput({
                      type: 'number',
                      placeholder: '$0',
                      value: 'pagado',
                      name: 'pagado'
                    });

                    alertDevolucionDinero.addButton({
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: dataDevolucionDinero => {
                        this.viewCtrl.dismiss();
                      }
                    });

                    alertDevolucionDinero.addButton({
                      text: 'Guardar',
                      handler: dataDevolucionDinero => {
                        if (!dataDevolucionDinero || !dataDevolucionDinero.pagado) {
                          alert("Falta información");
                          alertDevolucionDinero.dismiss();
                        } else {
                          this.datosDevolucion.pagado = dataDevolucionDinero.pagado;
                          this.datosDevolucion.devuelta = this.datosDevolucion.pagado - this.datosDevolucion.total_devolucion;
                          this.datosDevolucion.productos = [];
                          this.devolucionServicio.create(this.datosDevolucion).then(() => {
                            this.alertDevuelta();
                          }).catch(err => alert(JSON.stringify(err)));
                        }
                      }
                    });
                    alertDevolucionDinero.present();
                  } else {
                    this.getProductos();
                  }
                }
              });
              alertTipo.present();
            }
          }
        });
        prompt.present();
      } else {
        alert("El producto no coincide con las compras del cliente");
      }
    }).catch(err => JSON.stringify(err));
  }

  alertDevuelta() {
    let alertDevueltaDevolucion;
    let devuelta = this.datosDevolucion.devuelta.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    if (this.datosDevolucion.devuelta >= 0) {
      alertDevueltaDevolucion = this.alertCtrl.create({
        title: 'Devuelta',
        subTitle: devuelta,
        buttons: [{
          text: 'Aceptar',
          handler: dataDevuelta => {
            this.print();
            this.viewCtrl.dismiss();
          }
        }]
      });
    } else {
      alertDevueltaDevolucion = this.alertCtrl.create({
        title: 'La venta queda en crédito',
        subTitle: 'Crédito de: ' + this.datosDevolucion.devuelta,
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            let datos = { "idusuario": 1, "idventa": this.datosDevolucion.idventa, "idpersona": this.datosDevolucion.idpersona, "totalcredito": this.datosDevolucion.devuelta };
            this.creditoProvider.createCredito(datos).then(res => {
              this.print();
              this.viewCtrl.dismiss();
            }).catch(err => alert());
          }
        }]
      });
    }
    alertDevueltaDevolucion.present();
  }

  getProductos() {
    this.productoServicio.getProductosGruopedGrupo().then(productos => {
      this.productos = productos;
    }).catch(err => alert("Error al cargar datos"));
  }

  calcularTotal() {
    this.datosDevolucion.total_devolucion_detalle = this.carrito.reduce((a, b) => {
      return a + b.total;
    }, 0);
    this.datosDevolucion.devuelta = this.datosDevolucion.total_devolucion_detalle - this.datosDevolucion.total_devolucion;
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
      'Devolución No. ' + this.datosDevolucion.iddevolucion +
      '<br/>' +
      'Fecha: ' + this.datosDevolucion.fecha.toLocaleString() +
      '<br/>';
    if (this.datosDevolucion.idpersona) {
      documento += 'Cliente: ' + this.datosDevolucion.idpersona + ' ' + this.datosDevolucion.nombre;
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
      '<td colspan="4" align="right"><strong>Subtotal: $</strong>' + this.datosDevolucion.total_devolucion_detalle + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" align="right"><strong>Total por devolución: $</strong>' + this.datosDevolucion.total_devolucion + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" align="right"><strong>Paga: $</strong>' + this.datosDevolucion.pagado + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td colspan="4" align="right"><strong>Devuelta: $</strong>' + this.datosDevolucion.devuelta + '</td>' +
      '</tr>' +
      '</table>';
    return documento;
  }

  print() {
    this.printer.isAvailable().then((onsuccess: any) => {
      let options: PrintOptions = {
        name: 'venta' + this.datosDevolucion.idventa,
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
    let total = this.datosDevolucion.devuelta.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    let prompt = this.alertCtrl.create({
      title: 'Devolución ' + this.datosDevolucion.iddevolucion,
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
            this.datosDevolucion.pagado = data.pago;
            this.datosDevolucion.devuelta = this.datosDevolucion.pagado - this.datosDevolucion.devuelta;
            this.datosDevolucion.productos = this.carrito;
            this.datosDevolucion.activo = true;
            this.devolucionServicio.create(this.datosDevolucion).then(() => {
              this.alertDevuelta();
            }).catch(err => alert(err));
          }
        }
      ]
    });
    prompt.present();
  }

}
