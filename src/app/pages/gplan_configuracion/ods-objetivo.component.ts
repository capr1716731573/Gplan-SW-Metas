import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { EjeService } from '../../services/gplan_metas/eje.service';
import { SettingsService } from '../../services/settings/settings.service';
import { PntvOdsService } from '../../services/gplan_metas/pntv-ods.service';
import { OdsService } from '../../services/gplan_metas/ods.service';
import { ObjetivoODSModel } from '../../models/metas.model';
@Component({
  selector: 'app-ods-objetivo',
  templateUrl: './ods-objetivo.component.html',
  styles: []
})
export class OdsObjetivoComponent implements OnInit {
  cargando_tabla:boolean=true;
  
  pk_ods:any=null;
  pk_eje:any=null;

  pntv_odsTarget:ObjetivoODSModel={
    pk_pntvods:null,
    fk_obj:null,
    fk_ods:null,
    activo_pntvods:null,
    audit_creacion:null,
    audit_modificacion:null
  }

  listaEje:any[]=[];
  listaOds:any[]=[];
  listaObjetivosPNTV:any[]=[];
  accion='ingresar';
   
  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 6000,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer)
      toast.addEventListener('mouseleave', swal.resumeTimer)
    }
  })

  constructor(public _ejeService:EjeService,
    public _settingsService:SettingsService,
    public _objetivoPNTVService:PntvOdsService,
    public _odsService:OdsService
    ) {
      }


  ngOnInit() {
    this.inicializar();
  }

  inicializar(){
    this.cargarODS();
    this.cargarEjes();
  }

  cargarODS(){
    this._odsService.cargarDatos()
    .subscribe((ods:any)=>{
      this.listaOds=Object.values(ods);
      this.cargando_tabla=false;
    });
  }

  cargarEjes(){
    this._ejeService.cargarDatos()
    .subscribe((ejes:any)=>{
      this.listaEje=Object.values(ejes);
      this.cargando_tabla=false;
    });
  }

  cargarObjetivosPNTV(){
    this.clean();
    if((this.pk_ods != 0 && this.pk_ods != undefined && this.pk_ods != null ) && (this.pk_eje != 0 && this.pk_eje != undefined && this.pk_eje != null )){
      this._objetivoPNTVService.cargarDatosConfig(this.pk_eje,this.pk_ods)
      .subscribe((objetivos:any)=>{
        this.listaObjetivosPNTV=Object.values(objetivos);
        this.cargando_tabla=false;
      });
    }else{
      this.clean();
    }
  }

  clean(){
    this.listaObjetivosPNTV=[];
  }


  guardar(objetivo:any){
  
    let accionLabel;
    let mensaje;
    
      if(objetivo.registro === true ){
        this.pntv_odsTarget.pk_pntvods=objetivo.id;
        this.pntv_odsTarget.audit_modificacion=this._settingsService.getInfoUser();
        accionLabel='D';
        mensaje='Registro eliminado del ODS con el Objetivo.';       
      }else{ 
        accionLabel='I';
        this.pntv_odsTarget.pk_pntvods=0;
        this.pntv_odsTarget.fk_obj=objetivo.pk_obj;
        this.pntv_odsTarget.fk_ods=this.pk_ods;
        this.pntv_odsTarget.activo_pntvods=true;
        this.pntv_odsTarget.audit_creacion=this._settingsService.getInfoUser();
        mensaje='Registro enlazado del ODS con el Objetivo.';        
      }
        
      this._objetivoPNTVService.crud(accionLabel,this.pntv_odsTarget)
          .subscribe((resp:any)=>{
            this.cargarObjetivosPNTV();
            this.accion='';
            this.toast.fire({
              type: 'success',
              title: mensaje
            });
          });
  
  }




}
