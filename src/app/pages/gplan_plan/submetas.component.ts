import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { PlanModel, MetaModel, SubmetaModel } from '../../models/metas.model';
import { PlanService } from '../../services/gplan_metas/plan.service';
import { SubmetasService } from '../../services/gplan_metas/submetas.service';
import { MetasService } from '../../services/gplan_metas/metas.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-submetas',
  templateUrl: './submetas.component.html',
  styles: []
})
export class SubmetasComponent implements OnInit {
  cargando_modal:boolean=true;
  pk_plan:number=0;
  pk_meta:number=0;
  temporalidad:number=0;
  
  cargando_tabla:boolean=false;
  listaSubMetas:any[]=[];
  accion:string='nuevo';

  porcentajeFisico:any=0;
  porcentajePresupuesto:any=0;

  submetaTarget:SubmetaModel={
    pk_submeta:0,
    fk_meta:null,
    desde_submeta:null,
    hasta_submeta:null,
    planificado_submeta:null,
    ejecutado_submeta:null,
    presup_plani_submeta:null,
    presup_ejec_submeta:null,
    presup_codif_submeta:null,
    tiempo_submeta:null,
    audit_creacion:null,
    audit_modificacion:null
  }
  
  metaTarget:any={};

  //@Output() planTargetChange:EventEmitter<any> = new EventEmitter();
  planTarget:PlanModel={
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

  //MENSAJES TOAST
  toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(
    public _planService:PlanService,
    public _metasService:MetasService,
    public _submetasService:SubmetasService,
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
    this.activatedRoute.params.subscribe((params:any) =>{
      this.pk_plan=params['plan'];//es el mismo nombre que las pagesRoutes
      this.pk_meta=params['meta'];     
     
      if((params['plan'] === null || params['plan'] === undefined)||
      (params['meta'] === null || params['meta'] === undefined)){
        swal.fire('No existen información del plan y metas!!','Falta de Datos','error');
        this.router.navigate(['/plan']);
      }else{
       this.inicializacion();
      }
  }) 

  }

  inicializacion(){
    this.cargarPlan();
    this.cargarSubmetas();
  }

  cargarPlan(){
    if(this.pk_plan != 0){
      this._planService.cargarDatosID(this.pk_plan)
      .subscribe((datos:any)=>{  
        this.planTarget=datos;    
        this.cargarMeta();
      })
    }
  }

  cargarMeta(){
    if(this.pk_meta != 0){
      this._metasService.cargarDatosID(this.pk_meta)
      .subscribe((meta:any)=>{   
        this.metaTarget=meta;  
      })
    }
  }

  cargarSubmetas(){
      this._submetasService.cargarDatos(this.pk_meta)
      .subscribe((datos:any)=>{ 
        this.listaSubMetas=Object.values(datos);
        this.cargando_tabla=false;
      })
    
  }

  generarSeguimiento(){
    let parametros_seguimiento:any={
      "meta":this.metaTarget.pk_meta,
      "audit_creacion":this._settingsService.getInfoUser(),
      "temporalidad":this.metaTarget.temporalidad_evaluacion_meta
    }

    swal.fire({
      title: 'Confirmación',
      text: "Desea generar el seguimiento, tenga en cuenta que una vez creados los registros aumentar ni disminuir items de seguimiento ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        this._submetasService.crearSeguimiento(JSON.stringify(parametros_seguimiento))
        .subscribe((resp:any)=>{
          console.log(JSON.stringify(resp));
          this.inicializacion();
        });
        
      }
    });
   
  }

  validarFechasAnios (t:number, anioMeta:any, fechaDesde:any, fechaHasta:any):boolean {
    let mesesEvaluacion:number=0;
    if(t === 12) mesesEvaluacion = 360;
    else if(t === 6) mesesEvaluacion = 180;
    else if(t === 4) mesesEvaluacion = 120;
    else if(t === 3) mesesEvaluacion = 90;
    else if(t === 2) mesesEvaluacion = 60;
    else if(t === 1) mesesEvaluacion = 30;

    if( anioMeta !=  moment(fechaDesde).format('YYYY') || anioMeta != moment(fechaDesde).format('YYYY')){
      swal.fire({
        type: 'error',
        title: `El Año de las fechas de evaluación de seguimiento debe ser ${anioMeta}`,
        showConfirmButton: false,
        timer: 5000
      });

      return false;
    }
    
    if( fechaDesde >= fechaHasta ){
      swal.fire({
        type: 'error',
        title: `La fecha final no debe ser menor a la fecha de inicio`,
        showConfirmButton: false,
        timer: 5000
      });
      return false;
    }

    return true;
  }


  calcularPorcentajeValor(){
    this.porcentajeFisico=0;
    if(this.submetaTarget.planificado_submeta === 0 || this.submetaTarget.planificado_submeta === null || this.submetaTarget.planificado_submeta === undefined){
      this.porcentajeFisico=0;
    }else{
      if(this.submetaTarget.ejecutado_submeta === 0 || this.submetaTarget.ejecutado_submeta === null || this.submetaTarget.ejecutado_submeta === undefined){
        this.porcentajeFisico=0;
      }else{
        this.porcentajeFisico=this.submetaTarget.ejecutado_submeta/this.submetaTarget.planificado_submeta;
      }
    }
    this.porcentajeFisico=(this.porcentajeFisico* 100).toFixed(2);
    if(this.porcentajeFisico >= 100){
      this.porcentajeFisico=100.00;
      this.porcentajeFisico=(this.porcentajeFisico).toFixed(2);
    }

   
}

calcularPorcentajePresupuesto(){
  this.porcentajePresupuesto=0;
  if(this.submetaTarget.presup_plani_submeta === 0 || this.submetaTarget.presup_plani_submeta === null || this.submetaTarget.presup_plani_submeta === undefined){
    this.porcentajePresupuesto=0;
  }else{
    if(this.submetaTarget.presup_ejec_submeta === 0 || this.submetaTarget.presup_ejec_submeta === null || this.submetaTarget.presup_ejec_submeta === undefined){
      this.porcentajePresupuesto=0;
    }else{
      this.porcentajePresupuesto=this.submetaTarget.presup_ejec_submeta/this.submetaTarget.presup_plani_submeta;
    }
  }
  this.porcentajePresupuesto=(this.porcentajePresupuesto* 100).toFixed(2);
  if(this.porcentajePresupuesto >= 100){
    this.porcentajePresupuesto=100.00;
    this.porcentajePresupuesto=(this.porcentajePresupuesto).toFixed(2);
  }
}

  semaforizacionValor(valor:any){
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

  semaforizacionDinero(valor:any){
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

  eliminarSeguimiento(row:any){

    let mensaje=`Desea eliminar el seguimiento, tenga en consideración que esta acció provocará cambios en el cálculo del % de ejecución de la meta `;

    swal.fire({
      title: 'Confirmación',
      text: mensaje,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        row.activo_plan=false;
        this._submetasService.crud('D',row)
            .subscribe((resp:any) => {
              this.inicializacion();
              swal.fire(`Registro Eliminado!!`)
        });
        
      }
    });
    
  }



  reset(submeta:any){
    if(submeta === '{}'){
      this.accion='ingresar';      
      this.submetaTarget={
        pk_submeta:0,
        fk_meta:this.pk_meta,
        desde_submeta:moment().format(`${this.metaTarget.anio_meta}-01-01`),
        hasta_submeta:moment().format(`${this.metaTarget.anio_meta}-01-01`),
        planificado_submeta:null,
        ejecutado_submeta:null,
        presup_plani_submeta:0.00,
        presup_ejec_submeta:0.00,
        presup_codif_submeta:0.00,
        tiempo_submeta:this.temporalidad,
        audit_creacion:null,
        audit_modificacion:null
      }
  
    }else{
      this.accion='actualizar';
      this.submetaTarget={
        pk_submeta:submeta.pk_submeta,
        fk_meta:submeta.fk_meta,
        desde_submeta:submeta.desde_submeta,
        hasta_submeta:submeta.hasta_submeta,
        planificado_submeta:submeta.planificado_submeta,
        ejecutado_submeta:submeta.ejecutado_submeta,
        presup_plani_submeta:submeta.presup_plani_submeta,
        presup_ejec_submeta:submeta.presup_ejec_submeta,
        presup_codif_submeta:submeta.presup_codif_submeta,
        tiempo_submeta:submeta.tiempo_submeta,
        audit_creacion:submeta.audit_creacion,
        audit_modificacion:submeta.audit_modificacion
      }

      this.porcentajeFisico=submeta.porcentaje_submeta;
      this.porcentajePresupuesto=submeta.porcentaje_valor;
  
    }
  }

  estaVacio(valor:any){
    if(valor === null || valor === undefined){
      return 0;
    } else{
      return valor;
    }

  }

  confirmarGuardar(){
    //Validacion de fechas y anios
    if(!this.validarFechasAnios(this.submetaTarget.tiempo_submeta,this.metaTarget.anio_meta,this.submetaTarget.desde_submeta,this.submetaTarget.hasta_submeta)){
      return;
    }

    swal.fire({
      title: 'Confirmación',
      text: "Desea registrar información del seguimiento?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        if(this.submetaTarget.desde_submeta > this.submetaTarget.hasta_submeta ){
          swal.fire({
            //position: 'top',
            type: 'error',
            title: `La fecha de inicio no puede ser mayor que la fecha final del seguimiento`,
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
      this.submetaTarget.audit_creacion=this._settingsService.getInfoUser();
    }else{ 
      this.submetaTarget.audit_modificacion=this._settingsService.getInfoUser();
      accionLabel='U';
    }

    this.submetaTarget.planificado_submeta=this.estaVacio(this.submetaTarget.planificado_submeta);
    this.submetaTarget.ejecutado_submeta=this.estaVacio(this.submetaTarget.ejecutado_submeta);
    this.submetaTarget.presup_plani_submeta=this.estaVacio(this.submetaTarget.presup_plani_submeta);
    this.submetaTarget.presup_codif_submeta=this.estaVacio(this.submetaTarget.presup_codif_submeta);
    this.submetaTarget.presup_ejec_submeta=this.estaVacio(this.submetaTarget.presup_ejec_submeta);

    console.log(JSON.stringify(this.submetaTarget));

    this._submetasService.crud(accionLabel,this.submetaTarget)
        .subscribe((resp:any)=>{
          this.inicializacion();
          this.close();
          this.accion='';
          this.reset(resp.data);
          this.accion='';
          this.toast.fire({
            type: 'success',
            title: 'Información de Seguimiento guardada con éxito.'
          })

         this.inicializacion();
          
        });
  
  }

  open(content,datos) {
    console.log(`DATOS ${datos}`);
    if(datos != '{}'){
      this.reset(datos);   
      this.cargando_modal=false;    
      this.modalService.open(content, { size: 'lg' });  
    }else{
    
        
        if( this.temporalidad != 0 ){
          let aux = 12 - Number(this.metaTarget.calculos_totales.suma_tiempo);
          
          if(this.temporalidad > aux ){
            swal.fire({
              //position: 'top',
              type: 'error',
              title: `La temporalidad a crear va a sobrepasar los 12 meses de seguimiento de la meta.`,
              showConfirmButton: false,
              timer: 5000
            });
            this.temporalidad =0 ;
            return;
          }
    
          this.reset(datos);   
          this.cargando_modal=false;    
          this.modalService.open(content, { size: 'lg' });  
       
        }else{
          swal.fire({
            //position: 'top',
            type: 'error',
            title: `Debe seleccionar la temporalidad para crear el seguimiento de la meta.`,
            showConfirmButton: false,
            timer: 5000
          }); 
         
        }
     }
   }

   
   close() {
    this.modalService.dismissAll('');
    this.temporalidad=0;
  }


}
