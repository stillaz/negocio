import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the DetalleProductoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-producto',
  templateUrl: 'detalle-producto.html',
})
export class DetalleProductoPage {

  datosProducto: any;
  editar = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public producto: ProductoProvider, private camera: Camera) {
    this.datosProducto = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleProductoPage');
  }

  sacarFoto(){
    let cameraOptions : CameraOptions = {
        quality: 50,
        encodingType: this.camera.EncodingType.JPEG, 
        targetWidth: 1000,
        targetHeight: 1000,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        correctOrientation: true
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
        this.datosProducto.imagen = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        alert(err);
    });
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

  guardar(){
    this.producto.create(this.datosProducto);
  }

}
