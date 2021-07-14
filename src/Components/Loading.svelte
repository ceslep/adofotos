<script lang="ts">
    import {
    Spinner,
    Progress,
  } from "sveltestrap";

  import {porcentajeStore} from "./Stores.js";
  import { onMount,onDestroy,afterUpdate } from 'svelte';

    export let porcentaje:number;


    const unsubscribe = porcentajeStore.subscribe(value => {
		porcentaje = value;
	});

  onMount(()=>{
    porcentajeStore.set(0);
  });
  onDestroy(unsubscribe);

  afterUpdate(() => {
	
	});
</script>


<div class="text-center">
    <Spinner
      color="secondary"
      size="lg"
      style="width: 5rem; height: 5rem;"
    />
    <br />
    <h4>Cargando...</h4>
    <img src="./assets/onedrive.png" alt="" class="img-fluid" width="25%" />
    <h6>moyaortodoncia@outlook.com</h6>
   
    <Progress animated striped color="warning" value={$porcentajeStore} max={100}>{$porcentajeStore}&nbsp;%</Progress>
  </div>