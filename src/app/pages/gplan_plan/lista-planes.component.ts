import { Component, OnInit } from '@angular/core';
import { GadService } from '../../services/gplan_metas/gad.service';
import { PlanService } from '../../services/gplan_metas/plan.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-planes',
  templateUrl: './lista-planes.component.html',
  styles: []
})
export class ListaPlanesComponent implements OnInit {
  //necesario colocar estas variables para la paginacion
  p: number = 1;
  filter:any;
  
  cargando_tabla:boolean=true;
  cargando_reporte:boolean=false;
  gad:any;
  listaPlanes:any[]=[];

  content:string = "";

  constructor(
    public _gadService: GadService,
    public _planService:PlanService,
    public sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private configuracionModal: NgbModalConfig
  ) {
     //Configuracion para abrir el modal con Ng-Bootstrap
     this.configuracionModal.backdrop = 'static';
     this.configuracionModal.keyboard = false;
   }

  ngOnInit() {
    this.cargarGAD();
  }

  cargarGAD(){
    this._gadService.cargarDatos()
        .subscribe((datos:any)=>{
          
          this.gad=datos;
          console.log(JSON.stringify(datos));
          this.cargarPLANES(this.gad.pk_gad);
        })
  }

  cargarPLANES(pk_gad){
    this._planService.cargarDatos(pk_gad)
        .subscribe((datos:any)=>{
          this.listaPlanes=Object.values(datos);
          this.cargando_tabla=false;
        })
  }

  inactivarPlan(row:any){

    let mensaje=`Desea finalizar el Proyecto "${row.proyecto_plan}", tenga en cuenta no que no podrá realizar cambios del proyecto, sus metas y seguimiento de cada una de ellas. `;

    swal.fire({
      title: 'Finalización Proyecto',
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
        this._planService.crud('U',row)
            .subscribe((resp:any) => {
              this.cargarGAD();
              swal.fire(`Registro Actualizado!!`)
        });
        
      }
    });
    
  }

/*   getReport(plan){
    this._planService.getReportePlan(plan.pk_plan)
    .subscribe((datos:any)=>{
      this.close();
      this.content = datos;
      window.open(this.content, '_blank');
    })
  }
 */
  getReport(plan){
    this._planService.pruebaPDF(plan.pk_plan)
    .subscribe((datos:any)=>{
      this.cargando_reporte=false;
      this.content = datos;
      this.close();
      window.open(this.content, '_blank');
    })
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  close() {
    this.modalService.dismissAll('');
  }

}
