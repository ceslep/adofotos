<script lang="ts">
    import {onMount} from "svelte";
    import {  historiaPaciente } from "./Stores.js";
    import { navigate } from "svelte-routing";
    import {
        Button,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle,
        Spinner,
        Modal,
        ModalHeader,
        ModalFooter,
        ModalBody,
        Input,
        Label,
        FormGroup,
        ListGroup,
        ListGroupItem,
    } from "sveltestrap";

    let criterio: string;
    let buscando: boolean = false;
    let paciente:HTMLAnchorElement;
    const urlBusquedaPaciente =
        "http://appsmoya.ngrok.io/adoweb/php/busquedaPacientes.php";
    let promisePacientes: any=[];


    onMount(() => {
    
    document.getElementById('criterio').focus();
  })

    const buscarPacientes = async () => {
        buscando = true;
        try {
            let response = await fetch(urlBusquedaPaciente, {
                method: "POST",
                body: JSON.stringify({ criterio: criterio, database: "ado" }),
            });
            let pacientes = await response.json();
            console.log(pacientes);
            buscando = false;
            return pacientes;
        } catch (error) {
            return error;
        }
    };

    const selectPaciente = (historia:string)=>{
       $historiaPaciente=historia;
       navigate(`./listaFotos`, { replace: true });

    }

    
</script>

<div class="container">
    <Card class="mb-3 mt-2">
        <CardHeader>
            <CardTitle>Búsqueda de Pacientes</CardTitle>
        </CardHeader>
        <CardBody>
            <FormGroup>
                <Label for="criterio">Paciente</Label>
                <Input
                    id="criterio"
                    bind:value={criterio}
                    placeholder="Busqueda por Identificación, Historia o Nombres"
                />
            </FormGroup>
            <FormGroup>
                <Button color="info" on:click={()=>promisePacientes=buscarPacientes()} block
                    >Buscar
                    {#if buscando}
                        <Spinner color="info" size="lg" type="grow" />
                    {/if}
                </Button>
            </FormGroup>
        </CardBody>
        <CardFooter>Ado</CardFooter>
    </Card>

    <ListGroup>
        {#await promisePacientes}
            <Spinner color="primary" size="sm" />
        {:then pacientes}
            {#each pacientes as { nombres,historia }, i}
                
                <ListGroupItem ><a href="#!" bind:this={paciente} on:click|preventDefault={()=>selectPaciente(historia)}>{i+1}:{nombres}-{historia}</a></ListGroupItem>
                
             {/each}
        {/await}
    </ListGroup>
</div>
