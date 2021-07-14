import {writable,readable} from "svelte/store";

export const porcentajeStore = writable(0);
export const imagesrc=writable('');
export const historiaPaciente=writable('');
export const basePath=readable('fotos/');