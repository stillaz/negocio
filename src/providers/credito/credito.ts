import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the CreditoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CreditoProvider {

  constructor(public db: DbProvider) {
  }

  getCreditoByUsuarioFecha(idusuario, fechaInicio: Date, fechaFin: Date) {
    let sql = "select * from credito where idusuario = ? and fecha between ? and ? ";
    return this.db.ejecutar(sql, [idusuario, fechaInicio, fechaFin]).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  getCreditoByPersona(idpersona) {
    let sql = "select * from credito where idpersona = ? and activo = ? ";
    return this.db.ejecutar(sql, [idpersona, true]).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  createCredito(datos) {
    return this.getCreditoByPersona(datos.idpersona).then(res => {
      let idcredito;
      if (res != null) {
        idcredito = res.idcredito;
        datos.totalcredito += res.totalcredito;
      }

      let sql = "update credito set activo = ? where idcredito = ? ";

      let sqlCredito = "insert into credito (idusuario, idventa, idpersona, totalcredito, fecha, activo) " +
        "values (?, ?, ?, ?, ?, ?)";

      this.db.db.transaction(transaction => {
        transaction.executeSql(sqlCredito, [datos.idusuario, datos.idventa, datos.idpersona, datos.totalcredito, new Date(), true]);

        transaction.executeSql(sql, [false, idcredito]);
      }).then(res => {
        return Promise.resolve();
      }).catch(err => alert(err));
    });
  }

  createPago(datos) {
    return this.getCreditoByPersona(datos.idpersona).then(res => {
      if (res == null) {
        return Promise.reject("No tiene créditos pendientes");
      }

      datos.totalcredito = res.totalcredito - datos.pagado - datos.devuelta;

      let sql = "update credito set activo = ? where idcredito = ?";

      let sqlCredito = "insert into credito (idusuario, idpersona, totalcredito, pagado, devuelta, fecha, activo) " +
        "values (?, ?, ?, ?, ?, ?)";

      return this.db.db.transaction(transaction => {
        transaction.executeSql(sql, [false, res.idcredito]);

        transaction.executeSql(sqlCredito, [datos.idusuario, datos.idpersona, datos.totalcredito, datos.pagado, datos.devuelta, new Date(), datos.totalcredito > 0]);
      }).then(res => {
        return Promise.resolve();
      }).catch(err => Promise.reject(err));;
    });
  }

}
