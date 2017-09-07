import { Injectable } from '@angular/core';
import { Usuario } from './usuario-class';
import 'rxjs/add/operator/map';

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UsuarioProvider {

  items: Array<Usuario>;

  getUsuarios(){
    this.items = [];
    let valor = true;
    for(let i = 1; i <= 3; i++) {
      valor = !valor;
      this.items.push(new Usuario(
        i,
        'usuario' + i,
        'clave' + i,
        valor ? 'Administrador' : 'Otro',
        i,
        valor
        ));
    }
    return this.items;
  }

}
