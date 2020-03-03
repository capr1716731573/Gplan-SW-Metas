import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TipoGadService } from '../../services/gplan_metas/tipo-gad.service';
import { SettingsService } from '../../services/settings/settings.service';
import { CompetenciasTipogadService } from '../../services/gplan_metas/competencias-tipogad.service';
import { CompetenciasModel, TipoGadModel } from '../../models/metas.model';
@Component({
  selector: 'app-competencias',
  templateUrl: './competencias.component.html',
  styles: []
})
export class CompetenciasComponent implements OnInit {
  cargando_tabla:boolean=true;
 
  tipoGAD:TipoGadModel={
    pk_tipgad:null,
    nombre_tipgad:null,
    audit_creacion:null,
    audit_modificacion:null
  }

  listaTipoGad:any[]=[];
  listaCompetencias:any[]=[];
  accion='ingresar';

  competenciaTarget:CompetenciasModel={
    pk_compgad:0,
    fk_tipgad:null,
    nombre_compgad:null,
    activo_compgad:true,
    audit_creacion:null,
    audit_modificacion:null,
    fuente_compgad:null
}
   
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

  constructor(public _tipoGadService:TipoGadService,
    public _settingsService:SettingsService,
    public _competenciasService:CompetenciasTipogadService,
    public router:Router,
    public activatedRoute:ActivatedRoute,
    private modalService: NgbModal,
    private configuracionModal: NgbModalConfig
    ) {
      this.configuracionModal.backdrop = 'static';
      this.configuracionModal.keyboard = false;
      }


  ngOnInit() {
    this.inicializar();
  }

  inicializar(){
    this.cargarTiposGad();
  }

  cargarTiposGad(){
    this._tipoGadService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaTipoGad=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  cargarCompetencias(dato:any){
    this.tipoGAD=dato;
    this._competenciasService.cargarDatos(dato.pk_tipgad)
    .subscribe((datos:any)=>{      
      this.listaCompetencias=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  

  reset(competencia:any){
    if(competencia === '{}'){
      this.accion='ingresar';
      this.competenciaTarget={
        pk_compgad:0,
        fk_tipgad:this.tipoGAD.pk_tipgad,
        nombre_compgad:null,
        activo_compgad:true,
        audit_creacion:null,
        audit_modificacion:null,
        fuente_compgad:null
      }
  
    }else{
      this.accion='actualizar';
      this.competenciaTarget={
        pk_compgad:competencia.pk_compgad,
        fk_tipgad:competencia.fk_tipgad,
        nombre_compgad:competencia.nombre_compgad,
        activo_compgad:competencia.activo_compgad,
        audit_creacion:competencia.audit_creacion,
        audit_modificacion:competencia.audit_modificacion,
        fuente_compgad:competencia.fuente_compgad
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.competenciaTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.competenciaTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._competenciasService.crud(accionLabel,this.competenciaTarget)
        .subscribe((resp:any)=>{
          this.inicializar();
          this.cargarCompetencias(this.tipoGAD);
          this.accion='';
          this.close('');
          swal.fire({
            //position: 'top',
            type: 'success',
            title: `Registro Guardado Exitosamente!!`,
            showConfirmButton: false,
            timer: 1500
          })
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
        this._competenciasService.crud('D',row)
            .subscribe((resp:any) => {
              this.inicializar();
              this.cargarCompetencias(this.tipoGAD);
              swal.fire(`Registro Eliminado!!`)
        });
        
      }
    });
    
  }

  open(content,datos) {
   
      this.reset(datos);
      this.modalService.open(content, { size: 'lg' });
        
  }
  
   close(content) {
      this.modalService.dismissAll(content);
    }



}
