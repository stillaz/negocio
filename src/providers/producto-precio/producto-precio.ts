import { Injectable } from '@angular/core';
import { DbProvider } from '../db/db';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductoPrecioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductoPrecioProvider {

  constructor(public db: DbProvider) {
  }

  create(precio){
    return this.db.db.transaction(transaction => {
      let sql = "update producto_precio " +
      "set activo = ? where idproducto = ?";

      transaction.executeSql(sql, [false, precio.idproducto]);

      sql = "insert into producto_precio(idproducto, precio, descuento, fecha, fechaFin, activo) " +
      "values (?, ?, ?, ?, ?, ?)";
      transaction.executeSql(sql, [precio.idproducto, precio.precio, precio.descuento, new Date(), precio.fechaFin, true]);
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

}
