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

  getProductosFiltrado(filtro){
    return this.getProductos().then(productos => {
      return Promise.resolve(productos.filter((item) => {
        return item.descripcion.toLowerCase().indexOf(filtro.toLowerCase()) > -1;
      }));
    }).catch(err => Promise.reject(err));
  }

  getProductosGrupedColumnas(columnas){
    let productos = [];
    return this.getProductosGruopedGrupo().then(grupos => {
      let productosFila = [];
      let fila = -1;
      for(let grupo of grupos){
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
    .then((productos) => {
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

  getProductoById(idproducto): any{
    let items = [];
    let sql = 'select p.idproducto, p.descripcion, p.marca, p.grupo, p.alerta, p.imagen, p.cantidad, p.activo, pp.precio from productos p inner join producto_precio pp on p.idproducto = pp.idproducto and pp.activo = 1 where p.idproducto = ? ';
    this.db.ejecutar(sql, [idproducto]).then((res) => {
      res.forEach(producto => {
        items.push(producto);
      });
    }, (err) => {
      alert('error al obtener datos ' + err);
    });

    return items[0];
  }

  getProductos(){
    let sql = 'select p.idproducto, p.descripcion, p.marca, p.grupo, p.alerta, p.imagen, p.cantidad, p.activo, pp.precio from producto p inner join producto_precio pp on p.idproducto = pp.idproducto';
    
    let items = [];
    return this.db.ejecutar(sql, {})
    .then((res) => {
      for(var i = 0; i < res.rows.length; i++){
        items.push(res.rows.item(i));
      }
      return Promise.resolve(items);
    })
    .catch(err => Promise.reject(err));
  }

  getGrupos(): Array<String>{
    let items = [];
    let sql = 'select p.grupo from productos group by p.grupo';
    this.db.ejecutar(sql, {}).then((res) => {
      res.rows.forEach(grupo => {
        items.push(grupo.grupo);
      });
    }, (err) => {
      alert('error al obtener datos ' + err);
    });

    return items;
  }

  getMarcas(): Array<String>{
    let items = [];
    let sql = 'select p.marca from productos group by p.marca';
    this.db.ejecutar(sql, {}).then((res) => {
      res.rows.forEach(marca => {
        items.push(marca.marca);
      });
    }, (err) => {
      alert('error al obtener datos ' + err);
    });

    return items;
  }

  create(producto){
    let sql = "insert into producto(idproducto, descripcion, marca, grupo, alerta, imagen, cantidad, activo) " +
    "values (?, ?, ?, ?, ?, ?, ?, ?)";
    this.db.ejecutar(sql, [producto.idproducto, producto.descripcion, producto.marca, producto.grupo, producto.alerta, producto.imagen, 0, true])
    .then((res)=>{
      sql = "insert into producto_precio(idproducto, precio, descuento, fecha, activo) " +
      "values (?, ?, ?, ?, ?)";
      this.db.ejecutar(sql, [producto.idproducto, producto.precio, 0, new Date(), true])
      .then((res) =>{
        alert("Producto creado");
      }, (err) => {
        alert('error al crear precio' + err);
      });
    }, (err) => {
      alert('error al crear producto' + err);
    });
  }

}
