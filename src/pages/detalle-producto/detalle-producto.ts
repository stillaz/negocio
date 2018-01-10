import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, AlertController } from 'ionic-angular';
import { ProductoProvider } from '../../providers/producto/producto';
import { ProductoPrecioProvider } from '../../providers/producto-precio/producto-precio';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

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
  nuevo = true;
  todo : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public producto: ProductoProvider, private camera: Camera, private precio: ProductoPrecioProvider, private formBuilder: FormBuilder, private modalCtrl: ModalController, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    let datosProducto = this.navParams.data;
    this.nuevo = !datosProducto.idproducto;
    this.todo = this.formBuilder.group({
      idproducto: [datosProducto.idproducto, Validators.required, this.valorUnico()],
      descripcion: [datosProducto.descripcion, Validators.required],
      marca: [datosProducto.marca, Validators.required],
      grupo: [datosProducto.grupo, Validators.required],
      alerta: [datosProducto.alerta],
      precio: [datosProducto.precio, Validators.required],
      imagen: [datosProducto.imagen],
      activo: [datosProducto.activo]
    });
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
      this.todo.patchValue({imagen: "data:image/jpeg;base64," + imageData});
    }, (err) => {
        alert(err);
    });
  }

  isPresent(obj: any): boolean {
    return obj !== undefined && obj !== null;
  }

  valorUnico(): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} => {
      if(this.isPresent(Validators.required(control))) return null;

      let v = control.value;

      return new Promise((resolve, reject) =>{
        this.producto.getProductoById(v).then(res => {
          resolve( this.nuevo && res ? {valorUnico: true} : null);
        }).catch(err => alert("Error obteniendo datos del producto"));
      });
    }
  }

  cerrar(){
    this.viewCtrl.dismiss();
  }

  menu(tipo) {
    let menu = this.modalCtrl.create('MenuBusquedaPage', {tipo: tipo});
    menu.present();
    menu.onDidDismiss(data => {
      if(tipo == 'Marcas' && data){
        this.todo.patchValue({marca: data});
      } else if(tipo == 'Grupos' && data){
        this.todo.patchValue({grupo: data});
      }
    });
  }

  guardar(){
    let producto = this.todo.value;
    if(this.nuevo){
      this.todo.patchValue({activo: true});
      producto.activo = true;
      this.producto.create(producto).then(res => {
        let toast = this.toastCtrl.create({
          message: 'El producto ha sido creado',
          duration: 3000,
          position: 'top'
        });
        this.viewCtrl.dismiss(toast.present());
      }).catch(err => {
        alert("Error creando producto");
      });
    } else{
      this.producto.update(producto).then(res => {
        let toast = this.toastCtrl.create({
          message: 'El producto ha sido modificado',
          duration: 3000,
          position: 'top'
        });
        this.viewCtrl.dismiss(toast.present());
      }).catch(err => {
        alert("Error modificando producto");
      });
    }
  }

  eliminar(){
    let producto = this.todo.value;
    let alert = this.alertCtrl.create({
      title: 'Eliminar producto',
      message: '¿Desea eliminar el producto ' + producto.descripcion + ' ' + producto.marca + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            this.producto.existsProducto(producto).then(res =>{
              if(res){
                this.todo.patchValue({activo: false});
                this.producto.update(producto).then(res => {
                  let toast = this.toastCtrl.create({
                    message: 'El producto ha sido eliminado',
                    duration: 3000,
                    position: 'top'
                  });
                  this.viewCtrl.dismiss(toast.present());
                }).catch(err => {
                  let toast = this.toastCtrl.create({
                    message: 'Error eliminando el producto',
                    duration: 2000,
                    position: 'top'
                  });
                  toast.present();
                });
              } else{
                this.producto.delete(producto).then(res => {
                  let toast = this.toastCtrl.create({
                    message: 'El producto ha sido eliminado',
                    duration: 3000,
                    position: 'top'
                  });
                  this.viewCtrl.dismiss(toast.present());
                }).catch(err => {
                  let toast = this.toastCtrl.create({
                    message: 'Error eliminando el producto',
                    duration: 2000,
                    position: 'top'
                  });
                  toast.present();
                });
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

}
