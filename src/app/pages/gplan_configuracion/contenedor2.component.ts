import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { OdsComponent } from './ods.component';
import { EjeComponent } from './eje.component';
import { ObjetivoComponent } from './objetivo.component';
import { OdsObjetivoComponent } from './ods-objetivo.component';

@Component({
  selector: 'app-contenedor2',
  templateUrl: './contenedor2.component.html',
  styles: []
})
export class Contenedor2Component implements OnInit {
 /* VARIABLES DEL COKPONENTE DINAMICO*/
 @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
 componenteDinamico;

constructor( private componentFactoryResolver: ComponentFactoryResolver ) { }

ngOnInit() {}

ngAfterViewInit(): void {
  const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OdsComponent);      
  // add the component to the view
  const componentRef = this.container.createComponent(componentFactory);
}

asignarComponenteDinamico(component) {
  this.container.clear();
  if(component === 'ODS'){
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OdsComponent);
    
    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);
    
    // pasar datos al componente o ejecutar funciones del mismo
    //componentRef.instance.planTarget = this.planTarget;

  }  
   else if(component === 'Ejes'){
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EjeComponent);
    
    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);
    
    // pasar datos al componente o ejecutar funciones del mismo
    //componentRef.instance.planTarget = this.planTarget;

  }  

  else  if(component === 'Objetivos'){
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ObjetivoComponent);
    
    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);
    
    // pasar datos al componente o ejecutar funciones del mismo
    //componentRef.instance.planTarget = this.planTarget;

  }  

  else  if(component === 'PDOT'){
    // create the component factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OdsObjetivoComponent);
    
    // add the component to the view
    const componentRef = this.container.createComponent(componentFactory);
    
    // pasar datos al componente o ejecutar funciones del mismo
    //componentRef.instance.planTarget = this.planTarget;

  }  
 
}


}
