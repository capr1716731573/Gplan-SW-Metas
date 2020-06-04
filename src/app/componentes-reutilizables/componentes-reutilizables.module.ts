import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { ChartsModule } from "ng2-charts";

//COMPONENTES
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { GraficoDonaComponent } from './grafico-dona/grafico-dona.component';
import { Loading1Component } from './loading1/loading1.component';
import { Loading2Component } from './loading2/loading2.component';
import { Loading3Component } from './loading3/loading3.component';


@NgModule({
    declarations:[
       IncrementadorComponent,
       GraficoDonaComponent,
       Loading1Component,
       Loading2Component
    ],
    exports:[
        IncrementadorComponent,
        GraficoDonaComponent,
        Loading1Component,
        Loading2Component
    ],
    imports:[
        FormsModule,
        ChartsModule
    ]
})

export class ComponentesReutilizablesModule { }