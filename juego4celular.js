// Array de piezas del rompecabezas con sus imágenes
const piezas = [
    { id: "pieza1", img: "imagenes/p1.jpg" },
    { id: "pieza2", img: "imagenes/p2.jpg" },
    { id: "pieza3", img: "imagenes/p3.jpg" },
    { id: "pieza4", img: "imagenes/p4.jpg" },
    { id: "pieza5", img: "imagenes/p5.jpg" },
    { id: "pieza6", img: "imagenes/p6.jpg" },
    { id: "pieza7", img: "imagenes/p7.jpg" },
    { id: "pieza8", img: "imagenes/p8.jpg" },
    { id: "pieza9", img: "imagenes/p9.jpg" }
];

// Datos curiosos para mostrar
const datosCuriosos = [
    "Miguel Hidalgo usó estandartes con la Virgen de Guadalupe.",
    "El Grito de Dolores se dio el 16 de septiembre de 1810.",
    "José María Morelos organizó el Congreso de Chilpancingo.",
    "Los insurgentes usaban armas improvisadas como palos y piedras.",
    "La guerra duró más de 10 años.",
    "Vicente Guerrero continuó la lucha después de la muerte de Morelos.",
    "El cura Hidalgo fue ejecutado en 1811.",
    "La independencia fue consumada por Agustín de Iturbide en 1821.",
    "Las mujeres también participaron como mensajeras y espías.",
    "La lucha por la independencia inspiró a otros países latinoamericanos."
];

// Variables de control
const datosMostrados = new Set();
let piezaSeleccionada = null;
let datoCuriosoTimeout = null;
let fallaTimeout = null;
let exitoTimeout = null;

// Inicialización del juego cuando la página carga
window.onload = function() {
    inicializarJuego();
    
    // Hacer funciones accesibles globalmente
    window.cerrarModalFalla = cerrarModalFalla;
    window.cerrarMensajeModal = cerrarMensajeModal;
    window.cerrarDatoCurioso = cerrarDatoCurioso;
};

// Función principal de inicialización
function inicializarJuego() {
    const piezasContenedor = document.getElementById("piezas-superiores");
    const rompecabezas = document.getElementById("contenedor-rompecabezas");

    // Limpiar contenedores
    piezasContenedor.innerHTML = "";
    rompecabezas.innerHTML = "";

    // Mezclar piezas aleatoriamente
    const piezasMezcladas = [...piezas].sort(() => Math.random() - 0.5);

    // Crear y agregar las piezas al contenedor superior
    piezasMezcladas.forEach(pieza => {
        const img = document.createElement("img");
        img.src = pieza.img;
        img.alt = "Pieza del rompecabezas";
        img.id = pieza.id;
        img.classList.add("pieza-img");
        
       
        
        // Event listeners para selección por toque
        img.addEventListener("touchstart", manejarSeleccionPieza, { passive: false });
        img.addEventListener("click", manejarSeleccionPieza);
        
        piezasContenedor.appendChild(img);
    });

    // Crear las casillas del rompecabezas
    for (let i = 0; i < 9; i++) {
        const casilla = document.createElement("div");
        casilla.className = "casilla";
        casilla.dataset.correcta = `pieza${i + 1}`;
        
        // Event listeners para colocar piezas
        casilla.addEventListener("touchend", manejarColocacionPieza);
        casilla.addEventListener("click", manejarColocacionPieza);
        
        rompecabezas.appendChild(casilla);
    }

    configurarCierreModales();
}

// Configurar cierre de modales
function configurarCierreModales() {
    document.querySelectorAll('.cerrarj').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modalj').style.display = 'none';
        });
    });
}

// Manejar selección de pieza
function manejarSeleccionPieza(e) {
    e.preventDefault();
    const pieza = e.target;
    
    // Deseleccionar si ya está seleccionada
    if (piezaSeleccionada === pieza) {
        pieza.classList.remove("pieza-seleccionada");
        piezaSeleccionada = null;
        return;
    }
    
    // Deseleccionar cualquier pieza previa
    if (piezaSeleccionada) {
        piezaSeleccionada.classList.remove("pieza-seleccionada");
    }
    
    // Seleccionar nueva pieza
    piezaSeleccionada = pieza;
    pieza.classList.add("pieza-seleccionada");
}

// Manejar colocación de pieza
function manejarColocacionPieza(e) {
    if (!piezaSeleccionada) return;
    
    const casilla = e.currentTarget;
    
    if (!casilla.hasChildNodes()) {
        if (piezaSeleccionada.id === casilla.dataset.correcta) {
            colocarPiezaCorrecta(piezaSeleccionada, casilla);
        } else {
            mostrarModalFalla();
        }
    }
    
    // Deseleccionar la pieza después del intento
    piezaSeleccionada.classList.remove("pieza-seleccionada");
    piezaSeleccionada = null;
}

// Colocar pieza correctamente
function colocarPiezaCorrecta(pieza, casilla) {
    const clon = pieza.cloneNode(true);
    clon.classList.remove("pieza-seleccionada");
    clon.classList.add("pieza-colocada");
    
    // Eliminar eventos de selección
    clon.removeEventListener("touchstart", manejarSeleccionPieza);
    clon.removeEventListener("click", manejarSeleccionPieza);
    
    casilla.appendChild(clon);
    
    // Eliminar la pieza original del contenedor superior
    pieza.remove();
    
    // Mostrar dato curioso
    mostrarDatoCurioso();
    
    // Verificar si el rompecabezas está completo
    verificarCompletado();
}

// Mostrar dato curioso aleatorio
function mostrarDatoCurioso() {
    clearTimeout(datoCuriosoTimeout);
    
    // Si ya mostramos todos los datos, reiniciamos
    if (datosMostrados.size >= datosCuriosos.length) {
        datosMostrados.clear();
    }
    
    // Encontrar un dato no mostrado
    let dato;
    do {
        const indice = Math.floor(Math.random() * datosCuriosos.length);
        dato = datosCuriosos[indice];
    } while (datosMostrados.has(dato) && datosMostrados.size < datosCuriosos.length);
    
    datosMostrados.add(dato);
    
    const elementoDato = document.getElementById("dato-curioso");
    elementoDato.textContent = dato;
    elementoDato.classList.add("visible");
    
    datoCuriosoTimeout = setTimeout(() => {
        elementoDato.classList.remove("visible");
    }, 3000);
}

// Cerrar dato curioso manualmente
function cerrarDatoCurioso() {
    clearTimeout(datoCuriosoTimeout);
    document.getElementById("dato-curioso").classList.remove("visible");
}

// Verificar si el rompecabezas está completo
function verificarCompletado() {
    const casillas = document.querySelectorAll('.casilla');
    const completado = Array.from(casillas).every(casilla => casilla.hasChildNodes());
    
    if (completado) {
        mostrarModalExito();
    }
}

// Mostrar modal de error
function mostrarModalFalla() {
    clearTimeout(fallaTimeout);
    const modal = document.getElementById("mensajeFalloModal");
    modal.style.display = "flex";
    
    fallaTimeout = setTimeout(() => {
        modal.style.display = "none";
    }, 4000);
}

// Cerrar modal de error
function cerrarModalFalla() {
    clearTimeout(fallaTimeout);
    document.getElementById("mensajeFalloModal").style.display = "none";
}

// Mostrar modal de éxito
function mostrarModalExito() {
    clearTimeout(exitoTimeout);
    const modal = document.getElementById("mensajeModal");
    modal.style.display = "flex";
    
    exitoTimeout = setTimeout(() => {
        modal.style.display = "none";
    }, 4000);
}

// Cerrar modal de éxito
function cerrarMensajeModal() {
    clearTimeout(exitoTimeout);
    document.getElementById("mensajeModal").style.display = "none";
}
