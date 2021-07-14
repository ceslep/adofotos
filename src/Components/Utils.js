
import {porcentajeStore} from "./Stores.js";

var porcimg=0;

class Progress{
  constructor (response){
    
    this.response=response;
  }

  getPorcentajeValue(){
    return this.porcentaje;
  }

  
  async progreso(){
    const reader = this.response.body.getReader();
   

    // Step 2: get total length
    const contentLength = +this.response.headers.get("Content-Length");

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;
      let porc=Math.round(parseFloat(receivedLength*100)/(parseFloat(contentLength)));
      porcentajeStore.set(porc);
      
      
      
     
    }
    
    // Step 4: concatenate chunks into single Uint8Array
    let chunksAll = new Uint8Array(receivedLength); // (4.1)
    let position = 0;
    for (let chunk of chunks) {
      chunksAll.set(chunk, position); // (4.2)
      position += chunk.length;
    }

    // Step 5: decode into a string
    let result = new TextDecoder("utf-8").decode(chunksAll);

    // We're done!
    let commits = JSON.parse(result);
    porcentajeStore.set(100);
    return commits;
}
}
 

export  {Progress}