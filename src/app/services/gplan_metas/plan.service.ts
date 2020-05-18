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
export class PlanService {
  url:string=dominio_ws+'/plan';
  tabla:string='PLAN GAD ';

  constructor(public http:HttpClient,
              public _settingsService:SettingsService) { }

  cargarDatos(gad:number){
    let url_ws=`${this.url}/gad/${gad}`;
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

  calcularVA(json:any):Observable<any>{
    let url_ws=`${this.url}/variacion_anual`;
    return this.http.post(url_ws,{json:json})
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
  
  getReportePlan(id:number){
    let url_ws=`${this.url}/reporte/${id}`;
    return this.http.get(url_ws)
    .pipe(map((resp:any) =>{
        let dato={};
        if(resp.status === 'error'){
          console.log(`Error - Service Obtener ${this.tabla}: `,resp.message,'error')
        }else{
          dato=resp.data;
        }

        console.log(`El dato es : ${dato}`);
        let FileBlob = this.base64ToBlob(dato, 'text/plain');
        console.log(`El blob es : ${JSON.stringify(FileBlob)}`);
        return this.saveAsPDF(FileBlob, 'xdd');

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


  saveAsPDF(blob: Blob, fileName: string) {
    let file = new Blob([blob], { type: 'application/pdf' });
    let fileURL = URL.createObjectURL(file);
    //FileSaver.saveAs(file, `${fileName}.pdf`);
    return fileURL;
  }

   base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
}

pruebaPDF(pk_plan:number):Observable<any>{
  let url_ws=`${dominio_ws}/reporte/plan/${pk_plan}`;
  return this.http.get(url_ws)
  .pipe(map((resp:any) =>{
      let dato={};
      if(resp.status === 'error'){
        console.log(`Error - Service Obtener ${this.tabla}: `,resp.message,'error')
        
      }else{
        dato=resp;
      }
      console.log(JSON.stringify(dato));

      let FileBlob = this.base64ToBlob(resp.b64, 'text/plain');
      return this.saveAsPDF(FileBlob, 'xdd');
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