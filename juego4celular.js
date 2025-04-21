// Datos del juego
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

// Estado del juego
let piezaActiva = null;
let offsetTouch = { x: 0, y: 0 };
const datosMostrados = new Set();

// Inicialización
function iniciarJuego() {
    const contenedorPiezas = document.getElementById("piezas-superiores");
    const areaRompecabezas = document.getElementById("rompecabezas");

    // Limpiar y mezclar piezas
    contenedorPiezas.innerHTML = "";
    areaRompecabezas.innerHTML = "";
    const piezasMezcladas = [...piezas].sort(() => Math.random() - 0.5);

    // Crear piezas móviles
    piezasMezcladas.forEach(pieza => {
        const elementoPieza = document.createElement("img");
        elementoPieza.src = pieza.img;
        elementoPieza.id = pieza.id;
        elementoPieza.className = "pieza-img";
        elementoPieza.draggable = false; // Importante para touch
        
        // Eventos táctiles
        elementoPieza.addEventListener("touchstart", manejarInicioTouch, { passive: false });
        elementoPieza.addEventListener("touchmove", manejarMovimientoTouch, { passive: false });
        elementoPieza.addEventListener("touchend", manejarFinTouch);
        
        contenedorPiezas.appendChild(elementoPieza);
    });

    // Crear área del rompecabezas
    for (let i = 0; i < 9; i++) {
        const casilla = document.createElement("div");
        casilla.className = "casilla";
        casilla.dataset.piezaCorrecta = `pieza${i + 1}`;
        casilla.addEventListener("touchend", manejarSoltarPieza);
        areaRompecabezas.appendChild(casilla);
    }
}

// Manejo de eventos táctiles
function manejarInicioTouch(evento) {
    evento.preventDefault();
    const touch = evento.touches[0];
    piezaActiva = evento.target;
    
    const rect = piezaActiva.getBoundingClientRect();
    offsetTouch.x = touch.clientX - rect.left;
    offsetTouch.y = touch.clientY - rect.top;
    
    piezaActiva.style.position = "absolute";
    piezaActiva.style.zIndex = "1000";
    piezaActiva.style.transition = "none";
}

function manejarMovimientoTouch(evento) {
    if (!piezaActiva) return;
    evento.preventDefault();
    
    const touch = evento.touches[0];
    piezaActiva.style.left = `${touch.clientX - offsetTouch.x}px`;
    piezaActiva.style.top = `${touch.clientY - offsetTouch.y}px`;
}

function manejarFinTouch() {
    if (!piezaActiva) return;
    
    piezaActiva.style.zIndex = "";
    piezaActiva.style.transition = "all 0.3s";
    piezaActiva = null;
}

function manejarSoltarPieza(evento) {
    if (!piezaActiva) return;
    evento.preventDefault();
    
    const casilla = evento.currentTarget;
    if (casilla.hasChildNodes()) return;
    
    if (piezaActiva.id === casilla.dataset.piezaCorrecta) {
        colocarPiezaCorrecta(piezaActiva, casilla);
    } else {
        mostrarError();
    }
}

function colocarPiezaCorrecta(pieza, casilla) {
    // Clonar la pieza para el rompecabezas
    const piezaColocada = pieza.cloneNode();
    piezaColocada.className = "pieza-colocada";
    piezaColocada.style.position = "";
    piezaColocada.style.left = "";
    piezaColocada.style.top = "";
    
    // Limpiar eventos del clon
    piezaColocada.ontouchstart = null;
    piezaColocada.ontouchmove = null;
    piezaColocada.ontouchend = null;
    
    casilla.appendChild(piezaColocada);
    pieza.remove();
    
    mostrarDatoCurioso();
    verificarCompletado();
}

// Sistema de mensajes
function mostrarDatoCurioso() {
    const contenedorDato = document.getElementById("dato-curioso");
    
    // Obtener dato no mostrado
    let disponibles = datosCuriosos.filter(d => !datosMostrados.has(d));
    if (disponibles.length === 0) {
        datosMostrados.clear();
        disponibles = [...datosCuriosos];
    }
    
    const dato = disponibles[Math.floor(Math.random() * disponibles.length)];
    datosMostrados.add(dato);
    
    contenedorDato.textContent = dato;
    contenedorDato.classList.add("visible");
    
    // Ocultar después de 7 segundos
    setTimeout(() => {
        contenedorDato.classList.remove("visible");
    }, 7000);
}

function mostrarError() {
    const modalError = document.getElementById("modalFalla");
    modalError.style.display = "flex";
    
    setTimeout(() => {
        modalError.style.display = "none";
    }, 3000);
}

function verificarCompletado() {
    const casillas = document.querySelectorAll(".casilla");
    const completado = [...casillas].every(c => c.hasChildNodes());
    
    if (completado) {
        setTimeout(() => {
            document.getElementById("mensajeModal").style.display = "flex";
        }, 1000);
    }
}

// Iniciar juego cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", iniciarJuego);

// Funciones globales para cerrar modales
window.cerrarModalFalla = function() {
    document.getElementById("modalFalla").style.display = "none";
};

window.cerrarMensajeModal = function() {
    document.getElementById("mensajeModal").style.display = "none";
};

window.cerrarDatoCurioso = function() {
    document.getElementById("dato-curioso").classList.remove("visible");
};
