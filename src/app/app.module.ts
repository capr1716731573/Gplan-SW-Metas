import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';


//RUTAS
import { APP_ROUTES } from './app.routes';
import { RegisterComponent } from './login/register.component';

//MODULOS
import { PagesModule } from './pages/paginas.module';
import { ServiceModule } from './services/service.module';
import { JwtInterceptor } from './interceptors/JwtInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Loading3Component } from './componentes-reutilizables/loading3/loading3.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NopagefoundComponent,
    RegisterComponent,
    Loading3Component
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    APP_ROUTES,
    PagesModule,
    ServiceModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
