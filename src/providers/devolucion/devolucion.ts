import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the DevolucionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DevolucionProvider {

  constructor(public db: DbProvider) {
  }

  getDevoluciones(){
    let items = [];
    let sql = "select * from devolucion order by iddevolucion desc ";
    return this.db.ejecutar(sql, {}).then(res => {
      for(var i = 0; i < res.rows.length; i++){
        items.push(res.rows.item(i));
      }
      return Promise.resolve(items);
    }).catch(err => Promise.reject(err));
  }

  getIdDevolucion(){
    let sql = "select max(d.iddevolucion) iddevolucion from devolucion d ";
    return this.db.ejecutar(sql, {}).then(res => {
      let iddevolucion = 0;
      for(var i = 0; i < res.rows.length; i++){
        iddevolucion = res.rows.item(i).iddevolucion;
      }
      iddevolucion ++;
      return Promise.resolve(iddevolucion);
    }).catch(err => Promise.reject(err));
  }

  create(devolucion){
    return this.db.db.transaction(transaction => {
      let sqlDevolucion = "insert into devolucion (iddevolucion, iddetalleventa, idusuario, cantidad, tipo, motivo, fecha, total_devolucion, total_devolucion_detalle, pagado, devuelta) " +
      "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      transaction.executeSql(sqlDevolucion, [devolucion.iddevolucion, devolucion.iddetalleventa, 1, devolucion.cantidad, devolucion.tipo, devolucion.motivo, devolucion.fecha, devolucion.total_devolucion, devolucion.total_devolucion_detalle, devolucion.pagado, devolucion.devuelta]);
      
      let sqlVentaDetalle = "insert into devolucion_detalle(iddevolucion, idprecio, cantidad) " +
      "values (?, ?, ?, ?)";

      devolucion.productos.forEach(producto => {
        this.db.ejecutar(sqlVentaDetalle, [devolucion.iddevolucion, producto.idprecio, producto.cantidad])
        .then(() => {
          this.db.ejecutar("select * from producto where idproducto = ? ", [producto.producto.idproducto]).then(res => {
            for(var i = 0; i < res.rows.length; i++){
              let sqlProducto = "update producto set cantidad = ? where idproducto = ? ";
              let cantidad = res.rows.item(i).cantidad - producto.cantidad;
              this.db.ejecutar(sqlProducto, [cantidad, res.rows.item(i).idproducto]);
            }
          });
        });
      });

      this.db.ejecutar("select * from producto where idproducto = ? ", [devolucion.idproducto]).then(res => {
        for(var i = 0; i < res.rows.length; i++){
          let sqlProducto = "update producto set cantidad = ? where idproducto = ? ";
          let cantidad = res.rows.item(i).cantidad + devolucion.cantidad;
          this.db.ejecutar(sqlProducto, [cantidad, res.rows.item(i).idproducto]);
        }
      });
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

  getDevolucionesByUsuarioFecha(idusuario, fechaInicio: Date, fechaFin: Date) {
    let sql = "select * from devolucion where idusuario = ? and fecha between ? and ? ";
    return this.db.ejecutar(sql, [idusuario, fechaInicio, fechaFin]).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

}
