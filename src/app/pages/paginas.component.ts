import { Component, OnInit } from '@angular/core';
import { MenuPerfilService } from '../services/menu-perfil.service';
import { SettingsService } from '../services/settings/settings.service';

//DECLARAR UNA FUNCION DE UNARCHIVO JQUERY EN OTR ARCHIVO
declare function init_plugins();

@Component({
  selector: 'app-paginas',
  templateUrl: './paginas.component.html',
  styles: []
})
export class PaginasComponent implements OnInit {
  menu:any[]=[];
  constructor(public _menuPerfilService:MenuPerfilService,
              public _settingService:SettingsService) {
    //FUNCION DE ARCHIVO JQUERY QUE BRINDA EFECTOS EN EL DASHBOARD
    init_plugins();
  }

  ngOnInit() {
    //this.cargarMenu();
  }

  cargarMenu(){
    /* this._menuPerfilService.cargarDatos(1)
        .subscribe((menus_datos:any)=>{
           this.menu=Object.values(menus_datos[0].mensaje);
           //this._settingService.crearMenuLocalStorage(this.menu);
           console.log("MENU "+JSON.stringify(this.menu))
        }); */
    
  }

}
