import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { PersonaService } from '../../services/persona.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2'
import { PerfilUsuarioService } from '../../services/perfil_usuario.service';
import { EspecialidadUserService } from '../../services/especialidad-user.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { EmpresaUserService } from '../../services/empresa-user.service';
import { EmpresaService } from '../../services/empresa.service';
declare var $:any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  titulo:string='Nuevo Usuario';
  accionModalEspecialidad:string='I';
  accionModalEmpresa:string='I';
  
  cargando_tabla:boolean=true;
  cargando_perfiles_inactivos:boolean=true;
  cargando_perfiles_activos:boolean=true;
  cargando_espec_user:boolean=true;
  cargando_modal:boolean=true;
  id:any='nuevo';
  listaPerfiles:any[]=[];
  listaEspecialidadUsuarios:any[]=[];
  listaEspecialidad:any[]=[];
  listaEmpresaUsuarios:any[]=[];
  listaEmpresa:any[]=[];
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

  especialidadMedicoTarget:especialidadMedicoModel={
    pk_espemed:null,
    pk_user:null,
    pk_espec:null,
    codmsp_espcmed:null,
    senecyt_espcmed:null,
    audit_creacion:null,
    audit_modificacion:null
  }
  
  empresaMedicoTarget:empresaMedicoModel={
    pk_user:null,
    pk_empre:null
  }

  cambiarPassword:boolean=true;
  password1:string=null;
  password2:string=null;

  constructor(public _usuarioService:UsuarioService,
              public _personaService:PersonaService,
              public _settingsService:SettingsService,
              public router:Router,
              public activatedRoute:ActivatedRoute,
              public _perfilUsuarioService:PerfilUsuarioService,
              public _especialidadUsuarios:EspecialidadUserService,
              public _especialidadService:EspecialidadService,
              public _empresaUsuarios:EmpresaUserService,
              public _empresaService:EmpresaService) {
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
                            //console.log('LA PERSONA SI EXISTE');  
                          }else {
                            accionUsuario='I';
                            accionPersona='I';
                            this.usuario.audit_creacion=this._settingsService.getInfoUser();
                            this.persona.audit_creacion=this._settingsService.getInfoUser();
                            //console.log('LA PERSONA NO EXISTE');  
                          }
                          this.accionGuardar(accionPersona,accionUsuario);
                        });
                  }
                });
          }else{
            accionUsuario='U';
            accionPersona='U';
            this.usuario.audit_modificacion=this._settingsService.getInfoUser();
            this.persona.audit_modificacion=this._settingsService.getInfoUser();
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

  //FUNCIONES DEL MODAL ESPECIALIDADES
  cancelarModalEspecilidades(){
    $('#modalEspeMed').modal('hide');
  }

  guardarModalEspecilidades(){
    let accion;
    if(this.accionModalEspecialidad === 'I'){ 
      accion='Ingresado';
      this.especialidadMedicoTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.especialidadMedicoTarget.audit_modificacion=this._settingsService.getInfoUser();
      accion='Actualizado';
    }
    this.especialidadMedicoTarget.pk_user=this.usuario.pk_user;
    this._especialidadUsuarios.crud(this.accionModalEspecialidad,this.especialidadMedicoTarget)
    .subscribe((resp:any) => {
      //swal.fire(`Registro ${accion}!!`)
      swal.fire({
        //position: 'top',
        type: 'success',
        title: `Registro ${accion}!!`,
        showConfirmButton: false,
        timer: 1500
      })
      $('#modalEspeMed').modal('hide');
    });

  }

  insertarModalEspecilidades(){
    this.cargando_modal=true;
    this.resetTargetModalEspecilidades();
    this.accionModalEspecialidad='I';
    this.cargando_modal=false;
   
  }

  resetTargetModalEspecilidades(){
    this.especialidadMedicoTarget={
        pk_espemed:null,
        pk_user:this.usuario.pk_user,
        pk_espec:null,
        codmsp_espcmed:null,
        senecyt_espcmed:null,
        audit_creacion:this._settingsService.getInfoUser(),
        audit_modificacion:null
      }
  }

  eliminarTargetModalEspecilidades(row:any){
    swal.fire({
      title: 'Confirmación',
      text: "Desea eliminar este registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this._especialidadUsuarios.crud('D',row)
            .subscribe((resp:any) => {
              swal.fire({
                //position: 'top',
                type: 'success',
                title: `Registro Eliminado!!`,
                showConfirmButton: false,
                timer: 1500
              })
            });
      }
    })
    
  }

  editarTargetModalEspecilidades(row:any){
    this.cargando_modal=true;
    this.especialidadMedicoTarget=row;
    this.accionModalEspecialidad='U';
    this.cargando_modal=false;
  }

  //FUNCIONES DEL MODAL EMPRESAS
  cancelarModalEmpresas(){
    $('#modalEmpreMed').modal('hide');
  }

  guardarModalEmpresas(){
    let accion;
    if(this.accionModalEmpresa === 'I'){ 
      accion='Ingresado';
    }else{ 
      accion='Actualizado';
    }
    this.empresaMedicoTarget.pk_user=this.usuario.pk_user;
    this._empresaUsuarios.crud(this.accionModalEspecialidad,this.empresaMedicoTarget)
        .subscribe((resp:any) => {
              swal.fire({
                    type: 'success',
                    title: `Registro ${accion}!!`,
                    showConfirmButton: false,
                    timer: 1500
                  })
              $('#modalEmpreMed').modal('hide');
        });

  }

  insertarModalEmpresas(){
    this.cargando_modal=true;
    this.resetTargetModalEmpresas();
    this.accionModalEmpresa='I';
    this.cargando_modal=false;
   
  }

  resetTargetModalEmpresas(){
    this.empresaMedicoTarget={
        pk_user:this.usuario.pk_user,
        pk_empre:null
      }
  }

  eliminarTargetModalEmpresas(row:any){
    swal.fire({
      title: 'Confirmación',
      text: "Desea eliminar este registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this._empresaUsuarios.crud('D',row)
            .subscribe((resp:any) => {
              swal.fire({
                type: 'success',
                title: `Registro Eliminado!!`,
                showConfirmButton: false,
                timer: 1500
              })
            });
      }
    })
    
  }

  editarTargetModalEmpresas(row:any){
    this.cargando_modal=true;
    this.empresaMedicoTarget=row;
    this.accionModalEmpresa='U';
    this.cargando_modal=false;
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

export interface especialidadMedicoModel{
    pk_espemed:number,
    pk_user:number,
    pk_espec:number,
    codmsp_espcmed:string,
    senecyt_espcmed:string,
    audit_creacion:any,
    audit_modificacion:any
}

export interface empresaMedicoModel{
    pk_user:number,
    pk_empre:number
}