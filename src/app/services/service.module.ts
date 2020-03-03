import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService,SidebarService,SharedService } from "./services.index";
import { GeografiaService } from './geografia.service';
import { TipoIdentificacionService } from './tipo-identificacion.service';
import { ProfesionesService } from './profesiones.service';
import { NivelEducacionService } from './nivel-educacion.service';
import { PerfilService } from './perfil.service';
import { TipoExamenService } from './tipo-examen.service';
import { TipoOrganosSistemasService } from './tipo-organos-sistemas.service';
import { AuxiliarDiagnosticoService } from './auxiliar-diagnostico.service';
import { Cie10Service } from './cie10.service';
import { EmpresaService } from './empresa.service';
import { PersonaService } from './persona.service';
import { UsuarioService } from './usuario.service';
import { MenuService } from './menu.service';
import { MenuPerfilService } from './menu-perfil.service';
import { PerfilUsuarioService } from './perfil_usuario.service';
import { EspecialidadUserService } from './especialidad-user.service';
import { TipoVacunasService } from './tipo-vacunas.service';
import { ExamenAuxiliarDiagnosticoService } from './examen-auxiliar-diagnostico.service';
import { AgendaService } from './agenda.service';
import { GadService } from './gplan_metas/gad.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    SettingsService,
    SidebarService,
    SharedService,
    GeografiaService,
    TipoIdentificacionService,
    ProfesionesService,
    NivelEducacionService,
    PerfilService,
    TipoExamenService,
    TipoOrganosSistemasService,
    AuxiliarDiagnosticoService,
    Cie10Service,
    EmpresaService,
    PersonaService,
    UsuarioService,
    MenuService,
    MenuPerfilService,
    PerfilUsuarioService,
    EspecialidadUserService,
    TipoExamenService,
    TipoVacunasService,
    ExamenAuxiliarDiagnosticoService,
    AgendaService,
    //GPLAN SERVICES
    GadService,
  ],
  declarations: []
})
export class ServiceModule { }