import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';


/*
  Generated class for the VentasProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class VentaProvider {

  constructor(public db: DbProvider) {
  }

  getVentasByUsuarioFecha(fechaInicio: Date, fechaFin: Date){
    let items = [];
    let sql = "select * from venta where fecha between ? and ?";
    return this.db.ejecutar(sql, [fechaInicio, fechaFin]).then(res => {
      for(var i = 0; i < res.rows.length; i++){
        items.push(res.rows.item(i));
      }
      return Promise.resolve(items);
    }).catch(err => Promise.reject(err));
  }

  getVentas(){
    let items = [];
    let sql = "select * from venta order by idventa desc ";
    return this.db.ejecutar(sql, {}).then(res => {
      for(var i = 0; i < res.rows.length; i++){
        items.push(res.rows.item(i));
      }
      return Promise.resolve(items);
    }).catch(err => Promise.reject(err));
  }

  getIdVenta(){
    let sql = "select max(v.idventa) idventa from venta v ";
    return this.db.ejecutar(sql, {}).then(res => {
      let idventa = 0;
      for(var i = 0; i < res.rows.length; i++){
        idventa = res.rows.item(i).idventa;
      }
      idventa ++;
      return Promise.resolve(idventa);
    }).catch(err => Promise.reject(err));
  }

  create(venta){
    return this.db.db.transaction(transaction => {
      let sqlVenta = "insert into venta (idventa, idcliente, idusuario, fecha, descuento, total, pago, devuelta, activo) " +
      "values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      transaction.executeSql(sqlVenta, [venta.idventa, venta.idpersona, venta.idusuario, venta.fecha, 0, venta.total, venta.pago, venta.devuelta, venta.activo]);
      
      let sqlVentaDetalle = "insert into venta_detalle(idventa, idprecio, cantidad, total) " +
      "values (?, ?, ?, ?)";
      venta.productos.forEach(producto => {
        transaction.executeSql(sqlVentaDetalle, [venta.idventa, producto.producto.idprecio, producto.cantidad, producto.total]);

        this.db.ejecutar("select * from producto where idproducto = ? ", [producto.producto.idproducto]).then(res => {
          for(var i = 0; i < res.rows.length; i++){
            let sqlProducto = "update producto set cantidad = ? where idproducto = ? ";
            let cantidad = res.rows.item(i).cantidad - producto.cantidad;
            this.db.ejecutar(sqlProducto, [cantidad, res.rows.item(i).idproducto]);
          }
        });

        let totalingreso;
        if(venta.total > venta.pagado){
          totalingreso = venta.pagado;
        } else{
          totalingreso = venta.pagado - venta.devuelta;
        }
      });
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

  getDetalleVentaByClienteProducto(datos){
    let sql = "select vd.iddetalleventa, vd.cantidad, pp.precio from venta v inner join venta_detalle vd on vd.idventa = v.idventa and v.idcliente = ? and v.activo = ? inner join producto_precio pp on pp.idprecio = vd.idprecio and pp.idproducto = ? inner join producto p on p.idproducto = pp.idproducto ";
    return this.db.ejecutar(sql, [datos.idcliente, true, datos.idproducto]).then(res => {
      for(var i = 0; i < res.rows.length; i++){
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }
}
