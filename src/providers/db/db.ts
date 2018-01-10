import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbProvider {

  tablas: any[] = [];
  db: SQLiteObject = null;
  version = 1.0;

  constructor(public sqlite: SQLite) {
    this.tablas = [
      {
        tabla: 'proveedor', campos: [
          { nombre: 'idproveedor', tipo: 'integer primary key' },
          { nombre: 'nombre', tipo: 'text' },
          { nombre: 'telefono', tipo: 'text' },
          { nombre: 'correoelectronico', tipo: 'text' }
        ]
      },

      {
        tabla: 'persona', campos: [
          { nombre: 'idpersona', tipo: 'integer primary key' },
          { nombre: 'nombre', tipo: 'text' },
          { nombre: 'telefono', tipo: 'text' },
          { nombre: 'correoelectronico', tipo: 'text' }
        ]
      },

      {
        tabla: 'usuario', campos: [
          { nombre: 'idusuario', tipo: 'integer primary key autoincrement' },
          { nombre: 'idpersona', tipo: 'integer' },
          { nombre: 'nombre', tipo: 'text' },
          { nombre: 'clave', tipo: 'text' },
          { nombre: 'perfil', tipo: 'text' },
          { nombre: 'activo', tipo: 'numeric' }
        ]
      },

      {
        tabla: 'producto', campos: [
          { nombre: 'idproducto', tipo: 'integer primary key' },
          { nombre: 'descripcion', tipo: 'text' },
          { nombre: 'marca', tipo: 'text' },
          { nombre: 'grupo', tipo: 'text' },
          { nombre: 'alerta', tipo: 'integer' },
          { nombre: 'imagen', tipo: 'text' },
          { nombre: 'cantidad', tipo: 'integer' },
          { nombre: 'activo', tipo: 'numeric' }
        ]
      },

      {
        tabla: 'producto_precio', campos: [
          { nombre: 'idprecio', tipo: 'integer primary key autoincrement' },
          { nombre: 'idproducto', tipo: 'integer' },
          { nombre: 'precio', tipo: 'numeric' },
          { nombre: 'descuento', tipo: 'numeric' },
          { nombre: 'fecha', tipo: 'numeric' },
          { nombre: 'fechaFin', tipo: 'numeric' },
          { nombre: 'activo', tipo: 'numeric' }
        ]
      },

      {
        tabla: 'inventario', campos: [
          { nombre: 'idinventario', tipo: 'integer primary key autoincrement' },
          { nombre: 'idproducto', tipo: 'integer' },
          { nombre: 'cantidad', tipo: 'integer' },
          { nombre: 'fecha', tipo: 'numeric' },
          { nombre: 'idusuario', tipo: 'integer' },
          { nombre: 'costo', tipo: 'numeric' }
        ]
      },

      {
        tabla: 'venta', campos: [
          { nombre: 'idventa', tipo: 'integer primary key' },
          { nombre: 'idcliente', tipo: 'integer' },
          { nombre: 'idusuario', tipo: 'integer' },
          { nombre: 'fecha', tipo: 'numeric' },
          { nombre: 'descuento', tipo: 'numeric' },
          { nombre: 'total', tipo: 'numeric' },
          { nombre: 'pago', tipo: 'numeric' },
          { nombre: 'devuelta', tipo: 'numeric' },
          { nombre: 'activo', tipo: 'numeric' },
          { nombre: 'cerrada', tipo: 'numeric' }
        ]
      },

      {
        tabla: 'venta_detalle', campos: [
          { nombre: 'iddetalleventa', tipo: 'integer primary key autoincrement' },
          { nombre: 'idventa', tipo: 'integer' },
          { nombre: 'idprecio', tipo: 'integer' },
          { nombre: 'cantidad', tipo: 'integer' },
          { nombre: 'total', tipo: 'numeric' }
        ]
      },

      {
        tabla: "devolucion", campos: [
          { nombre: "iddevolucion", tipo: "integer primary key" },
          { nombre: "iddetalleventa", tipo: "integer" },
          { nombre: "idusuario", tipo: "integer" },
          { nombre: "cantidad", tipo: "integer" },
          { nombre: "tipo", tipo: "text" },
          { nombre: "motivo", tipo: "text" },
          { nombre: "fecha", tipo: "numeric" },
          { nombre: "total_devolucion", tipo: "numeric" },
          { nombre: "total_devolucion_detalle", tipo: "numeric" },
          { nombre: "pagado", tipo: "numeric" },
          { nombre: "devuelta", tipo: "numeric" }
        ]
      },

      {
        tabla: "devolucion_detalle", campos: [
          { nombre: "iddetalledevolucion", tipo: "integer primary key autoincrement" },
          { nombre: "iddevolucion", tipo: "integer" },
          { nombre: "idprecio", tipo: "integer" },
          { nombre: "cantidad", tipo: "integer" }
        ]
      },

      {
        tabla: "caja", campos: [
          { nombre: "idcaja", tipo: "integer primary key autoincrement" },
          { nombre: "idusuario", tipo: "integer" },
          { nombre: "fecha", tipo: "numeric" },
          { nombre: "totalcaja", tipo: "numeric" },
          { nombre: "pago", tipo: "numeric" },
          { nombre: "fechacierre", tipo: "numeric" },
          { nombre: "diferencia", tipo: "numeric" }
        ]
      },

      {
        tabla: "credito", campos: [
          { nombre: "idcredito", tipo: "integer primary key autoincrement" },
          { nombre: "idusuario", tipo: "integer" },
          { nombre: "idpersona", tipo: "integer" },
          { nombre: "fecha", tipo: "numeric" },
          { nombre: "idventa", tipo: "integer" },
          { nombre: "totalcredito", tipo: "numeric" },
          { nombre: "pagado", tipo: "numeric" },
          { nombre: "devuelta", tipo: "numeric" },
          { nombre: "activo", tipo: "numeric" }
        ]
      },

      {
        tabla: "version", campos: [
          { nombre: "idversion", tipo: "number primary key" }
        ]
      },
    ];
  }

  public openDb() {
    return this.sqlite.create({
      name: 'negocio.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.db = db;
      });
  }

  private getTables() {
    let itemstables = [];
    let sql = "select * from sqlite_master where type = 'table'";
    return this.db.executeSql(sql, {}).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        itemstables.push(res.rows.item(i).name);
      }
      return Promise.resolve(itemstables);
    }).catch(err => Promise.reject(err));
  }

  private createTable(datosTabla) {
    let sql = "create table if not exists " + datosTabla.tabla + "( ";
    datosTabla.campos.forEach((campo, index) => {
      if (index != 0) sql += ", "
      sql += campo.nombre + " " + campo.tipo;
    });
    sql += ")";
    this.db.executeSql(sql, {});
  }

  private getColumnsTable(tabla: string) {
    let columns = [];
    let sql = "PRAGMA table_info(" + tabla + ")";
    return this.db.executeSql(sql, {}).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        columns.push(res.rows.item(i).name);
      }
      return Promise.resolve(columns);
    }).catch(err => Promise.reject(err));
  }

  private createColumn(campo, tabla: string) {
    let sql = "alter table " + tabla + " add column " + campo.nombre + " " + campo.tipo;
    this.db.executeSql(sql, {});
  }

  private insertVersion() {
    let sql = "insert into version values (?)";
    this.db.executeSql(sql, this.version);
  }

  private getLastVersion() {
    let sql = "select max(idversion) version from version";
    return this.db.executeSql(sql, {}).then(res => {
      for (var i = 0; i < res.rows.length; i++) {
        return Promise.resolve(res.rows.item(i).version);
      }
      return Promise.resolve(0);
    }).catch(err => Promise.resolve(0));
  }

  public createTables() {
    this.getLastVersion().then(ver => {
      if (ver !== this.version) {
        this.getTables().then(res => {
          this.tablas.forEach(tabla => {
            let nombreTabla = tabla.tabla;
            if (!res.some(tab => tab === nombreTabla)) {
              this.createTable(tabla);
            } else {
              this.getColumnsTable(nombreTabla).then(res => {
                tabla.campos.forEach(campo => {
                  if (!res.some(camp => camp === campo.nombre)) {
                    this.createColumn(campo, nombreTabla);
                  }
                });
              });
            }
          });
          this.insertVersion();
        });
      }
    });
  }

  public ejecutar(sql, params) {
    return this.db.executeSql(sql, params);
  }

}
