import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ComponentesModel } from '../../models/metas.model';
import { ComponentesService } from '../../services/gplan_metas/componentes.service';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.component.html',
  styles: []
})
export class ComponentesComponent implements OnInit {
  cargando_tabla:boolean=true;
  listaComponentes:any[]=[];
  accion='ingresar';

  componenteTarget:ComponentesModel={
    pk_compo:0,
    nombre_compo:null,
    descripcion:null,
    activo_compo:null
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

constructor(public _componenteService:ComponentesService,
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
    this.cargarComponentes();
  }

  cargarComponentes(){
    this._componenteService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaComponentes=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  reset(componente:any){
    if(componente === '{}'){
      this.accion='ingresar';
      this.componenteTarget={
        pk_compo:0,
        nombre_compo:null,
        descripcion:null,
        activo_compo:true
      }
  
    }else{
      this.accion='actualizar';
      this.componenteTarget={
        pk_compo:componente.pk_compo,
        nombre_compo:componente.nombre_compo,
        descripcion:componente.descripcion,
        activo_compo:componente.activo_compo
      }
  
    }
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
     
    }else{ 
     
      accionLabel='U';
    }
  
    this._componenteService.crud(accionLabel,this.componenteTarget)
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
        this._componenteService.crud('D',row)
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
