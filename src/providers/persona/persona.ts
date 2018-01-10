import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DbProvider } from '../db/db';

/*
  Generated class for the PersonaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PersonaProvider {

  constructor(public db: DbProvider) {
  }

  getById(id){
    let sql = 'select * from persona p where p.idpersona = ? ';
    return this.db.ejecutar(sql, [id]).
    then((res) => {
      for(var i = 0; i < res.rows.length; i++){
        return Promise.resolve(res.rows.item(i));
      }
      return Promise.resolve(null);
    }).catch(err => Promise.reject(err));
  }

  create(persona){
    let sql = 'insert into persona (idpersona, nombre, telefono, correoelectronico) ' +
    'values (?, ?, ?, ?)';
    return this.db.ejecutar(sql, [persona.idpersona, persona.nombre, persona.telefono, persona.correoelectronico])
    .then(() => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

  update(persona){
    let sql = 'update persona set nombre = ?, telefono = ?, correoelectronico = ? ' +
    'where idpersona = ?';
    return this.db.ejecutar(sql, [persona.nombre, persona.telefono, persona.correoelectronico, persona.idpersona])
    .then(() => {
      return Promise.resolve();
    }).catch(err => Promise.reject(err));
  }

}
