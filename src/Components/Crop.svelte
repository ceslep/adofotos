<script lang="ts">
    import { onMount } from "svelte";
    import Cropper from "cropperjs";
    import { historiaPaciente, imagesrc } from "./Stores.js";
    import Swal from "sweetalert2";

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

    const urlImageAsignaFoto =
        "http://appsmoya.ngrok.io/adoweb/php/imageAsignaFoto.php";

    let pimg;
    var cropper;
    var canvasCropper: any;
    let asignandoFoto:boolean=false;

    let open = false;
    const toggle = () => (open = !open);

    let imgCanvasSrc: any;

    $: if (open) obtenerImagen();
    onMount(() => {
        cropimage();
    });
    $: if (canvasCropper) imgCanvasSrc = canvasCropper.toDataURL();

    $: console.log($imagesrc);

    function cropimage() {
        function each(arr: any, callback: any) {
            var length = arr.length;
            var i: number;

            for (i = 0; i < length; i++) {
                callback.call(arr, arr[i], i, arr);
            }

            return arr;
        }

        var image = <HTMLImageElement>document.querySelector("#image");
        var previews = document.querySelectorAll(".preview");
        var previewReady = false;
        cropper = new Cropper(image, {
            autoCrop: true,
            ready: function () {
                var clone = this.cloneNode();

                clone.className = "";
                clone.style.cssText =
                    "display: block;" +
                    "width: 100%;" +
                    "min-width: 0;" +
                    "min-height: 0;" +
                    "max-width: none;" +
                    "max-height: none;";

                each(previews, function (elem) {
                    elem.appendChild(clone.cloneNode());
                });
                previewReady = true;
            },

            crop: function (event) {
                if (!previewReady) {
                    return;
                }

                var data = event.detail;
                var cropper = this.cropper;
                var imageData = cropper.getImageData();
                var previewAspectRatio = data.width / data.height;
                let im = false;
                each(previews, function (elem) {
                    var previewImage = elem.getElementsByTagName("img").item(0);
                    if (im) {
                        pimg = previewImage;
                        console.log(pimg);
                    }
                    var previewWidth = elem.offsetWidth;
                    var previewHeight = previewWidth / previewAspectRatio;
                    var imageScaledRatio = data.width / previewWidth;

                    elem.style.height = previewHeight + "px";
                    previewImage.style.width =
                        imageData.naturalWidth / imageScaledRatio + "px";
                    previewImage.style.height =
                        imageData.naturalHeight / imageScaledRatio + "px";
                    previewImage.style.marginLeft =
                        -data.x / imageScaledRatio + "px";
                    previewImage.style.marginTop =
                        -data.y / imageScaledRatio + "px";
                });
            },
        });
    }

    function imgToBase64(img) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // I think this won't work inside the function from the console
        img.crossOrigin = "anonymous";

        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL();
    }
    const obtenerImagen = () => {
        let image = cropper.getCroppedCanvas();
        canvasCropper = cropper["getCroppedCanvas"](
            { width: 360, height: 640, fillColor: "#fff" },
            undefined
        );
    };

    const post = (dataJson: any, url: any) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status == 200) {
                var data = JSON.parse(this.responseText);

                console.log(data);
            }
        };
        httpRequest.open("POST", url);
        httpRequest.withCredentials = true;
        httpRequest.setRequestHeader("Content-Type", "application/json");

        httpRequest.send(dataJson);
    };
    const asignaFoto = async (historia: string) => {
        asignandoFoto=true;
         let response = await fetch(urlImageAsignaFoto, {
            method: "POST",
            body: JSON.stringify({
                historia: historia,
                foto: imgCanvasSrc,
                database: "ado",
            }),
           
        });
        let result = await response.json();
        asignandoFoto=false;
        if (result[0].resultado=="ok")
        Swal.fire({
        icon: "success",
        title: `Foto asignada a la historia ${result[0].historia}`,
        html:`${result[0].mensaje}`,
        text: "ADO",
      
      });
     /*   post(
            JSON.stringify({
                historia: historia,
                foto: imgCanvasSrc,
                database: "ado",
            }),
            urlImageAsignaFoto
        );*/
    };
</script>

<div class="containerr">
    <h1>Recortar Imagen</h1>
    <div class="row">
        <div class="col col-6">
            <img id="image" src={$imagesrc} alt="" />
        </div>
        <div class="col col-3">
            <div class="preview" />
        </div>
        <div class="col col-2">
            <div class="preview" />
        </div>
        <div class="col col-1">
            <div class="preview" />
        </div>
    </div>
    <div class="container d-flex justify-content-center  pt-2">
        <button class="btn btn-primary" on:click={toggle}>Obtener Imagen</button
        >
    </div>
</div>

<Modal isOpen={open} {toggle} size="sm" id="myModal">
    <ModalHeader {toggle} class="bg-info"
        >Resultado@{$historiaPaciente}</ModalHeader
    >
    <ModalBody
        class="d-flex justify-content-center align-items-center flex-wrap"
    >
        <div id="resultado">
            <img src={imgCanvasSrc} alt="" class="img-fluid" width="250" />
        </div>
    </ModalBody>
    <ModalFooter>
        <Button
            class="btn btn-warning"
            on:click={() => asignaFoto($historiaPaciente)}>
            Asignar Foto
            {#if asignandoFoto}
                <Spinner color="info" size="sm" />
            {/if}
            </Button
        >
        <Button color="secondary" on:click={toggle}>Cerrar</Button>
    </ModalFooter>
</Modal>

<style>
    .containerr {
        margin: 20px auto;
        max-width: 960px;
    }

    img {
        max-width: 100%;
    }

    .row,
    .preview {
        overflow: hidden;
        border: 1px solid black;
        padding: 1px 1px 1px 1px;
        margin: 1px 1px 1px 1px;
    }

    .col {
        float: left;
    }

    .col-6 {
        width: 50%;
    }

    .col-3 {
        width: 25%;
    }

    .col-2 {
        width: 16.7%;
    }

    .col-1 {
        width: 8.3%;
        padding-left: 2px;
    }
</style>
