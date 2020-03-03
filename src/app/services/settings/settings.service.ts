import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import * as jwt_decode from "jwt-decode";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SettingsService {
  myToken:any;
  myUser:any;
  myMenu:any;
  claveCryptoJS:string='appsalud';
  ajustes: ajustes={
    temaURl:'assets/css/colors/default.css',
    tema:'default'
  }

  constructor( @Inject(DOCUMENT) private _document) {
    //cargamos ajustes del local storage o por defecto
    //para que funcione en toda la app, tengo que declarar en el app.component.ts
    this.cargarAjustes();
    this.cargarValoresLocalStorage();
   
    console.error("******  ME EJECUTE EN SETTINGS SERVICE *********");
   }

   crearTokenUsuarioLocalStorage(token:any,user:any){
     if(!localStorage.getItem('tokenSalud')){
        //creamos el token
        localStorage.setItem('tokenSalud',token);
        this.myToken=token;
        //guardamos en la variable myuser los datos del usuario
        this.myUser=user;
     }
   }

   cargarValoresLocalStorage(){
     this.myToken=localStorage.getItem('tokenSalud');
     this.myUser=this.getDecodedAccessToken(localStorage.getItem('tokenSalud'));
     if(localStorage.getItem('menuSalud')){
      var bytes  = CryptoJS.AES.decrypt(localStorage.getItem('menuSalud').toString(), this.claveCryptoJS);
      var textoDesencriptado = bytes.toString(CryptoJS.enc.Utf8);
      //console.log("textoEncriptado :"+textoDesencriptado);
      this.myMenu=JSON.parse(textoDesencriptado);
      //this.myMenu=JSON.parse(localStorage.getItem('menuSalud'));
      this.myMenu=this.myMenu[0].mensaje;
     }
      
      
      
     
     
   }

   //validar si token ya expiro
  validarExpiracionToken(token:any){
      if (localStorage.getItem('tokenSalud')){
      let decodedToken=this.getDecodedAccessToken(token);
      let expirationDate = decodedToken.exp; // get token expiration dateTime
      //console.log('EXPIRACION - '+expirationDate);
      if(Number(moment().format('X')) > Number(expirationDate)){
        return false;//token expiro
      }else{
        return true;//token todavia valido
      }
    }
    else{
      return false;
    }
  }

  limpiarTokenUser(){
    if(localStorage.getItem('tokenSalud')){
      localStorage.removeItem('tokenSalud');
      this.myToken={};
      this.myUser={};
      
    }
  }

  limpiarMenuLocalstorage(){
    if(localStorage.getItem('menuSalud')){
      localStorage.removeItem('menuSalud')
    }
    this.myMenu=[];
  }

  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }


  //guardar ajustes en el localstorage
  guardarAjustes(){
    localStorage.setItem('ajustes',JSON.stringify(this.ajustes));
  }

  //cargar austes
  cargarAjustes(){
    if(localStorage.getItem('ajustes')){
      this.ajustes=JSON.parse(localStorage.getItem('ajustes'));
      console.log('Cargando Ajustes del localstorage');
      this.aplicarTema(this.ajustes.tema);
    }else{
      console.log('Usando Valores de Ajustes por defecto');
      this.aplicarTema(this.ajustes.tema);
    }
  }

  //get Info Usuario para auditoria
  getInfoUser(){
    let infoUser=this.getDecodedAccessToken(this.myToken);
    console.log('GETINFOUSER : '+JSON.stringify(this.getDecodedAccessToken(this.myToken)));
    return {
      pk_user:infoUser.usuario.pk_user,
      pk_person:infoUser.usuario.pk_person,
      usuario_user:infoUser.usuario.usuario_user,
      nombre_user:infoUser.usuario.nombres_person,
      apellido_user:infoUser.usuario.apellidos_person,
      fecha:moment().format('YYYY-MM-DD'),
      hora:moment().format('h:mm:ss a')
      
    };
  }

  aplicarTema( tema: string ){
    let url_temas=`assets/css/colors/${ tema }.css`;
    this._document.getElementById('tema_global_desde_index').setAttribute('href', url_temas);

    //seteamos en el servicio las variables del tema
    this.ajustes.tema=tema;
    this.ajustes.temaURl;url_temas;

    //guardamos el tema en el localstorage
    this.guardarAjustes();
   
  }

  crearMenuLocalStorage(menu){
    if(localStorage.getItem('menuSalud')){
      localStorage.removeItem('menuSalud');
    }
    //localStorage.setItem('menuSalud',JSON.stringify(menu));
    localStorage.setItem('menuSalud',CryptoJS.AES.encrypt(JSON.stringify(menu), this.claveCryptoJS));
    console.log(JSON.stringify(menu));
    if(menu.length != 0){
      this.myMenu=menu;
      this.myMenu=this.myMenu[0].mensaje;
      
    }else{
      this.myMenu={};
    }
   

    /* //cryptoJs
    var textoEncriptado = CryptoJS.AES.encrypt(JSON.stringify(menu), this.claveCryptoJS);

    // Desencriptamos
    var bytes  = CryptoJS.AES.decrypt(textoEncriptado.toString(), this.claveCryptoJS);
    var textoDesencriptado = bytes.toString(CryptoJS.enc.Utf8);
    console.log("textoEncriptado :"+textoDesencriptado); */
  }

}

interface ajustes{
  temaURl: string;
  tema:string;
}
