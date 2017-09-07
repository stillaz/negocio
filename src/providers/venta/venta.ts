import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


/*
  Generated class for the VentasProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class VentaProvider {

  items: any[];

  getVentas(): any[]{
    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        fecha: i.toString(),
        ventas: Math.floor(Math.random() * 100),
        totalVentas: Math.floor(Math.random() * 100000)
      });
    }
    return this.items;
  }
}
