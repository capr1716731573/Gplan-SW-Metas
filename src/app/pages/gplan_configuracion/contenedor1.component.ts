import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CompetenciasComponent } from './competencias.component';
import { ComponentesComponent } from './componentes.component';
import { TipoGadComponent } from './tipo-gad.component';

@Component({
  selector: 'app-contenedor1',
  templateUrl: './contenedor1.component.html',
  styles: []
})
export class Contenedor1Component implements OnInit, AfterViewInit {
 
   /* VARIABLES DEL COKPONENTE DINAMICO*/
   @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
   componenteDinamico;

  constructor( private componentFactoryResolver: ComponentFactoryResolver ) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TipoGadComponent);      
    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);
  }

  asignarComponenteDinamico(component) {
    this.container.clear();
    if(component === 'tipogad'){
      // create the component factory
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TipoGadComponent);
      
      // add the component to the view
      const componentRef = this.container.createComponent(componentFactory);
      
      // pasar datos al componente o ejecutar funciones del mismo
      //componentRef.instance.planTarget = this.planTarget;

    }  
    else  if(component === 'competencias'){
      // create the component factory
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompetenciasComponent);
      
      // add the component to the view
      const componentRef = this.container.createComponent(componentFactory);
      
      // pasar datos al componente o ejecutar funciones del mismo
      //componentRef.instance.planTarget = this.planTarget;

    }  

    else  if(component === 'componentes'){
      // create the component factory
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentesComponent);
      
      // add the component to the view
      const componentRef = this.container.createComponent(componentFactory);
      
      // pasar datos al componente o ejecutar funciones del mismo
      //componentRef.instance.planTarget = this.planTarget;

    }  

  }

  
}
