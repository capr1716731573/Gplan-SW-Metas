import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '../../services/settings/settings.service';
import { EjeModel } from '../../models/metas.model';
import { EjeService } from '../../services/gplan_metas/eje.service';
@Component({
  selector: 'app-eje',
  templateUrl: './eje.component.html',
  styles: []
})
export class EjeComponent implements OnInit {
  cargando_tabla:boolean;
  listaEje:any[]=[];
  accion='ingresar';

  EjeTarget:EjeModel={
    pk_eje:null,
    nombre_eje:null,
    audit_creacion:null,
    audit_modificacion:null,
    activo_eje:null,
    numeral_eje:null
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
    this._ejeService.cargarDatosAll()
    .subscribe((datos:any)=>{      
      this.listaEje=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  reset(eje:any){
    if(eje === '{}'){
      this.accion='ingresar';
      this.EjeTarget={
        pk_eje:0,
        nombre_eje:null,
        audit_creacion:null,
        audit_modificacion:null,
        activo_eje:true,
        numeral_eje:null
      }
  
    }else{
      this.accion='actualizar';
      this.EjeTarget={
        pk_eje:eje.pk_eje,
        nombre_eje:eje.nombre_eje,
        audit_creacion:eje.audit_creacion,
        audit_modificacion:eje.audit_modificacion,
        activo_eje:eje.activo_eje,
        numeral_eje:eje.numeral_eje
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.EjeTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.EjeTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._ejeService.crud(accionLabel,this.EjeTarget)
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
        this._ejeService.crud('D',row)
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
