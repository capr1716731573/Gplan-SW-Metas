export interface GadModel{
    pk_gad:number,
    nombre:string,
    campo_aux1:string,
    campo_aux2:string,
    activo_gad:boolean,
    fk_tipgad:number,
    audit_creacion:any,
    audit_modificacion:any
}

export interface PlanModel{
    pk_plan:number,
    fk_pntvods:number,
    fk_gad:number,
    categoria_plan:string,
    programa_plan:string,
    anio_base_plan:number,
    anio_meta_plan:number,
    indicador_plan:string,
    pk_compo:number,
    proyecto_plan:string,
    presupuesto_plan:any,
    audit_creacion:any,
    audit_modificacion:any,
    fk_objestra:number,
    fk_compgad:number,
    activo_plan:boolean,
    linea_base_plan:any,
    unimed_plan:string,
    tipo_va_plan:string,
    meta_plan:any,
    va_anual_plan:any,
    responsable_plan:string
}

export interface MetaModel{
    pk_meta:number,
    fk_plan:number,
    ejecutado_meta:number,
    planificado_meta:number,
    audit_creacion:any,
    audit_modificacion:any,
    anio_meta:number,
    porcentaje_cumplimiento_meta:any,
    temporalidad_evaluacion_meta:string,
    planificado_presup_meta:number,
    ejecutado_presup_meta:number,
    observacion_meta:String,
    urldoc_meta:String
}

export interface SubmetaModel{
    pk_submeta:number,
    fk_meta:number,
    desde_submeta:any,
    hasta_submeta:any,
    planificado_submeta:number,
    ejecutado_submeta:number,
    presup_plani_submeta:number,
    presup_ejec_submeta:number,
    presup_codif_submeta:number,
    tiempo_submeta:number,
    audit_creacion:any,
    audit_modificacion:any
}

export interface TipoGadModel{
    pk_tipgad:number,
    nombre_tipgad:string,
    audit_creacion:any,
    audit_modificacion:any
}

export interface CompetenciasModel{
    pk_compgad:number,
    fk_tipgad:number,
    nombre_compgad:string,
    activo_compgad:boolean,
    audit_creacion:any,
    audit_modificacion:any,
    fuente_compgad:string
}

export interface ComponentesModel{
    pk_compo:number,
    nombre_compo:string,
    descripcion:string,
    activo_compo:boolean
}

export interface ODSModel{
    pk_ods:number,
    nombre_ods:string,
    descripcion_ods:string,
    logo_ods:string,
    audit_creacion:any,
    audit_modificacion:any,
    auxiliar_ods:string,
    activo_ods:boolean,
    numeral_ods:number
}

export interface EjeModel{
    pk_eje:number,
    nombre_eje:string,
    audit_creacion:any,
    audit_modificacion:any,
    activo_eje:boolean,
    numeral_eje:number
}

export interface Objetivos{
    pk_obj:number,
    fk_eje:number,
    nombre_obj:string,
    audit_creacion:any,
    audit_modificacion:any,
    activo_obj:boolean,
    numeral_obj:number,
}

export interface ObjetivoODSModel{
    pk_pntvods:number,
    fk_obj:number,
    fk_ods:number,
    activo_pntvods:boolean,
    audit_creacion:any,
    audit_modificacion:any
}

export interface ObjetivoEstrategicoModel{
    pk_objestra:number,
    fk_gad:number,
    nombre_objestra:string,
    audit_creacion:any,
    audit_modificacion:any,
    activo_objestra:boolean
}




