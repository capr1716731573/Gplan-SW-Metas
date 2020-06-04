import { Component, OnInit, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { SettingsService } from '../services/settings/settings.service';
import { MenuPerfilService } from '../services/menu-perfil.service';
import {ViewChild} from '@angular/core'; 

declare var VANTA;

//DECLARAR UNA FUNCION DE UNARCHIVO JQUERY EN OTR ARCHIVO
declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("modal",{static:true}) modal: TemplateRef<any>;

  usuario:string;
  pass:string;

  constructor( public router: Router,
               public _loginService: LoginService,
               public _settingsService:SettingsService,
               public _menuPerfilService:MenuPerfilService,
               private modalService: NgbModal,
               private configuracionModal: NgbModalConfig
               ) {
                 this.configuracionModal.backdrop = 'static';
                 this.configuracionModal.keyboard = false;
                 }
  ngAfterViewInit(){
    let elementRef = this.modal.elementRef;
  }

  ngOnInit() {
    
    init_plugins();
    //se activa cuando utilice fondo de pantala con js
    /* VANTA.CELLS({
      el: "#fondo",
      color1: 0x4dff,
      color2: 0x35f2ef,
      size: 2.30,
      speed: 3.00
  }) */
  }

  ingresar(){
    let nombres_user;
    this.open(this.modal);
    this._loginService.login(this.usuario,this.pass)
    .subscribe((resp:any) => {
      
      //this._settingsService.crearTokenUsuarioLocalStorage(resp.token,resp.usuario);
      nombres_user=`${resp.usuario.nombres_person} ${resp.usuario.apellidos_person}`
      //SI SE LOGUEA BIEN, CONSULTA LOS PERFILES Y MENU DE ESE USUARIO Y SI TIENE PERFIL ASIGNADO
      //ENTRA AL SISTEMA SINO SALE UN MENSAJE DE COMUNIQUESE CON ADMINISTRADOR DEL SISTEMA
      console.log('EL LOGINN ES : '+JSON.stringify(resp));
      this._menuPerfilService.cargarMenu(resp.usuario.pk_user)
         .subscribe((menus_datos:any)=>{
           
            this._settingsService.crearMenuLocalStorage(Object.values(menus_datos));
            //console.log(JSON.stringify(menus_datos));
            this.close('');
            swal.fire(
              'Correcto',
              'Bienvenido al sistema '+nombres_user,
              'success'
            )
           
           
            //codigo para direccionar rutas asi como el routerlink en el html
            this.router.navigate([ '/dashboard' ]);
            //this.cargando=false;
            
         });
      
    },
    (error:any)=>{
      this.close('');
    });
   
  }


  open(content) {
    this.modalService.open(content, { size: 'lg' });
   }
  
   close(content) {
      this.modalService.dismissAll(content);
    }


}
