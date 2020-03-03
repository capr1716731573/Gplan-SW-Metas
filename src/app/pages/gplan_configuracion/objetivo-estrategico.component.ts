import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ObjetivoEstrategicoModel, GadModel } from '../../models/metas.model';
import { GadService } from '../../services/gplan_metas/gad.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ObjEstrategicoService } from '../../services/gplan_metas/obj-estrategico.service';

@Component({
  selector: 'app-objetivo-estrategico',
  templateUrl: './objetivo-estrategico.component.html',
  styles: []
})
export class ObjetivoEstrategicoComponent implements OnInit {
  cargando_tabla:boolean=true;
 
  objetivoEstrategicoTarget:ObjetivoEstrategicoModel={
    pk_objestra:0,
    fk_gad:null,
    nombre_objestra:null,
    audit_creacion:null,
    audit_modificacion:null,
    activo_objestra:null
}

  gad:GadModel={
    pk_gad:null,
    nombre:null,
    campo_aux1:null,
    campo_aux2:null,
    activo_gad:null,
    fk_tipgad:null,
    audit_creacion:null,
    audit_modificacion:null
  }


  listaObjetivos:any[]=[];
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

  constructor(public _gadService:GadService,
    public _settingsService:SettingsService,
    public _objetivosService:ObjEstrategicoService,
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
    this.cargarGAD();
  }


  cargarGAD(){
    this._gadService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.gad=datos;
      this.cargarObjetivos();
    })
  }


  cargarObjetivos(){
    this._objetivosService.cargarDatosAll(this.gad.pk_gad)
    .subscribe((datos:any)=>{      
      this.listaObjetivos=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  

  reset(objetivo:any){
    if(objetivo === '{}'){
      this.accion='ingresar';
      this.objetivoEstrategicoTarget={
        pk_objestra:0,
        fk_gad:this.gad.pk_gad,
        nombre_objestra:null,
        audit_creacion:null,
        audit_modificacion:null,
        activo_objestra:true
      }
  
    }else{
      this.accion='actualizar';
      this.objetivoEstrategicoTarget={
        pk_objestra:objetivo.pk_objestra,
        fk_gad:objetivo.fk_gad,
        nombre_objestra:objetivo.nombre_objestra,
        audit_creacion:objetivo.audit_creacion,
        audit_modificacion:objetivo.audit_modificacion,
        activo_objestra:objetivo.activo_objestra
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.objetivoEstrategicoTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.objetivoEstrategicoTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._objetivosService.crud(accionLabel,this.objetivoEstrategicoTarget)
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
        this._objetivosService.crud('D',row)
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
