import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services/settings/settings.service';
import { TipoGadModel } from '../../models/metas.model';
import { TipoGadService } from '../../services/gplan_metas/tipo-gad.service';

@Component({
  selector: 'app-tipo-gad',
  templateUrl: './tipo-gad.component.html',
  styles: []
})
export class TipoGadComponent implements OnInit {
  cargando_tabla:boolean;
  listaTipoGad:any[]=[];
  accion='ingresar';

  tipoGADTarget:TipoGadModel={
    pk_tipgad:null,
    nombre_tipgad:null,
    audit_creacion:null,
    audit_modificacion:null
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
    this.cargando_tabla=true;
    this._tipoGadService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaTipoGad=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  reset(tipoGAD:any){
    if(tipoGAD === '{}'){
      this.accion='ingresar';
      this.tipoGADTarget={
        pk_tipgad:0,
        nombre_tipgad:null,
        audit_creacion:null,
        audit_modificacion:null
      }
  
    }else{
      this.accion='actualizar';
      this.tipoGADTarget={
        pk_tipgad:tipoGAD.pk_tipgad,
        nombre_tipgad:tipoGAD.nombre_tipgad,
        audit_creacion:tipoGAD.audit_creacion,
        audit_modificacion:tipoGAD.audit_modificacion
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.tipoGADTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.tipoGADTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._tipoGadService.crud(accionLabel,this.tipoGADTarget)
        .subscribe((resp:any)=>{
          this.inicializar();
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
        this._tipoGadService.crud('D',row)
            .subscribe((resp:any) => {
              this.inicializar();
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
