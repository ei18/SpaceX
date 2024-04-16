/* SELECTORES */ 
const contenido = document.querySelector('#contenido');


const url = "https://api.spacexdata.com/v3/launches"

document.addEventListener('DOMContentLoaded', obtenerDatos);

async function obtenerDatos(){
    try{
        const response = await fetch(url);
        const data = await response.json(); 
        console.log("Con función async await", data)
        injectarDatosApi(data);
    }catch(error){
        console.log(error);
    }
}

function injectarDatosApi(datos){

    datos.forEach(dato => {
        /* Destructuring aquí porque no se puede arriba en los paréntesis de la función */
        /* Al hacer Destructuring se iguala con el iterador coder */
        const { mission_patch } = dato.links;
        const { flight_number, mission_name, launch_year} = dato;
        contenido.innerHTML += `
        <div class="card" style="width: 18rem;">
            <img src="${mission_patch}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${mission_name}</h5>
                <p class="card-text" style="color: black;">Número de vuelo: ${flight_number}</p>
                <p class="card-text" style="color: black;">Año de lanzamiento: ${launch_year}</p>      
                <button type="button" class="btn btn-primary btnModal" data-bs-toggle="modal" data-bs-target="#exampleModal" numVuelo="${flight_number}">
                Ver detalles
                </button>         
            </div>
        </div>
        `
    });
}

let cardsModals = [];

contenido.addEventListener('click', selectCardByID);

function selectCardByID(IDselection){
    if (IDselection.target.classList.contains("btnModal")){
        let flightNumberAsID = IDselection.target.getAttribute("numVuelo");

        getDataModal(flightNumberAsID);
    }
}

async function getDataModal(flightNumberAsID){
    const urlSecondAPI = `https://api.spacexdata.com/v3/launches/${flightNumberAsID}`;

    try{
        const response = await fetch(urlSecondAPI);
        const datosModal = await response.json();

        //Datos del cada modal
        console.log("Datos del Modal");
        console.log(datosModal);

        //Llenamos el array que declaramos vacío más arriba, con los datos capturados en la response.json 
        cardsModals = [datosModal];

        fillModal(datosModal);
    }
    catch(error){
        console.log(error);
    }
}

function fillModal(datosModal){
    const contenedorBodyModal = document.querySelector('.bodyModal');
    const contenedorBodyModal2 = document.querySelector('#modalBody');

    /* Traer video */
    const {youtube_id} = datosModal.links;
    console.log(youtube_id);

    /* Traer cohete y tipo de cohete */
    const {rocket_name, rocket_type} = datosModal.rocket;
    console.log(rocket_name);
    console.log(rocket_type);

    const {launch_success} = datosModal;
    console.log(launch_success);

    contenedorBodyModal.innerHTML = `
        <iframe width="465" height="315" src="https://www.youtube.com/embed/${youtube_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


        <table class="table">
            <tbody>
                <tr>
                    <td><strong> Nombre cohete: </strong>${rocket_name}</td>
                </tr>
                <tr>
                    <td><strong> Tipo de cohete: </strong>${rocket_type}</td>
                </tr>
                <tr>
                    <td><strong> Tipo de cohete: </strong>${launch_success}</td>
                </tr>
            </tbody>
        </table>
    
    `;
    
}


    