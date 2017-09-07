import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Proveedor } from './proveedor-class';

/*
  Generated class for the ProveedorProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProveedorProvider {

  items: Array<Proveedor>;

  getProveedores(){
    this.items = [];
    for(let i = 1; i <= 10; i ++){
      this.items.push(new Proveedor(
        i,
        'Proveedor' + i,
        '123',
        'a@a.com'
      ));
    }
    return this.items;
  }

}
