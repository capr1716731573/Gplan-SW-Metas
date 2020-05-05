import { Component, OnInit } from '@angular/core';
import { GadService } from '../../services/gplan_metas/gad.service';
import { PlanService } from '../../services/gplan_metas/plan.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-planes',
  templateUrl: './lista-planes.component.html',
  styles: []
})
export class ListaPlanesComponent implements OnInit {
  cargando_tabla:boolean=true;
  gad:any;
  listaPlanes:any[]=[];
  constructor(
    public _gadService: GadService,
    public _planService:PlanService
  ) { }

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
}
