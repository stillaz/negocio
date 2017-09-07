import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ProductoProvider } from '../providers/producto/producto';
import { InventarioProvider } from '../providers/inventario/inventario';
import { VentaProvider } from '../providers/venta/venta';
import { PersonaProvider } from '../providers/persona/persona';
import { Printer } from '@ionic-native/printer';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ProveedorProvider } from '../providers/proveedor/proveedor';
import { DbProvider } from '../providers/db/db';
import { SQLite } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Printer,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProductoProvider,
    InventarioProvider,
    VentaProvider,
    PersonaProvider,
    UsuarioProvider,
    ProveedorProvider,
    DbProvider,
    Camera
  ]
})
export class AppModule {}
