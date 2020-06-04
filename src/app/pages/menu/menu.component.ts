import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit {
  listaMenu:any[]=[];
  listaItems:any[]=[];
  listaCabecerasModal:any[]=[];
  cargando_tabla:boolean=true;
  cargando_items:boolean=false;
  cargando_accion:boolean=false;
  class_active:number;
  accion:string='I';
  filterc:string='';

  menuCabecera:menuModel={
    pk_menu:null,
    pk_padre:0,
    nombre_menu:null,
    activo_menu:true,
    ruta_menu:null,
    icono_menu:null
  }

  menuItem:menuModel={
    pk_menu:null,
    pk_padre:null,
    nombre_menu:null,
    activo_menu:true,
    ruta_menu:null,
    icono_menu:null
  }

  menuTarget:menuModel={
    pk_menu:null,
    pk_padre:null,
    nombre_menu:null,
    activo_menu:true,
    ruta_menu:null,
    icono_menu:null
  }

    //MENSAJES TOAST
    toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  

  constructor(public _menuService:MenuService) { }

  ngOnInit() {
    this.cargarMenuCabecera();
  }

  cargarMenuCabecera(){
    this.listaMenu=[];
    this.listaItems=[];
    this._menuService.cargarDatos(0)
        .subscribe((cabeceras:any)=>{
          this.listaMenu=Object.values(cabeceras.data);
          this.cargando_tabla=false;
        });
  }

  seleccionCabecera(cab:any,index:number){
    this.listaItems=[];
    this.cargando_items=true;
    this.class_active=index;
    this.menuTarget.pk_padre=cab.pk_menu;
    this._menuService.cargarDatos(cab.pk_menu)
    .subscribe((cabeceras:any)=>{
      this.listaItems=Object.values(cabeceras.data);
      this.cargando_items=false;
    });
  }

  cargarMenusCabeceras(tipo:string,acc:string,row?:any,index?:number){
   
    this.accion=acc;
    this.listaCabecerasModal=[];
    if(index >= 0) this.class_active=index;
    if(tipo === 'item'){
      
      this.cargando_accion=true;
      this._menuService.cargarDatos(0)
      .subscribe((cabeceras:any)=>{
        this.listaCabecerasModal=Object.values(cabeceras.data);
        this.cargando_accion=false;
      });
    }else{
      this.menuTarget.pk_menu=null;
      this.menuTarget.pk_padre=0;
      this.menuTarget.nombre_menu=null;
      this.menuTarget.activo_menu=true;
      this.menuTarget.ruta_menu=null;
      this.menuTarget.icono_menu=null;
    }

    if(row){
      this._menuService.cargarDatosID(row.pk_menu)
          .subscribe((item:any)=>{
            this.menuTarget=item;
            this.cargando_accion=false;
          });
    }else{
      this.menuTarget.pk_menu=null;
      this.menuTarget.nombre_menu=null;
      this.menuTarget.activo_menu=true;
      this.menuTarget.ruta_menu=null;
      this.menuTarget.icono_menu=null;
    }
    
  }

  resetMenuTarget(){
    this.menuTarget={
      pk_menu:null,
      pk_padre:null,
      nombre_menu:null,
      activo_menu:true,
      ruta_menu:null,
      icono_menu:null
    }
  }

  actualizarItemActivo(item){
    item.activo_menu=!item.activo_menu;
    console.log("El valor es: "+JSON.stringify(item));
    this._menuService.crud('U',item)
        .subscribe((item_actualizado:any)=>{
          this.toast.fire({
            type: 'success',
            title: 'Actualización item '+item.nombre_menu+' realizada.'
          })
        });
    
  }

  guardar(){
    let accion;
    if(this.accion === 'I'){ 
      accion='Ingresado';
    }else{ 
      accion='Actualizado';
    }
    this._menuService.crud(this.accion,this.menuTarget)
    .subscribe((resp:any) => {
      if(this.menuTarget.pk_padre === 0){
        this.cargarMenuCabecera();
      }else if(this.menuTarget.pk_padre > 0){
        this._menuService.cargarDatos(this.menuTarget.pk_padre)
        .subscribe((cabeceras:any)=>{
          this.listaItems=Object.values(cabeceras.data);
          this.cargando_items=false;
        });
      }
      swal.fire({
        type: 'success',
        title: `Registro ${accion}!!`,
        showConfirmButton: false,
        timer: 1500
      })
      $('#modalForm').modal('hide');
    });
  }

  eliminar(row:any){
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
        this._menuService.crud('D',row)
            .subscribe((resp:any) => {
              this.seleccionCabecera(row,this.class_active);         
              swal.fire(`Registro Eliminado!!`)
            });
      }
    })
    
  }

  cancelar(){
    $('#modalForm').modal('hide');
  }

}

export interface menuModel{
  pk_menu:number,
  pk_padre:number,
  nombre_menu:string,
  activo_menu:boolean,
  ruta_menu:string,
  icono_menu:string
}

