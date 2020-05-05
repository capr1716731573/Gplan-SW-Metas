import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import swal from 'sweetalert2'
import { SettingsService } from '../services/settings/settings.service';
import { MenuPerfilService } from '../services/menu-perfil.service';
declare var VANTA;

//DECLARAR UNA FUNCION DE UNARCHIVO JQUERY EN OTR ARCHIVO
declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:string;
  pass:string;

  constructor( public router: Router,
               public _loginService: LoginService,
               public _settingsService:SettingsService,
               public _menuPerfilService:MenuPerfilService
               ) { }

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
    this._loginService.login(this.usuario,this.pass)
    .subscribe((resp:any) => {
      //console.log(JSON.stringify(resp));
      //this._settingsService.crearTokenUsuarioLocalStorage(resp.token,resp.usuario);
      nombres_user=`${resp.usuario.nombres_person} ${resp.usuario.apellidos_person}`
      //SI SE LOGUEA BIEN, CONSULTA LOS PERFILES Y MENU DE ESE USUARIO Y SI TIENE PERFIL ASIGNADO
      //ENTRA AL SISTEMA SINO SALE UN MENSAJE DE COMUNIQUESE CON ADMINISTRADOR DEL SISTEMA

      this._menuPerfilService.cargarMenu(this._settingsService.getInfoUser().pk_user)
         .subscribe((menus_datos:any)=>{
           
            this._settingsService.crearMenuLocalStorage(Object.values(menus_datos));
            //console.log(JSON.stringify(menus_datos));
            swal.fire(
              'Correcto',
              'Bienvenido al sistema '+nombres_user,
              'success'
            )
           
           
            //codigo para direccionar rutas asi como el routerlink en el html
            this.router.navigate([ '/dashboard' ]);
            //this.cargando=false;
            
         });

     
    });
   
  }

}
