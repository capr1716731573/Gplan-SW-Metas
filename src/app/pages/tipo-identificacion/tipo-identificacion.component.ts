import { Component, OnInit } from '@angular/core';
import { TipoIdentificacionService } from '../../services/tipo-identificacion.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-identificacion',
  templateUrl: './tipo-identificacion.component.html',
  styles: []
})
export class TipoIdentificacionComponent implements OnInit {
  cargando_tabla:boolean=true;
  listaTipoIdentificacion:any[]=[];
  tipoIdentificacionTarget:any;
  //para el nuevo registro, los campos varian de acuerdo a la tabla que estas
  new_row:any={
    pk_tipiden:null,
    nombre_tipiden:null
  }
  constructor( public _tipoIdentificacionService:TipoIdentificacionService) { }

  ngOnInit() { 
    this.cargarAll();
  }

  cargarAll(){
    this._tipoIdentificacionService.cargarDatos()
        .subscribe((datos:any)=>{
          this.listaTipoIdentificacion=Object.values(datos);
          console.log(datos);
          this.cargando_tabla=false;
        })
  }

  async editar(row:any){
    	
    const {value: nombre} = await swal.fire({
      title: 'Ingrese la nueva descripción',
      input: 'text',
      inputValue: row.nombre_tipiden,
      inputPlaceholder: row.nombre_tipiden
    })
    
    if (nombre && nombre.length > 0) {
      row.nombre_tipiden=nombre;
      this._tipoIdentificacionService.crud('U',row)
            .subscribe((resp:any) => {
              this.cargarAll();
              swal.fire(`Registro Actualizado!!`)
            });
            
      }else{
        swal.fire(`Falta dato, registro no actualizado!!`)
      }
    }

    async insertar(){
      const row:any={};
      const {value: nombre} = await swal.fire({
      title: 'Ingrese nuevo registro',
      input: 'text',
      inputPlaceholder: 'Ingrese Aqui.'
    })
    
    if (nombre && nombre.length > 0) {
      row.pk_tipiden=0;
      row.nombre_tipiden=nombre;
      
      console.log('ron nombre es : '+JSON.stringify(row));
      this._tipoIdentificacionService.crud('I',row)
            .subscribe((resp:any) => {
              this.cargarAll();
              swal.fire(`Registro Ingresado!!`)
            });
            
      }else{
        swal.fire(`Falta dato, registro no ingresado!!`)
      }
      
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
          this._tipoIdentificacionService.crud('D',row)
              .subscribe((resp:any) => {
                this.cargarAll();
                swal.fire(`Registro Eliminado!!`)
              });
        }
      })
    }
}
