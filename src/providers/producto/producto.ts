import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the ProductoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductoProvider {

  constructor(public db: DbProvider) {
  }

  getProductosFiltrado(filtro, campo: string){
    return this.getProductos().then(productos => {
      return Promise.resolve(productos.filter((item) => {
        return item[campo].toLowerCase().indexOf(filtro.toLowerCase()) > -1;
      }));
    }).catch(err => Promise.reject(err));
  }

  getProductosGroupedColumnas(columnas){
    let productos = [];
    return this.getProductosGruopedGrupo().then(grupos => {
      let fila = -1;
      for(let grupo of grupos){
        let productosFila = [];
        grupo.productos.forEach((producto, index) => {
          if(index == 0 || index % columnas == 0){
            fila++;
            if ( productosFila[fila] === undefined ) productosFila[fila] = [];
          }
          productosFila[fila].push(producto);
          if(index + 1 == grupo.productos.length && grupo.productos.length % columnas != 0){
            for(let i = 0; i <= columnas - productosFila[fila].length; i++ ){
              productosFila[fila].push({});
            }
          }
        });
        productos.push({grupo: grupo.grupo, filas: productosFila});
      }
      return Promise.resolve(productos);
    }).catch(err => Promise.reject(err));
  }

  getProductosGruopedGrupo(){
    let grupos = [];
    return this.getProductos()
    .then(productos => {
      for(let producto of productos){
        let grupo = producto.grupo;
      
        if (grupos[grupo] === undefined ) grupos[grupo] = [];
        grupos[grupo].push(producto);
      }

      for (let grupo in grupos) {
        grupos.push({'grupo': grupo, 'productos': grupos[grupo]});
      }

      return Promise.resolve(grupos);
      })
    .catch(err => Promise.reject(err));
  }

  getProductoById(idproducto){
    let sql = 'select p.idproducto, p.descripcion, p.marca, p.grupo, p.alerta, p.imagen, p.cantidad, p.activo, pp.idprecio, pp.precio from producto p inner join producto_precio pp on p.idproducto = pp.idproducto and pp.activo = ? where p.idproducto = ? ';
    return this.db.ejecutar(sql, [true, idproducto]).
    then((res) => {
      for(var i = 0; i < res.rows.length; i++){
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  getProductos(){
    let sql = 'select p.idproducto, p.descripcion, p.marca, p.grupo, p.alerta, p.imagen, p.cantidad, p.activo, pp.idprecio, pp.precio from producto p inner join producto_precio pp on p.idproducto = pp.idproducto and p.activo = ? and pp.activo = ? order by p.grupo';
    
    let items = [];
    return this.db.ejecutar(sql, [true, true])
    .then((res) => {
      for(var i = 0; i < res.rows.length; i++){
        items.push(res.rows.item(i));
      }
      return Promise.resolve(items);
    })
    .catch(err => Promise.reject(err));
  }

  getGrupos(){
    let items = [];
    let sql = 'select p.grupo from producto p group by p.grupo';
    return this.db.ejecutar(sql, {}).then((res) => {
      for(var i = 0; i < res.rows.length; i++) {
        items.push(res.rows.item(i).grupo);
      }
      return Promise.resolve(items);
    }).catch(err => Promise.reject(err));
  }

  getGruposFiltrado(filtro){
    return this.getGrupos().then(grupos => {
      return Promise.resolve(grupos.filter((grupo) => {
        return grupo.toLowerCase().indexOf(filtro.toLowerCase()) > -1;
      }));
    }).catch(err => Promise.reject(err));
  }

  getMarcas(){
    let items = [];
    let sql = 'select p.marca from producto p group by p.marca';
    return this.db.ejecutar(sql, {}).then((res) => {
      for(var i = 0; i < res.rows.length; i++) {
        items.push(res.rows.item(i).marca);
      }
      return Promise.resolve(items);
    }).catch(err => Promise.reject(err));
  }

  getMarcasFiltrado(filtro){
    return this.getMarcas().then(marcas => {
      return Promise.resolve(marcas.filter((marca) => {
        return marca.toLowerCase().indexOf(filtro.toLowerCase()) > -1;
      }));
    }).catch(err => Promise.reject(err));
  }

  existsProducto(producto){
    let sql = 'select p.idproducto from producto p left join inventario i on i.idproducto = p.idproducto and p.idproducto = ? where (p.idproducto = ? and p.cantidad > 0) or i.idproducto not null limit 1';
    
    return this.db.ejecutar(sql, [producto.idproducto, producto.idproducto])
    .then((res) => {
      for(var i = 0; i < res.rows.length; i++){
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    })
    .catch(err => Promise.reject(err));
  }

  create(producto){
    return this.db.db.transaction(transaction => {
      let sql = "insert into producto (idproducto, descripcion, marca, grupo, alerta, imagen, cantidad, activo) " +
      "values (?, ?, ?, ?, ?, ?, ?, ?)";
      transaction.executeSql(sql, [producto.idproducto, producto.descripcion, producto.marca, producto.grupo, producto.alerta, producto.imagen, 0, producto.activo]);
      
      sql = "insert into producto_precio(idproducto, precio, descuento, fecha, fechaFin, activo) " +
      "values (?, ?, ?, ?, ?, ?)";

      transaction.executeSql(sql, [producto.idproducto, producto.precio, 0, new Date(), null, true]);
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

  update(producto){
    let sql = "update producto set descripcion = ?, marca = ?, grupo = ?, alerta = ?, imagen = ?, activo = ? " +
    " where idproducto = ?";
    return this.db.ejecutar(sql, [producto.descripcion, producto.marca, producto.grupo, producto.alerta, producto.imagen, producto.activo, producto.idproducto])
    .then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject);
  }

  delete(producto){
    return this.db.db.transaction(transaction => {
      let sql = "delete from producto_precio " +
      " where idproducto = ?";
      transaction.executeSql(sql, [producto.idproducto]);
      
      sql = "delete from producto " +
      " where idproducto = ?";

      transaction.executeSql(sql, [producto.idproducto]);
    }).then(res => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }
}
