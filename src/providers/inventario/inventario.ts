import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the InventarioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class InventarioProvider {

  constructor(public db: DbProvider) {
  }

  create(inventario){
    return this.db.db.transaction(transaction => {
      let sql = "insert into inventario (idproducto, fecha, idusuario, cantidad, costo) " + 
      "values (?, ?, ?, ?, ?) "

      transaction.executeSql(sql, [inventario.idproducto, new Date(), 0, inventario.cantidadIngreso, inventario.costo]);

      sql = "update producto " +
      "set cantidad = ? where idproducto = ?";
      transaction.executeSql(sql, [inventario.cantidad, inventario.idproducto]);
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

}
