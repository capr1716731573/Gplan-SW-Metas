import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services/settings/settings.service';
import { ODSModel } from '../../models/metas.model';
import { OdsService } from '../../services/gplan_metas/ods.service';
@Component({
  selector: 'app-ods',
  templateUrl: './ods.component.html',
  styles: []
})
export class OdsComponent implements OnInit {
  cargando_tabla:boolean;
  listaODS:any[]=[];
  accion='ingresar';

  ODSTarget:ODSModel={
    pk_ods:null,
    nombre_ods:null,
    descripcion_ods:null,
    logo_ods:null,
    audit_creacion:null,
    audit_modificacion:null,
    auxiliar_ods:null,
    activo_ods:null,
    numeral_ods:null
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


  constructor(public _odsService:OdsService,
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
    this.cargarODS();
  }

  cargarODS(){
    this.cargando_tabla=true;
    this._odsService.cargarDatosAll()
    .subscribe((datos:any)=>{      
      this.listaODS=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  reset(ODS:any){
    if(ODS === '{}'){
      this.accion='ingresar';
      this.ODSTarget={
        pk_ods:0,
        nombre_ods:null,
        descripcion_ods:null,
        logo_ods:null,
        audit_creacion:null,
        audit_modificacion:null,
        auxiliar_ods:null,
        activo_ods:true,
        numeral_ods:null
      }
  
    }else{
      this.accion='actualizar';
      this.ODSTarget={
        pk_ods:ODS.pk_ods,
        nombre_ods:ODS.nombre_ods,
        descripcion_ods:ODS.descripcion_ods,
        logo_ods:ODS.logo_ods,
        audit_creacion:ODS.audit_creacion,
        audit_modificacion:ODS.audit_modificacion,
        auxiliar_ods:ODS.auxiliar_ods,
        activo_ods:ODS.activo_ods,
        numeral_ods:ODS.numeral_ods
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.ODSTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.ODSTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._odsService.crud(accionLabel,this.ODSTarget)
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
        this._odsService.crud('D',row)
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
