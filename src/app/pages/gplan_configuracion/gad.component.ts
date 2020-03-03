import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { GadModel } from '../../models/metas.model';
import { TipoGadService } from '../../services/gplan_metas/tipo-gad.service';
import { SettingsService } from '../../services/settings/settings.service';
import { GadService } from '../../services/gplan_metas/gad.service';
@Component({
  selector: 'app-gad',
  templateUrl: './gad.component.html',
  styles: []
})
export class GadComponent implements OnInit {
  cargando_tabla:boolean;
  listaTipoGad:any[]=[];
  accion='ingresar';
  
  gadTarget:GadModel={
    pk_gad:0,
    nombre:null,
    campo_aux1:null,
    campo_aux2:null,
    activo_gad:true,
    fk_tipgad:null,
    audit_creacion:null,
    audit_modificacion:null
}


  constructor(
    public _gadService:GadService,
    public _tipoGadService:TipoGadService,
    public _settingsService:SettingsService) { }

  ngOnInit() {
    this.inicializar();
  }

  inicializar(){
    this.cargarTiposGad();
    this.cargarGAD();
  }

  cargarTiposGad(){
    this.cargando_tabla=true;
    this._tipoGadService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaTipoGad=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  
  cargarGAD(){
    this._gadService.cargarDatos()
    .subscribe((datos:any)=>{  
      if(datos){
        this.gadTarget=datos;
        this.accion='actualizar';
      }else{
        this.accion='ingresar';
      }

    })
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.gadTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.gadTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._gadService.crud(accionLabel,this.gadTarget)
        .subscribe((resp:any)=>{
          this.gadTarget=resp.data;
          
          this.accion='actualizar';
          swal.fire({
            //position: 'top',
            type: 'success',
            title: `Registro Guardado Exitosamente!!`,
            showConfirmButton: false,
            timer: 1500
          });
          
        });
  
  }


}
