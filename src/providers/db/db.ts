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

  constructor(public sqlite: SQLite) {
    this.tablas = [
      { tabla: 'proveedor', campos: [
        {nombre: 'idproveedor', tipo: 'integer primary key'},
        {nombre: 'nombre', tipo: 'text'},
        {nombre: 'telefono', tipo: 'text'},
        {nombre: 'correoelectronico', tipo: 'text'},
      ]},

      { tabla: 'persona', campos: [
        {nombre: 'idpersona', tipo: 'integer primary key'},
        {nombre: 'nombre', tipo: 'text'},
        {nombre: 'telefono', tipo: 'text'},
        {nombre: 'correoelectronico', tipo: 'text'},
      ]},

      { tabla: 'usuario', campos: [
        {nombre: 'idusuario', tipo: 'integer primary key autoincrement'},
        {nombre: 'idpersona', tipo: 'integer'},
        {nombre: 'nombre', tipo: 'text'},
        {nombre: 'clave', tipo: 'text'},
        {nombre: 'perfil', tipo: 'text'},
        {nombre: 'activo', tipo: 'numeric'},
      ]},

      { tabla: 'producto', campos: [
        {nombre: 'idproducto', tipo: 'integer primary key'},
        {nombre: 'descripcion', tipo: 'text'},
        {nombre: 'marca', tipo: 'text'},
        {nombre: 'grupo', tipo: 'text'},
        {nombre: 'alerta', tipo: 'integer'},
        {nombre: 'imagen', tipo: 'text'},
        {nombre: 'cantidad', tipo: 'integer'},
        {nombre: 'activo', tipo: 'numeric'}
      ]},

      { tabla: 'producto_precio', campos: [
        {nombre: 'idprecio', tipo: 'integer primary key autoincrement'},
        {nombre: 'idproducto', tipo: 'integer'},
        {nombre: 'precio', tipo: 'numeric'},
        {nombre: 'descuento', tipo: 'numeric'},
        {nombre: 'fecha', tipo: 'numeric'},
        {nombre: 'activo', tipo: 'numeric'}
      ]},

      { tabla: 'inventario', campos: [
        {nombre: 'idinventario', tipo: 'integer primary key autoincrement'},
        {nombre: 'idproducto', tipo: 'integer'},
        {nombre: 'fecha', tipo: 'numeric'},
        {nombre: 'idusuario', tipo: 'integer'},
      ]},

      { tabla: 'venta', campos: [
        {nombre: 'idventa', tipo: 'integer primary key autoincrement'},
        {nombre: 'idcliente', tipo: 'integer'},
        {nombre: 'idusuario', tipo: 'integer'},
        {nombre: 'fecha', tipo: 'numeric'},
        {nombre: 'descuento', tipo: 'numeric'},
        {nombre: 'total', tipo: 'numeric'},
        {nombre: 'activo', tipo: 'numeric'},
      ]},

      { tabla: 'venta_detalle', campos: [
        {nombre: 'iddetalleventa', tipo: 'integer primary key autoincrement'},
        {nombre: 'idventa', tipo: 'integer'},
        {nombre: 'idprecio', tipo: 'integer'},
      ]},
    ];
  }

  public openDb(){
    return this.sqlite.create({
      name: 'negocio.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.db = db;
    });
  }

  public createTables(){
    let sql = "";
    this.tablas.forEach( tabla => {
      sql = "create table if not exists " + tabla.tabla + "( ";
      tabla.campos.forEach((campo, index) => {
        if(index != 0) sql += ", "
        sql += campo.nombre + " " + campo.tipo;
      });
      sql += ")";
      this.ejecutar(sql, {});
    });
  }

  public ejecutar(sql, params){
    return this.db.executeSql(sql, params);
  }

}
