import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { PersonaProvider } from '../../providers/persona/persona';

/**
 * Generated class for the DetallePersonaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalle-persona',
  templateUrl: 'detalle-persona.html',
})
export class DetallePersonaPage {

  todo: FormGroup;
  nuevo: boolean = true;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private formBuilder: FormBuilder, private persona: PersonaProvider, public toastCtrl: ToastController ) {
    this.form({});
  }

  form(datosPersona){
    this.todo = this.formBuilder.group({
      idpersona: [datosPersona.idpersona, Validators.required],
      nombre: [datosPersona.nombre, Validators.required],
      telefono: [datosPersona.telefono, Validators.required],
      correoelectronico: [datosPersona.correoelectronico]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallePersonaPage');
  }

  getPersona(){
    if(this.todo.value.idpersona){
      this.persona.getById(this.todo.value.idpersona).then(res => {
        if(res){
          this.form(res);
          this.nuevo = false;
        } else{
          this.nuevo = true;
        }
      }).catch(err => alert("Error cargando datos de la persona"));
    }
  }

  guardar(){
    let datosPersona = this.todo.value;
    if(this.nuevo){
      this.todo.patchValue({activo: true});
      this.persona.create(datosPersona).then(res => {
        let toast = this.toastCtrl.create({
          message: 'Los datos de la persona han sido ingresadas',
          duration: 3000,
          position: 'top'
        });
        toast.present()
        this.viewCtrl.dismiss(datosPersona);
      }).catch(err => {
        alert("Error creando persona");
      });
    } else{
      this.persona.update(datosPersona).then(res => {
        let toast = this.toastCtrl.create({
          message: 'Los datos de la persona han sido modificados',
          duration: 3000,
          position: 'top'
        });
        toast.present()
        this.viewCtrl.dismiss(datosPersona);
      }).catch(err => {
        alert("Error modificando datos de la persona");
      });
    }
  }

  cerrar(){
    this.viewCtrl.dismiss({});
  }

}
