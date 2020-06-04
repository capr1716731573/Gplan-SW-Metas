import parametrosConexion from 'assets/json/parametros.json'
const host= parametrosConexion.host;
const protocolo= parametrosConexion.protocolo;
const puerto= parametrosConexion.puerto;
//export const directorio_ws_pruebas = `http://localhost:3000`;
export const directorio_ws_pruebas = `${protocolo}://${host}:${puerto}`;

export const dominio_ws = directorio_ws_pruebas;