import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef  } from '@angular/core';
import { PlanService } from '../../services/gplan_metas/plan.service';
import { SettingsService } from '../../services/settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { OdsService } from '../../services/gplan_metas/ods.service';
import { EjeService } from '../../services/gplan_metas/eje.service';
import { PntvOdsService } from '../../services/gplan_metas/pntv-ods.service';
import { PlanModel, GadModel } from '../../models/metas.model';
import { GadService } from '../../services/gplan_metas/gad.service';
import { ObjEstrategicoService } from '../../services/gplan_metas/obj-estrategico.service';
import { CompetenciasTipogadService } from '../../services/gplan_metas/competencias-tipogad.service';
import { ComponentesService } from '../../services/gplan_metas/componentes.service';
import { MetasComponent } from './metas.component';

//Componente Dinamico a cargar


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styles: []
})
export class PlanComponent implements OnInit   {

  /* VARIABLES DEL COKPONENTE DINAMICO*/
  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  cargando_tabla:boolean=true;
  pk_plan:number=0;
  pk_gad:number=0;
  accion:string='nuevo';

  listaODS:any[]=[];
  listaEjes:any[]=[];
  listaComponentes:any[]=[];
  listaObjetivosPNTV:any[]=[];
  listaObjetivosEstrategicos:any[]=[];
  listaCompetencias:any[]=[];


  pk_ods:any=null;
  pk_eje:any=null;

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

  planTarget:PlanModel={
    pk_plan:0,
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

  componenteDinamico;
  constructor(
    public _planService:PlanService,
    public _settingsService:SettingsService,
    public _odsService:OdsService,
    public _ejeService:EjeService,
    public _objetivoPNTVService:PntvOdsService,
    public _gadService:GadService,
    public _objetivoEstrategicoService:ObjEstrategicoService,
    public _competenciasService:CompetenciasTipogadService,
    public _componenteService:ComponentesService,
    public router:Router,
    public activatedRoute:ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.inicializar();

  }

  inicializar(){
    this.activatedRoute.params.subscribe((params:any) =>{
      this.pk_plan=Number(params['pk_plan']);//es el mismo nombre que las pagesRoutes
      this.pk_gad=Number(params['gad']);

      if((params['pk_plan'] === null || params['pk_plan'] === undefined) || (params['gad'] === null || params['gad'] === undefined || params['gad'] === 0)){
        swal.fire('Los valores de proceso, hito son nulos!!','Falta de Datos','error');
        this.router.navigate(['/']);
      }else{
        this.cargarODS();
        this.cargarEjes();
        this.cargarGAD();
        this.cargarComponentes();
        this.reset(this.pk_plan);
      
      
       
      }
  })    
  }


  cargarGAD(){
    this._gadService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.gad=datos;

      this.cargarObjetivosEstrategicos(this.gad.pk_gad);
      this.cargarCompetencias(this.gad.fk_tipgad);

    })
  }

  cargarComponentes(){
    this._componenteService.cargarDatos()
    .subscribe((datos:any)=>{      
      this.listaComponentes=Object.values(datos);
      this.cargando_tabla=false;
    })
  }

  cargarObjetivosEstrategicos(pk_gad){
    this._objetivoEstrategicoService.cargarDatos(pk_gad)
    .subscribe((objs:any)=>{
      this.listaObjetivosEstrategicos=Object.values(objs);
      this.cargando_tabla=false;
    });
  }

  cargarCompetencias(pk_tipogad){
    this._competenciasService.cargarDatos(pk_tipogad)
    .subscribe((objs:any)=>{
      this.listaCompetencias=Object.values(objs);
      this.cargando_tabla=false;
    });
  }

  cargarODS(){
    this._odsService.cargarDatos()
    .subscribe((ods:any)=>{
      this.listaODS=Object.values(ods);
      this.cargando_tabla=false;
    });
  }

  cargarEjes(){
    this._ejeService.cargarDatos()
    .subscribe((ejes:any)=>{
      this.listaEjes=Object.values(ejes);
      this.cargando_tabla=false;
    });
  }

  limpiarLargoPlazo(){
    if(this.planTarget.tipo_va_plan){
      this.planTarget.anio_meta_plan=    null;
    }
  }

  cargarObjetivosPNTV(){
    this.clean();
    if((this.pk_ods != 0 && this.pk_ods != undefined && this.pk_ods != null ) && (this.pk_eje != 0 && this.pk_eje != undefined && this.pk_eje != null )){
      this._objetivoPNTVService.cargarDatos(this.pk_eje,this.pk_ods)
      .subscribe((objetivos:any)=>{
        this.listaObjetivosPNTV=Object.values(objetivos);
        this.cargando_tabla=false;
      });
    }else{
      this.clean();
    }
  }

  calcularVA(){
   
    if(
      this.planTarget.tipo_va_plan != null &&
      this.planTarget.linea_base_plan != null &&
      this.planTarget.meta_plan != null &&
      this.planTarget.anio_base_plan != null &&
      this.planTarget.anio_meta_plan != null
      ){
        let va:any={
          tipo:this.planTarget.tipo_va_plan,
          lb:this.planTarget.linea_base_plan,
          mf:this.planTarget.meta_plan,
          anio_base:this.planTarget.anio_base_plan,
          anio_mf:this.planTarget.anio_meta_plan
        }
        
        this._planService.calcularVA(JSON.stringify(va))
            .subscribe((r:any)=>{
            
              if(r.mensaje){
                if(r.mensaje.status === 'ok'){
                  this.planTarget.va_anual_plan=r.mensaje.variacion_anual;
                }else{
                  this.toast.fire({
                    type: 'error',
                    title: 'Error al calcular VA, complete toda la información'
                  });
                }
              }
              
            });
    }
   
  }

  clean(){
    this.listaObjetivosPNTV=[];
    this.planTarget.fk_pntvods=null;
  }

  reset(id:number){
    
    if(id === 0){
      this.accion='ingresar';
      this.planTarget={
        pk_plan:0,
        fk_pntvods:null,
        fk_gad:this.pk_gad,
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
        activo_plan:true,
        linea_base_plan:null,
        unimed_plan:'Unidad',
        tipo_va_plan:null,
        meta_plan:null,
        va_anual_plan:null
      }
     
      this.cargando_tabla=false;

    }else{
      this.accion='actualizar';
      this._planService.cargarDatosID(id)
        .subscribe((p:any)=>{
          this.pk_ods=p.pk_ods;
          this.pk_eje=p.pk_eje;
          this._objetivoPNTVService.cargarDatos(this.pk_eje,this.pk_ods)
          .subscribe((objetivos:any)=>{
            this.planTarget={
              pk_plan:p.pk_plan,
              fk_pntvods:p.fk_pntvods,
              fk_gad:p.fk_gad,
              categoria_plan:p.categoria_plan,
              programa_plan:p.programa_plan,
              anio_base_plan:p.anio_base_plan,
              anio_meta_plan:p.anio_meta_plan,
              indicador_plan:p.indicador_plan,
              pk_compo:p.pk_compo,
              proyecto_plan:p.proyecto_plan,
              presupuesto_plan:p.presupuesto_plan,
              audit_creacion:p.audit_creacion,
              audit_modificacion:p.audit_modificacion,
              fk_objestra:p.fk_objestra,
              fk_compgad:p.fk_compgad,
              activo_plan:p.activo_plan,
              linea_base_plan:p.linea_base_plan,
              unimed_plan:p.unimed_plan,
              tipo_va_plan:p.tipo_va_plan,
              meta_plan:p.meta_plan,
              va_anual_plan:p.va_anual_plan
            }
            this.listaObjetivosPNTV=Object.values(objetivos);
            this.cargando_tabla=false;
          });
          
      
          this.cargando_tabla=false;
        });
    }
   
  }

  confirmarGuardar(){
    swal.fire({
      title: 'Confirmación',
      text: "Desea registrar la información del plan?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        if(this.planTarget.anio_meta_plan <= this.planTarget.anio_base_plan ){
          swal.fire({
            //position: 'top',
            type: 'error',
            title: `El Año Base no debe ser mayor que el Año Meta`,
            showConfirmButton: false,
            timer: 1500
          });
        }else{

          this.guardar();
        }
        
      }
    });
  }

  guardar(){
    let accionLabel;
    
    if(this.accion === 'ingresar'){ 
      accionLabel='I';
      this.planTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.planTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }
  
    this._planService.crud(accionLabel,this.planTarget)
        .subscribe((resp:any)=>{
          console.log(JSON.stringify(this.planTarget));
          this.accion='';
          swal.fire({
            //position: 'top',
            type: 'success',
            title: `Registro Guardado Exitosamente!!`,
            showConfirmButton: false,
            timer: 1500
          });

          this.router.navigate(['/plan',resp.data.pk_plan,this.pk_gad]);
          
        });
  
  }

  cancelar(){
    swal.fire({
      title: 'Confirmación',
      text: "Desea salir del formulario de registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
       this.router.navigate(['/plan']);
        
      }
    });
    
  }
  

  asignarComponenteDinamico(component) {
    this.container.clear();
    if(component === 'meta'){
      // create the component factory
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MetasComponent);
      
      // add the component to the view
      const componentRef = this.container.createComponent(componentFactory);
      
      // pass some data to the component
      componentRef.instance.planTarget = this.planTarget;

    }  

  }


}
