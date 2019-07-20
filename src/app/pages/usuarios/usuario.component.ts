import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { PersonaService } from '../../services/persona.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2'
import { PerfilUsuarioService } from '../../services/perfil_usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  titulo:string='Nuevo Usuario';
  
  cargando_tabla:boolean=true;
  cargando_perfiles_inactivos:boolean=true;
  cargando_perfiles_activos:boolean=true;
  id:any='nuevo';
  listaPerfiles:any[]=[];
  //MENSAJES TOAST
  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  
  persona:personaModel={
    pk_person:null,
    pk_tipiden:null,
    numidentificacion_person:null,
    nombres_person:null,
    apellidos_person:null,
    estadocivil_person:null,
    sexo_person:null,
    telefono_person:null,
    celular_person:null,
    correo_person:null,
    pk_ubigeo:null,
    fechanac_person:null,
    direccion_person:null ,
    pk_nivedu:null,
    pk_prof:null,
    ocupacion_person:null ,
    audit_creacion:null,
    audit_modificacion:null
  }

  usuario:usuarioModel={
    pk_user:null,
    pk_person:null,
    usuario_user:null,
    password_user:null,
    password2:null,
    visible_user:true,
    audit_creacion:null,
    audit_modificacion:null
  }
  
  cambiarPassword:boolean=true;
  password1:string=null;
  password2:string=null;

  constructor(public _usuarioService:UsuarioService,
              public _personaService:PersonaService,
              public _settingsService:SettingsService,
              public router:Router,
              public activatedRoute:ActivatedRoute,
              public _perfilUsuarioService:PerfilUsuarioService) {
              this.activatedRoute.params.subscribe(params =>{
                this.id=params['id'];//es el mismo nombre que las pagesRoutes
                if(this.id != 'nuevo'){
                  this.cargarUsuario(this.id);
                  this.cambiarPassword=false;
                  
                }else{
                  this.cambiarPassword=true;
                  this.resetPersona();
                  this.resetUsuario();
                }
              })

               }

  ngOnInit() {
    
  }

  cargarPerfiles(){
    this.cargando_perfiles_inactivos=true;
    this._perfilUsuarioService.cargarDatos(this.usuario.pk_user)
        .subscribe((perfiles:any)=>{
          this.listaPerfiles=Object.values(perfiles);
          this.cargando_perfiles_inactivos=false;
        });
  }

  guardar(){
    swal.fire({
      title: 'Confirmación',
      text: "Desea guardar la información ingresada?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.usuario.usuario_user=this.persona.numidentificacion_person;
        let accionUsuario='I';
        let accionPersona='I';
        if(this.verificarPassword()){
          if(this.id === 'nuevo'){
            accionUsuario='I'
            this._usuarioService.validarExistenciaPersona(this.persona.numidentificacion_person)
                .subscribe((num:any)=>{
                  if(Number(num.numpersona) > 0){
                    swal.fire(
                      'Aviso!!',
                      'La persona a ser ingresada ya tiene asignado un usuario, favor revisar!!',
                      'error'
                    )
                    console.log('LA PERSONA TIENE ATADO UN USUARIO');
                    
                  }else{
                    console.log('LA PERSONA NO TIENE ATADO UN USUARIO');
                    this._personaService.validarCantidadPersonaXNumDoc(this.persona.numidentificacion_person)
                        .subscribe((num:any)=>{
                          if(Number(num.numpersona) > 0){
                            accionUsuario='I';
                            accionPersona='U';
                            this.usuario.audit_creacion=this._settingsService.getInfoUser();
                            this.persona.audit_modificacion=this._settingsService.getInfoUser();
                            console.log('LA PERSONA SI EXISTE');  
                          }else {
                            accionUsuario='I';
                            accionPersona='I';
                            this.usuario.audit_creacion=this._settingsService.getInfoUser();
                            this.persona.audit_creacion=this._settingsService.getInfoUser();
                            console.log('LA PERSONA NO EXISTE');  
                          }
                          this.accionGuardar(accionPersona,accionUsuario);
                        });
                  }
                });
          }else{
            accionUsuario='U';
            accionPersona='U';
            this.accionGuardar(accionPersona,accionUsuario);
          }
            
          
        }
        
      }
    })
  }


  accionGuardar(accionPersona,accionUsuario){
   
        this._personaService.crud(accionPersona,this.persona)
        .subscribe((per:any)=>{
          console.log(JSON.stringify(per));
          this.usuario.pk_person=per.data.pk_person;
          console.log(JSON.stringify(this.usuario));
          this._usuarioService.crud(accionUsuario,this.usuario)
              .subscribe((usu:any)=>{
                this.router.navigate(['/usuarios']);
                swal.fire(
                  'Aviso!!',
                  'La información se ha guardado exitosamente!!',
                  'success'
                )
              });//FIN CRUD USUARIO

        });//FIN CRUD PERSONA
       
    
         

  }

  verificarPassword(){
    let resp:boolean=true;
    if(this.cambiarPassword){
      
      if(this.password2 === this.password1){
        this.usuario.password_user=this.password1;
            
      }else{
        swal.fire(
          'Error',
          'La Contraseña y su confirmación deben coincidir.',
          'error'
        )
        resp=false;
      }
            
    }
    return resp;
  }

  limpiarPassword(){
    this.cambiarPassword=!this.cambiarPassword;
    this.password1=null;
    this.password2=null;
  }

  cargarUsuario(id:number){
    this._usuarioService.cargarDatosID(id)
    .subscribe((usu:any)=>{
      this.usuario={
        pk_user:usu.pk_user,
        pk_person:usu.pk_person,
        usuario_user:usu.usuario_user,
        password_user:usu.password_user,
        password2:usu.password_user,
        visible_user:usu.visible_user,
        audit_creacion:usu.audit_creacion,
        audit_modificacion:usu.audit_modificacion
      }
      this.cargarPersona(this.usuario.pk_person);
      this.cargarPerfiles();
    });
  }

  cargarPersona(id:number){
    this._personaService.cargarDatosID(id)
        .subscribe((person:any)=>{
          this.persona=person;
          //doy formato a la fecha
          this.persona.fechanac_person=moment(this.persona.fechanac_person).format('YYYY-MM-DD');
          
        });
  }

  
  resetPersona(){
   this.persona={
      pk_person:null,
      pk_tipiden:null,
      numidentificacion_person:null,
      nombres_person:null,
      apellidos_person:null,
      estadocivil_person:null,
      sexo_person:null,
      telefono_person:null,
      celular_person:null,
      correo_person:null,
      pk_ubigeo:null,
      fechanac_person:null,
      direccion_person:null ,
      pk_nivedu:null,
      pk_prof:null,
      ocupacion_person:null ,
      audit_creacion:null,
      audit_modificacion:null
    }
  }

  resetUsuario(){
    this.usuario={
      pk_user:null,
      pk_person:null,
      usuario_user:null,
      password_user:null,
      password2:null,
      visible_user:true,
      audit_creacion:null,
      audit_modificacion:null
    }
  }

  addMenuPerfil(item:any){
    
    let user=this._settingsService.getInfoUser();
    let item_new:any={
      pk_perfil:item.pk_perfil,
      pk_user:this.usuario.pk_user,
      audit_creacion:user,
      audit_modificacion:user
    }
    console.error('ADD: '+JSON.stringify(item_new));
    this._perfilUsuarioService.crud('I',item_new)
        .subscribe((resp:any)=>{
          this.toast.fire({
            type: 'success',
            title: 'Perfil agregado a usuario'
          })
          this.cargarPerfiles();
    });
  }

  deleteMenuPerfil(item:any){
    
    let item_new:any={
      pk_perfil:item.pk_perfil,
      pk_user:this.usuario.pk_user
    }
    console.error('DELETE: '+JSON.stringify(item_new));
    this._perfilUsuarioService.crud('D',item_new)
        .subscribe((resp:any)=>{
          this.toast.fire({
            type: 'success',
            title: 'Perfil removido de usuario'
          })
          this.cargarPerfiles();
    });
  }

}

export interface personaModel{
  pk_person:number,
  pk_tipiden:number,
  numidentificacion_person:string,
  nombres_person:string,
  apellidos_person:string,
  estadocivil_person:string,
  sexo_person:string,
  telefono_person:string,
  celular_person:string,
  correo_person:string,
  pk_ubigeo:number,
  fechanac_person:any,
  direccion_person:string ,
  pk_nivedu:number,
  pk_prof:number,
  ocupacion_person:string ,
  audit_creacion:any,
  audit_modificacion:any
}

export interface usuarioModel{
  pk_user:number,
  pk_person:number,
  usuario_user:string,
  password_user:string,
  password2:string,
  visible_user:boolean,
  audit_creacion:any,
  audit_modificacion:any
}
