import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the CajaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CajaProvider {

  constructor(public db: DbProvider) {
  }

  create(datos) {
    let sql = "insert into caja (idusuario, fecha, totalcaja, pago, fechacierre, diferencia) " +
      "values (?, ?, ?, ?, ?, ?)";
      let sqlUpdateVenta = "update venta set cerrada = ? where idventa = ?";
    return this.db.ejecutar(sql, [datos.idusuario, datos.fecha, datos.totalcaja, datos.pago, datos.fechaCierre, datos.diferencia]).then(res => {
      datos.listaVentas.forEach(venta => {
        this.db.ejecutar(sqlUpdateVenta, [true, venta.idventa]).catch(err => Promise.reject(err));
      });
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

}
