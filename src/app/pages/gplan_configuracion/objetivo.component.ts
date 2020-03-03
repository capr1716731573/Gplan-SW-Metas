import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EjeModel, Objetivos } from '../../models/metas.model';
import { EjeService } from '../../services/gplan_metas/eje.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ObjetivosService } from '../../services/gplan_metas/objetivos.service';
@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styles: []
})
export class ObjetivoComponent implements OnInit {
  cargando_tabla:boolean=true;
 
  EjeTarget:EjeModel={
    pk_eje:null,
    nombre_eje:null,
    audit_creacion:null,
    audit_modificacion:null,
    activo_eje:null,
    numeral_eje:null
  }


  listaEje:any[]=[];
  listaObjetivos:any[]=[];
  accion='ingresar';

  objetivoTarget:Objetivos={
    pk_obj:0,
    fk_eje:null,
    nombre_obj:null,
    audit_creacion:null,
    audit_modificacion:null,
    activo_obj:null,
    numeral_obj:null,
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

  constructor(public _ejeService:EjeService,
    public _settingsService:SettingsService,
    public _objetivosService:ObjetivosService,
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
    this.cargarEjes();
  }

  cargarEjes(){
    this._ejeService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaEje=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  cargarObjetivos(dato:any){
    this.EjeTarget=dato;
    this._objetivosService.cargarDatosAll(dato.pk_eje)
    .subscribe((datos:any)=>{      
      this.listaObjetivos=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  

  reset(objetivo:any){
    if(objetivo === '{}'){
      this.accion='ingresar';
      this.objetivoTarget={
        pk_obj:0,
        fk_eje:this.EjeTarget.pk_eje,
        nombre_obj:null,
        audit_creacion:null,
        audit_modificacion:null,
        activo_obj:true,
        numeral_obj:null
      }
  
    }else{
      this.accion='actualizar';
      this.objetivoTarget={
        pk_obj:objetivo.pk_obj,
        fk_eje:objetivo.fk_eje,
        nombre_obj:objetivo.nombre_obj,
        audit_creacion:objetivo.audit_creacion,
        audit_modificacion:objetivo.audit_modificacion,
        activo_obj:objetivo.activo_obj,
        numeral_obj:objetivo.numeral_obj,
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.objetivoTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.objetivoTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._objetivosService.crud(accionLabel,this.objetivoTarget)
        .subscribe((resp:any)=>{
          this.inicializar();
          this.cargarObjetivos(this.EjeTarget);
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
              this.cargarObjetivos(this.EjeTarget);
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
