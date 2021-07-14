<script lang="ts">

import { onMount,onDestroy } from "svelte";
import VerFotos from "./VerFotos.svelte";
import Loading from "./Loading.svelte";
import {Progress} from "./Utils.js";
import {porcentajeStore,historiaPaciente} from "./Stores.js";



let promiseJson:any=[];




    const getInfoFotos = async ()=>{
        let url:string;
        console.log($historiaPaciente);
        if ($historiaPaciente=="")
        url="https://appsmoya.ngrok.io/adoweb/php/get_fotos.php?database=ado";
        else
        url=`https://appsmoya.ngrok.io/adoweb/php/get_fotos.php?database=ado&historia=${$historiaPaciente}`;
        let response = await fetch(url);
        let progreso = new Progress(response);
        
        let datos = await progreso.progreso();

        //let datos= await response.json();
        return datos;
    }

    
    onMount(()=>{

        promiseJson=getInfoFotos();

    })

   

</script>
<div class="d-flex justify-content-center align-items-center flex-wrap vh-85 pt-2">
{#await promiseJson}
    
   <Loading porcentaje={$porcentajeStore}></Loading>
   
{:then fotos}
    
   {#each fotos as {historia,nombres,foto,identificacion,sexo}}
        
        <VerFotos Nombres={nombres} Historia={historia} Identificacion={identificacion} ImgSrc={foto}/>
       
   {/each}
   
{/await}
</div>

<style>
    .vh-85{height: 85vh;}
</style>