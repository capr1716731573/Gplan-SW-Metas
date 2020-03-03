import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { dominio_ws } from '../../config/configuraciones_globales';
import { SettingsService } from '../settings/settings.service';
@Injectable({
  providedIn: 'root'
})
export class TipoGadService {
  url:string=dominio_ws+'/tipo';
  tabla:string='Tipo GAD ';

  constructor(public http:HttpClient,
              public _settingsService:SettingsService) { }

  cargarDatos(){
    let url_ws=`${this.url}`;
    return this.http.get(url_ws)
    .pipe(map((resp:any) =>{
        let dato={};
        if(resp.status === 'error'){
          console.log(`Error - Service Obtener ${this.tabla}: `,resp.message,'error')
          
        }else{
          dato=resp.data;
        }
        return dato;
      }))
      .pipe(catchError( err =>{
        if(err.statusText === 'Unauthorized'){
          swal.fire(
            `Sesión Caducada`,
            'Tiempo de Sesión expirada, dirijase al login del sistema e inicie la sesión nuevamente.',
            'error'
          );
          
        }else{
          swal.fire(
            `Error no controlado en ${this.tabla}`,
            `Revisar Detalle en consola`,
            'error'
          )
        }
        
      
        
        console.log(`Error no controlado - Service Obtener ${this.tabla}= `+ JSON.stringify(err));
        return Observable.throw(err);
      }))
  } 


  
  cargarDatosID(id:number):Observable<any>{
    let url_ws=`${this.url}/${id}`;
    return this.http.get(url_ws)
    .pipe(map((resp:any) =>{
        let dato={};
        if(resp.status === 'error'){
          console.log(`Error - Service Obtener ${this.tabla}: `,resp.message,'error')
          
        }else{
          dato=resp.data;
        }
        return dato;
      }))
      .pipe(catchError( err =>{
        if(err.statusText === 'Unauthorized'){
          swal.fire(
            `Sesión Caducada`,
            'Tiempo de Sesión expirada, dirijase al login del sistema e inicie la sesión nuevamente.',
            'error'
          );
          
        }else{
          swal.fire(
            `Error no controlado en ${this.tabla}`,
            `Revisar Detalle en consola`,
            'error'
          )
        }
        
      
        
        console.log(`Error no controlado - Service Obtener ${this.tabla}= `+ JSON.stringify(err));
        return Observable.throw(err);
      }))
  } 

  crud(opcion:string,json:any):Observable<any>{
    let url_ws=`${this.url}`;
    return this.http.post(url_ws,{opcion:opcion,json:json})
    .pipe(map((resp:any) =>{
        let dato={};
        if(resp.status === 'error'){
          console.log(`Error - Service CRUD ${this.tabla}: `,resp.message,'error')
          
        }else{
          dato=resp.respuesta;
        }
        return dato;
      }))
      .pipe(catchError( err =>{
        if(err.statusText === 'Unauthorized'){
          swal.fire(
            `Sesión Caducada`,
            'Tiempo de Sesión expirada, dirijase al login del sistema e inicie la sesión nuevamente.',
            'error'
          );
          
        }else{
          swal.fire(
            `Error no controlado en ${this.tabla}`,
            `Revisar Detalle en consola`,
            'error'
          )
        }
        
      
        
        console.log(`Error no controlado - Service Obtener ${this.tabla}= `+ JSON.stringify(err));
        return Observable.throw(err);
      }))
  } 
}