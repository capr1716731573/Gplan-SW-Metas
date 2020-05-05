import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsService } from '../services/settings/settings.service';
import swal from 'sweetalert2';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    token:any;
    constructor(public _settingService:SettingsService,
                public router:Router,
                public activatedRoute:ActivatedRoute) { }

    /* intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //Obtengo el token del servicio settings service
        this.token=this._settingService.myToken;
        let tokenValido=this._settingService.validarExpiracionToken(this.token);
        // add authorization header with jwt token if available
        //let currentUser = this.authenticationService.currentUserValue;
        if (tokenValido) {
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.token });
            
                request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.token) });

                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
                
                request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

            /* request = request.clone({
                setHeaders: {
                    token: `${this.token}`
                }
            }); */
        /*}
        else{
            
            swal.fire(
              'Su sesión a expirado',
              'Ingrese sus credenciales',
              'info'
            )
            console.log('Peticion HTTP Rechazada, Token ha expirado!!.');
            //aqui es momentaneo esta redireccion, lo optimo es enviar al login sgh.hgsd.gob.ec
            this.router.navigate(['/login']);
        }

        return next.handle(request);
    } */

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //Obtengo el token del servicio settings service
        this.token=this._settingService.myToken;
        let tokenValido=this._settingService.validarExpiracionToken(this.token);
        
        // add authorization header with jwt token if available
        //let currentUser = this.authenticationService.currentUserValue;
        if (tokenValido) {
            
           
            request = request.clone({
                setHeaders: {
                    //Authorization: `Bearer ${this.token}`
                    token: `${this.token}`
                }
            });
            request.headers.append('token',this.token);
            //console.log('DESDE JWYINTERCEPTOR '+JSON.stringify(request.headers));
            //console.log('DESDE JWYINTERCEPTOR '+request.headers.get('token'));
        }
        else{
            if(this.router.url !=  "/login"){

                swal.fire(
                    'Su sesión a expirado',
                    'Ingrese sus credenciales',
                    'info'
                  )
                  console.log('Peticion HTTP Rechazada, Token ha expirado!!.');
                  //aqui es momentaneo esta redireccion, lo optimo es enviar al login sgh.hgsd.gob.ec
                  this.router.navigate(['/login']);
            }
        }

        return next.handle(request);
    }
}