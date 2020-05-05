import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { SettingsService } from '../settings/settings.service';
import { dominio_ws } from '../../config/configuraciones_globales';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  percentDone: number;
  uploadSuccess: boolean;


  public url_archivos:string=`${dominio_ws}/`;
  url_ws:string=`${dominio_ws}/cargar_archivo`;
  httpHeader=new HttpHeaders();
  constructor(
    public http:HttpClient,
    public _settingsService: SettingsService
    ) { 
      this.httpHeader=this._settingsService.myToken;
     
    }


    subirArchivo( pk_meta:number,archivo:File){
      let url_upload2=`${this.url_ws}/${pk_meta}`;
      //creamos la promesa, que adentro utilizara AJAX
      return new Promise((resolve,reject)=>{
        //Aqui utilizamos Vanilla JS puro
        let formData=new FormData();
        let xhr= new XMLHttpRequest();
        formData.append('imagen_postman',archivo,archivo.name);
        //aqui ejecuto AJAX
        xhr.onreadystatechange=function (){
                 
         if( xhr.readyState === 4){
           if( xhr.status == 200){
            
             console.log('Imagen Subida');
             return resolve(JSON.parse(xhr.response));
           }else{
             console.log('Imagen no subida problemas');
             return reject(JSON.parse(xhr.response));
           }
         }
        };
  
        let url=url_upload2;
  
        xhr.open('POST', url,true);
        //xhr.setRequestHeader("token",this._settingsService.myToken);
        xhr.send( formData);
  
  
      })
   
    }

    subirArchivo2(pk_meta:number,archivo:File){

      //creamos la promesa, que adentro utilizara AJAX
      return new Promise((resolve,reject)=>{
        //Aqui utilizamos Vanilla JS puro
        let formData=new FormData();
        let xhr= new XMLHttpRequest();
  
        formData.append('imagen_postman',archivo,archivo.name);
        //aqui ejecuto AJAX
        xhr.onreadystatechange=function (){
          if( xhr.readyState === 4){
            if( xhr.status == 200){
              console.log('Imagen Subida');
              resolve(JSON.parse(xhr.response));
            }else{
              console.log('Imagen no Subida');
              reject(JSON.parse(xhr.response));
            }
          }
        };
  
        let url=`${this.url_ws}/${pk_meta}`;
        console.log(url);
  
        xhr.open('POST', url,true);
        xhr.send( formData);
  
  
      })
  
   
  
    }
 
}
