import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from '../../services/gplan_metas/plan.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { MetasService } from '../../services/gplan_metas/metas.service';
import { PlanModel, MetaModel } from '../../models/metas.model';
@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.css']
})
export class MetasComponent implements OnInit {
  cargando_modal:boolean=true;
  
  cargando_tabla:boolean=true;
  listaMetas:any[]=[];
  accion:string='nuevo';

  //MENSAJES TOAST
  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });


  
  //Variables para estilos
  estiloPorcentaje:any={
    orden:'badge badge-primary',
    estado:'btn btn-primary dropdown-toggle'
  }
 

  lineaBase:any;
  metaTarget:MetaModel={
    pk_meta:0,
    fk_plan:null,
    ejecutado_meta:null,
    planificado_meta:null,
    audit_creacion:null,
    audit_modificacion:null,
    anio_meta:null,
    porcentaje_cumplimiento_meta:null
  }


  //@Output() planTargetChange:EventEmitter<any> = new EventEmitter();
  @Input() planTarget:PlanModel={
    pk_plan:null,
    fk_pntvods:null,
    fk_gad:null,
    categoria_plan:null,
    programa_plan:null,
    anio_base_plan:null,
    anio_meta_plan:null,
    indicador_plan:null,
    pk_compo:null,
    proyecto_plan:null,
    presupuesto_plan:null,
    audit_creacion:null,
    audit_modificacion:null,
    fk_objestra:null,
    fk_compgad:null,
    activo_plan:null,
    linea_base_plan:null,
    unimed_plan:null,
    tipo_va_plan:null,
    meta_plan:null,
    va_anual_plan:null
  }

  constructor(
    public _planService:PlanService,
    public _metasService:MetasService,
    public _settingsService:SettingsService,
    public router:Router,
    public activatedRoute:ActivatedRoute,
    private modalService: NgbModal,
    private configuracionModal: NgbModalConfig
  ) { 
    //Configuracion para abrir el modal con Ng-Bootstrap
    this.configuracionModal.backdrop = 'static';
    this.configuracionModal.keyboard = false;
  }

  ngOnInit() {
    this.inicializacion();
   }

  inicializacion(){
    this.cargando_tabla=true;
    if(this.planTarget.pk_plan !=0 && this.planTarget.pk_plan != null){
       this.cargarMetas(this.planTarget.pk_plan);      
      
    }

  }

  generarMetas(){
    let parametros_metas:any={
      "va":this.planTarget.va_anual_plan,
      "pk_plan":this.planTarget.pk_plan,
      "lb":this.planTarget.linea_base_plan,
      "anio_base":this.planTarget.anio_base_plan,
      "anio_mf":this.planTarget.anio_meta_plan,
      "audit":this._settingsService.getInfoUser()
    }

    swal.fire({
      title: 'Confirmación',
      text: "Desea generar las metas, tenga en cuenta que una vez creadas no podra cambiar información de cabecera del programa ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this._metasService.crearMeta(JSON.stringify(parametros_metas))
        .subscribe((resp:any)=>{
          console.log(JSON.stringify(resp));
          this.inicializacion();
        });
        
      }
    });
   
  }

  semaforizacion(valor:any){
    let clase:any={
      bg:'gray',
      texto:'white'
    };
    if(valor >=0.1 && valor <=69.9){
      clase.bg='red';
      clase.texto='white';
    }else if(valor >=70 && valor <=84.9){
      clase.bg='rgb(247, 211, 9)';
      clase.texto='white';
    }else if(valor >=85 && valor <=101){
      clase.bg='green';
      clase.texto='white';
    }

    return clase;

  }


  cargarMetas(pk_plan){
    this.cargando_tabla=true;
    this._metasService.cargarDatos(pk_plan)
      .subscribe((datos: any) => {
      
        this.listaMetas = Object.values(datos);
        this.cargando_tabla=false;
      })
  }

  reset(meta:any){
    if(meta === '{}'){
      this.accion='ingresar';      
      this.metaTarget={
        pk_meta:0,
        fk_plan:this.planTarget.pk_plan,
        ejecutado_meta:null,
        planificado_meta:null,
        audit_creacion:null,
        audit_modificacion:null,
        anio_meta:null,
        porcentaje_cumplimiento_meta:15
      }
  
    }else{
      this.accion='actualizar';
      this.metaTarget={
        pk_meta:meta.pk_meta,
        fk_plan:meta.fk_plan,
        ejecutado_meta:meta.ejecutado_meta,
        planificado_meta:meta.planificado_meta,
        audit_creacion:meta.audit_creacion,
        audit_modificacion:meta.audit_modificacion,
        anio_meta:meta.anio_meta,
        porcentaje_cumplimiento_meta:meta.porcentaje_cumplimiento_meta
      }
  
    }
  }

  calcularPorcentaje(valor:number){

    
      if(this.planTarget.tipo_va_plan === 'C'){
        this.metaTarget.porcentaje_cumplimiento_meta=(this.metaTarget.ejecutado_meta/this.metaTarget.planificado_meta);
      }else{
        this.metaTarget.porcentaje_cumplimiento_meta=(this.planTarget.linea_base_plan - this.metaTarget.ejecutado_meta)/(this.planTarget.linea_base_plan - this.metaTarget.planificado_meta);
      }
      this.metaTarget.porcentaje_cumplimiento_meta=(this.metaTarget.porcentaje_cumplimiento_meta * 100).toFixed(2);  
      
      if(this.metaTarget.porcentaje_cumplimiento_meta > 100){
        this.metaTarget.porcentaje_cumplimiento_meta=100;
      }
      if(this.metaTarget.ejecutado_meta === null || this.metaTarget.ejecutado_meta === 0){
        this.metaTarget.porcentaje_cumplimiento_meta=null;
      }
    /* }else{
      swal.fire({
        type: 'error',
        title: `El valor ingresado debe ser diferente a 0`,
        showConfirmButton: false,
        timer: 3000
      });
      this.metaTarget.ejecutado_meta=null;
      this.metaTarget.porcentaje_cumplimiento_meta=null;
    } */
  }

  
  open(content,datos) {
    this.reset(datos);   
    this.cargando_modal=false;    
    this.modalService.open(content, { size: 'lg' });   
   }

   guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.metaTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.metaTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }

    //Formato de decimales
    this.metaTarget.ejecutado_meta=Number(this.metaTarget.ejecutado_meta);
    this.metaTarget.planificado_meta=Number(this.metaTarget.planificado_meta);
    this.metaTarget.porcentaje_cumplimiento_meta=Number(this.metaTarget.porcentaje_cumplimiento_meta);
  
    this._metasService.crud(accionLabel,this.metaTarget)
        .subscribe((resp:any)=>{
          this.inicializacion();
          this.close('');
          this.accion='';
          this.reset(resp.data);
          this.accion='';
          this.toast.fire({
            type: 'success',
            title: 'Información de Meta guardada con éxito.'
          })

         this.inicializacion();
          
        });
  
  }



  
   close(content) {
      this.modalService.dismissAll(content);
    }
 
}
