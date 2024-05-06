let arregloPokemon = [];
let Equipos=[];
let contador=0;
const btnGuardar = document.getElementById("guardarBtn");
const barraBusqueda = document.getElementById("floatingInput");

/* Obtener pokemon */
async function getPokemon(pokemonName){
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if(response.status===404){
            console.log(response.status);
            appendAlert('Pokemon no encontrado', 'warning');
            return;
        }
        console.log(response.status);
        return await response.json();
    }catch(err){
        appendAlert('Verifique su conexion e intente de nuevo', 'danger');
    }
}

/* Bloquear boton guardar y barra de busqueda */
function bloqueo(contador){
    if (contador==6){
        btnGuardar.disabled=true;
        barraBusqueda.disabled=true;
    }
}

/* Guardar el equipo en el historial */
function EquipoCompleto(){
    if (arregloPokemon.length === 6) {
        Equipos.push([...arregloPokemon]); 
        arregloPokemon = []; 
        contador = 0;
        appendAlert('Equipo Pokémon guardado con éxito', 'success');
    } else {
        let cant = 6-arregloPokemon.length;
        appendAlert(`El equipo Pokémon debe tener exactamente 6 Pokémon, te hacen falta ${cant} `, 'warning');
    }
}

/* Evento boton guardar / extraer info del pokemon */
document.getElementById("guardarBtn").addEventListener("click", async function() {
    const pokemonName = document.getElementById("floatingInput").value.toLowerCase();
    try {
        const pokemonData = await getPokemon(pokemonName); // Esperar a que la promesa se resuelva
        /* Extraer info */
        if (pokemonData) {
            const pokemon = {
                name: pokemonData.name,
                id: pokemonData.id,
                types: pokemonData.types.map(type => type.type.name),
                image: pokemonData.sprites.front_default,
                abilities: pokemonData.abilities.map(ability => ability.ability.name),
                baseExperience: pokemonData.base_experience
            };
            arregloPokemon.push(pokemon);
            contador++;
            if(arregloPokemon.length===6){
                appendAlert(`El pokemon ${pokemon.name} se agrego exitosamente. ${arregloPokemon.length} de 6. Su equipo esta completo, ya puede registrarlo.`,'success');
            }else{
                appendAlert(`El pokemon ${pokemon.name} se agrego exitosamente. ${arregloPokemon.length} de 6`,'success');
            }
            bloqueo(contador);
        }
    } catch (error) {
        console.error(error); 
    }
});

/* Imprimir equipos */
document.getElementById("enviarBtn").addEventListener("click", function() {
    const contenedorPokemons = document.getElementById("contenedorPokemons");
    const numEquipo = document.getElementById("numEquipo");

    contenedorPokemons.innerHTML = "";
    numEquipo.innerHTML = "";

    if (Equipos.length > 0) {
        Equipos.forEach((equipo, index) => {
            equipo.sort((a, b) => a.baseExperience - b.baseExperience);
            
            const divEquipo = document.createElement('div');
            divEquipo.classList.add('equipo');
            divEquipo.innerHTML = `<p class="border-bottom fs-3">Equipo ${index + 1}</p>`;
            numEquipo.appendChild(divEquipo);
            
            const divPokemonRow = document.createElement('div');
            divPokemonRow.classList.add('row', 'row-cols-1', 'row-cols-md-6', 'g-4');

            equipo.forEach(pokemon => {
                const divPokemon = document.createElement('div');
                divPokemon.classList.add('pokemon', 'col-sm-4', 'mb-4');
                divPokemon.innerHTML = `
                    <div class="p-2 h-100">
                        <div class="border card h-100 d-flex flex-column">
                            <img src="${pokemon.image}" class="border-bottom card-img-top">
                            <div class="card-body flex-grow-1">
                                <h5 class="card-title">${pokemon.name}  #${pokemon.id}</h5>
                                <p class="card-text">Habilidades: ${pokemon.abilities.join(', ')}</p>
                                <p class="card-text">Tipos: ${pokemon.types.join(', ')}</p>
                                <p class="card-text">Experiencia base: ${pokemon.baseExperience}</p>
                            </div>
                        </div>
                    </div>
                `;
                divPokemonRow.appendChild(divPokemon);
            });

            divEquipo.appendChild(divPokemonRow);
        });
    } else {
        appendAlert("El historial de equipos se encuentra vacío",'warning');
    }
});


/* Evento de equipo nuevo */
document.getElementById("nuevoBtn").addEventListener("click", function() {
        btnGuardar.disabled = false;
        barraBusqueda.disabled = false;
        EquipoCompleto();
});


/* Metodo alerta */
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  liveAlertPlaceholder.innerHTML="";
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertPlaceholder.append(wrapper)
  setTimeout(() => {
    wrapper.remove();
  }, 3000);
}