<script lang="ts">
  import Loading from "./Loading.svelte";
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
  } from "sveltestrap";
  import { Progress } from "./Utils.js";
  import { porcentajeStore, historiaPaciente,imagesrc } from "./Stores.js";
  import {
   X,
   Crop

  } from "svelte-bootstrap-icons";
  import Swal from "sweetalert2";

  export let Nombres: string;
  export let ImgSrc: string;
  export let Historia: string;
  export let Identificacion: string;
  let cargandoOneDrive: boolean = false;
  let dialogs;
  let directories;
  let dataimgs;
  let modtit;
  let imageC;
  let canvasImg;
  let imgsrc;
  let imageCrop: boolean = false;
  let porcimg: number = 0;
  let ximage: number = 20;
  let yimage: number = 20;
  const urlFiles = "http://appsmoya.ngrok.io/adoweb/php/get_files.php";
  const urlFilesa = "http://appsmoya.ngrok.io/adoweb/php/get_files_a.php";
  const urlFilesb = "http://appsmoya.ngrok.io/adoweb/php/get_files_b.php";
  const urlFilesc = "http://appsmoya.ngrok.io/adoweb/php/get_files_d.php";
  const urlFilesImage =
    "http://appsmoya.ngrok.io/adoweb/php/get_files_image.php";

  let open = false;
  const toggle = () => (open = !open);

  let open2 = false;
  const toggle2 = () => (open2 = !open2);

  type JsonDirectories = {
    directory: string;
  };

  type ArrayJSon = {
    directories: JsonDirectories[];
  };

  let promiseImages: any = [];
  let promiseImage: any = [];

  $: console.log(imageCrop);
  $: console.log(canvasImg);

  const moveRight = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("viewport");

    var ctx = canvas.getContext("2d");

    var imagectx = new Image();
    imagectx.src = imgsrc;
    imagectx.onload = function () {
      ctx.drawImage(imagectx, 0, 0, 634, 330);
      ctx.beginPath();
      ximage += 5;
      ctx.rect(ximage, yimage, 150, 200);

      ctx.stroke();
    };
  };

  const moveDown = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("viewport");

    var ctx = canvas.getContext("2d");

    var imagectx = new Image();
    imagectx.src = imgsrc;
    imagectx.onload = function () {
      ctx.drawImage(imagectx, 0, 0, 634, 330);
      ctx.beginPath();
      yimage += 5;
      ctx.rect(ximage, yimage, 150, 200);

      ctx.stroke();
    };
  };

  const cropimg = () => {
    if (!imgsrc) imgsrc = imageC.src;
    $imagesrc = imgsrc;
    navigate(`./crop`, { replace: true });

    // imageCrop = !imageCrop;
  };

  const fCrop = () => {};

  const getImage = async (dataimgs) => {
    let response = await fetch(urlFilesImage, {
      method: "POST",
      body: JSON.stringify(dataimgs),
    });

    let progreso = new Progress(response);
    let datos = await progreso.progreso();
    console.log(datos);
    return datos;
  };
  const clickImage = async (imageFile: string) => {
    dataimgs = { ...dataimgs, imageFile };
    console.log(dataimgs);
    console.log(imageFile);
    // open=false;
    porcentajeStore.set(0);
    promiseImage = getImage(dataimgs);

    open2 = true;
    /* let imageC:any;
    imageC=document.getElementById("imageC");*/
  };
  const generateLinks = (afiles: any) => {
    console.log(afiles);
    let html = "<ul class='list-group'>";
    afiles.forEach((directory, i) => {
      html += `<li class="list-group-item">
          <div class="d-grid gap-1">
          <a  class="btn btn-outline-primary btn-sm btn-block "  data-files='${JSON.stringify(
            directory
          )}' data-spinner='spinner${i}'>${directory.directory}
            <div class="spinner-border spinner-border-sm d-none" role="status" id='spinner${i}''>
            <span class="visually-hidden">Loading...</span>
            </div>
            </a>
          </div>
          </li>`;
    });
    html += "</ul>";
    return html;
  };

  const verFotosn = async (e) => {
    e.preventDefault();
    let a = e.target;
    let data = JSON.parse(a.getAttribute("data-files"));
    let spinner = document.getElementById(a.getAttribute("data-spinner"));
    spinner.classList.remove("d-none");
    let d3 = data.directory;
    data = { ...directories, d3 };
    dataimgs = data;
    console.log(data);
    let response = await fetch(urlFilesb, {
      method: "POST",
      body: JSON.stringify(data),
    });
    let images = await response.json();

    console.log(`${images[0].directory}\\${images[0].imageFile}`);
    dialogs.close();
    modtit = `${data.directory}-${data.d3}`;
    open = true;
    promiseImages = getImages(dataimgs);
  };

  const getImages = async (dataimgs: Object) => {
    let response = await fetch(urlFilesc, {
      method: "POST",
      body: JSON.stringify(dataimgs),
    });
    let images = await response.json();
    return images;
  };

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
  const verFotos = async (e) => {
    e.preventDefault();
    try {
      let a = e.target;
      let data = JSON.parse(a.getAttribute("data-files"));
      let spinner = document.getElementById(a.getAttribute("data-spinner"));
      spinner.classList.remove("d-none");
      directories = data;
      let response = await fetch(urlFilesa, {
        method: "POST",
        body: JSON.stringify(data),
      });
      let files = await response.json();
      //  files=files.sort(dynamicSort('atime'));
      console.log(files);
      dialogs.close();
      dialogs = Swal.fire({
        title: `Lista de Imagenes de ${Nombres}`,
        html: generateLinks(files),
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cerrar',
        confirmButtonAriaLabel: "Thumbs up, great!",
      });
      const anchors = document.querySelectorAll(".btn-outline-primary");
      anchors.forEach((anchor) => {
        anchor.addEventListener("click", verFotosn);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cargarOneDrive = async (historia: string) => {
    try {
      cargandoOneDrive = true;
      $historiaPaciente=historia;
      let response = await fetch(
        `http://appsmoya.ngrok.io/adoweb/php/get_files.php?historia=${historia}`
      );
      let files = await response.json();
      cargandoOneDrive = false;
      dialogs = Swal.fire({
        title: `Lista de Imagenes de ${Nombres}`,
        html: generateLinks(files),
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cerrar',
        confirmButtonAriaLabel: "Thumbs up, great!",
      });
      const anchors = document.querySelectorAll(".btn-outline-primary");
      anchors.forEach((anchor) => {
        anchor.addEventListener("click", verFotos);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "No hay carpetas ni imágenes",
        html:"<img src='assets/onedrive.png' class='img-fluid' width='175'>",
        text: "Se ha producido un error al obtener las imagenes!",
      
      });
      cargandoOneDrive = false;
    }
  };
  const verOneDrive = () => {
    cargarOneDrive(Historia);
  };

  const resetF=()=>{
    if ($historiaPaciente!=''){
    $historiaPaciente=''
    navigate("./");
    }
  }
</script>

<Card class="mb-3 mx-2" style="width:300px;">
  <CardHeader style="height:60px;">
    <CardTitle>
      {#if $historiaPaciente!=""}
      <a href="#!" on:click|preventDefault={resetF}>{Nombres}</a>
      {:else}
      {Nombres}
      {/if}
    </CardTitle>
    
  </CardHeader>
  <CardBody>
    <CardSubtitle>Historia Nº <span>{Historia}</span></CardSubtitle>
    <CardText class="d-flex justify-content-center">
      <img src={ImgSrc} alt="" class="img-fluid" />
    </CardText>
    <div class="d-grid gap-2">
      <Button>Cargar Fotografía</Button>
      <Button color="success" on:click={verOneDrive}>
        <span>Ver Fotografías One Drive</span>
        {#if cargandoOneDrive}
          <Spinner color="info" size="sm" />
        {/if}
      </Button>
    </div>
  </CardBody>
  <CardFooter
    >Identificacion:<span class="text-success">{Identificacion}</span
    ></CardFooter
  >
</Card>

<Modal isOpen={open} {toggle} size="xl">
  <ModalHeader {toggle} class="bg-info">{modtit}</ModalHeader>
  <ModalBody class="d-flex justify-content-center align-items-center flex-wrap">
    {#await promiseImages}
      <!-- promise is pending -->
      <!-- <Spinner color="primary" size="sm" />-->
      <Loading porcentaje={$porcentajeStore} />
    {:then images}
      <!-- promise was fulfilled -->
      {#each images as { img64, imageFile, imageFileFull }}
        <!-- content here -->
        <a href="#!" on:click|preventDefault={() => clickImage(imageFileFull)}>
          <img
            src={img64}
            class="img-fluid m-2 p-2 border border-secondary imgh"
            alt={imageFile}
          />
        </a>
      {/each}
    {/await}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggle}>Cerrar</Button>
  </ModalFooter>
</Modal>

<Modal isOpen={open2} toggle={toggle2} size="xl" class="bg-info">
  <ModalHeader toggle={toggle2} class="bg-warning"
    >{modtit}<Button size="sm" outline on:click={cropimg}><Crop /></Button>
  </ModalHeader>
  <ModalBody
    class="d-flex justify-content-center align-items-center flex-wrap "
  >
    {#await promiseImage}
      <Loading porcentaje={$porcentajeStore} />
    {:then images}
      <div class="container">
        {#each images as { img64 }}
          <!-- content here -->

          <img
            bind:this={imageC}
            src={img64}
            class="img-fluid m-2 p-2 border border-secondary imgh"
            alt=""
            id="imageC"
          />
        {/each}
      </div>
    {/await}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggle2}>Cerrar</Button>
  </ModalFooter>
</Modal>

<style>
  .imgh {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
</style>
