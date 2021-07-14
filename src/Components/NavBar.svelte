<script lang="ts">
  import BusquedaPacientes from "./BusquedaPacientes.svelte";
  import ListaFotos from "./ListaFotos.svelte";
  import { Router, Link, Route,navigate } from "svelte-routing";
  import Crop from "./Crop.svelte";
  import {  historiaPaciente } from "./Stores.js";

  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap";
  let isOpen = false;

  //export let url = "";
  export let basepath = "/fotos";

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  
</script>

<Router  {basepath}>
  <Navbar color="info" light expand="md" class="sticky-top fixed-top">
    <NavbarBrand href="/">Fotografias ADO</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      <Nav class="ms-auto" navbar>
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Opciones</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem
              ><Link to="listaFotos">Lista Fotos (últimos 60)</Link
              ></DropdownItem
            >
            <DropdownItem
              ><Link to="busqueda">Buscar Paciente</Link></DropdownItem
            >
            <DropdownItem><Link to="crop">Crop Foto</Link></DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavItem>
          <NavLink href="./">Recargar</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://moyaortodoncia.ngrok.io"
            >Moya Ortodoncia</NavLink
          >
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
  <div>
    <Route path="listaFotos"><ListaFotos /></Route>
    <Route path="crop">
      <Crop />
    </Route>
    <Route path="busqueda">
      <BusquedaPacientes />
    </Route>
  </div>
</Router>

<style>
</style>
