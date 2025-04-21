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

// Variables de control
const datosMostrados = new Set();
let datoCuriosoTimeout = null;
let fallaTimeout = null;
let exitoTimeout = null;
let datoActual = null;

// Inicialización del juego
window.onload = function() {
    inicializarJuego();
    
    // Hacer funciones accesibles globalmente
    window.cerrarModalFalla = cerrarModalFalla;
    window.cerrarMensajeModal = cerrarMensajeModal;
    window.cerrarDatoCurioso = cerrarDatoCurioso;
};

function inicializarJuego() {
    const piezasContenedor = document.getElementById("piezas-superiores");
    const rompecabezas = document.getElementById("rompecabezas");

    // Limpiar contenedores
    piezasContenedor.innerHTML = "";
    rompecabezas.innerHTML = "";

    // Mezclar piezas
    const piezasMezcladas = [...piezas].sort(() => Math.random() - 0.5);

    // Generar piezas arrastrables
    piezasMezcladas.forEach(pieza => {
        const img = document.createElement("img");
        img.src = pieza.img;
        img.id = pieza.id;
        img.draggable = true;
        img.classList.add("pieza-img");
        img.addEventListener("dragstart", manejarDragStart);
        piezasContenedor.appendChild(img);
    });

    // Generar casillas del rompecabezas
    for (let i = 0; i < 9; i++) {
        const casilla = document.createElement("div");
        casilla.className = "casilla";
        casilla.dataset.correcta = `pieza${i + 1}`;
        casilla.addEventListener("dragover", manejarDragOver);
        casilla.addEventListener("drop", manejarDrop);
        rompecabezas.appendChild(casilla);
    }

    // Configurar eventos para cerrar modales
    configurarCierreModales();
}

// Manejadores de eventos
function manejarDragStart(e) {
    e.dataTransfer.setData("text/plain", this.id);
}

function manejarDragOver(e) {
    e.preventDefault();
}

function manejarDrop(e) {
    e.preventDefault();
    const idPieza = e.dataTransfer.getData("text/plain");
    const pieza = document.getElementById(idPieza);
    const casilla = e.currentTarget;

    if (!casilla.hasChildNodes()) {
        if (idPieza === casilla.dataset.correcta) {
            colocarPiezaCorrecta(pieza, casilla);
        } else {
            mostrarModalFalla();
        }
    }
}

function configurarCierreModales() {
    // Cerrar al hacer clic fuera del contenido
    document.querySelectorAll('.modalj').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                if (this.id === 'modalFalla') {
                    cerrarModalFalla();
                } else if (this.id === 'mensajeModal') {
                    cerrarMensajeModal();
                }
            }
        });
    });

    // Cerrar dato curioso al hacer clic
    const datoCurioso = document.getElementById("dato-curioso");
    datoCurioso.addEventListener('click', cerrarDatoCurioso);
}

// Lógica del juego
function colocarPiezaCorrecta(pieza, casilla) {
    pieza.classList.add("pieza-colocada");
    casilla.appendChild(pieza);
    
    // Mostrar dato curioso con retraso para mejor experiencia
    setTimeout(mostrarDatoCurioso, 100);
    verificarCompletado();
}

function mostrarDatoCurioso() {
    const divDato = document.getElementById("dato-curioso");
    
    // Cancelar timeout anterior si existe
    if (datoCuriosoTimeout) {
        clearTimeout(datoCuriosoTimeout);
    }

    // Obtener dato curioso no mostrado
    let disponible = datosCuriosos.filter(d => !datosMostrados.has(d));
    if (disponible.length === 0) {
        datosMostrados.clear();
        disponible = [...datosCuriosos];
    }

    datoActual = disponible[Math.floor(Math.random() * disponible.length)];
    datosMostrados.add(datoActual);

    // Mostrar dato
    divDato.textContent = datoActual;
    divDato.classList.add("visible");

    // Configurar timeout (15 segundos)
    datoCuriosoTimeout = setTimeout(cerrarDatoCurioso, 5000);
}

function cerrarDatoCurioso() {
    const divDato = document.getElementById("dato-curioso");
    divDato.classList.remove("visible");
    if (datoCuriosoTimeout) {
        clearTimeout(datoCuriosoTimeout);
        datoCuriosoTimeout = null;
    }
}

function verificarCompletado() {
    const casillas = document.querySelectorAll(".casilla");
    const completado = [...casillas].every(casilla => casilla.hasChildNodes());
    
    if (completado) {
        setTimeout(mostrarMensajeExito, 1000);
    }
}

// Funciones para modales
function mostrarModalFalla() {
    const modal = document.getElementById("modalFalla");
    modal.style.display = "flex";
    
    if (fallaTimeout) {
        clearTimeout(fallaTimeout);
    }
    
    fallaTimeout = setTimeout(cerrarModalFalla, 3000);
}

function cerrarModalFalla() {
    const modal = document.getElementById("modalFalla");
    modal.style.display = "none";
    if (fallaTimeout) {
        clearTimeout(fallaTimeout);
        fallaTimeout = null;
    }
}

function mostrarMensajeExito() {
    const modal = document.getElementById("mensajeModal");
    modal.style.display = "flex";
    
    if (exitoTimeout) {
        clearTimeout(exitoTimeout);
    }
    
    exitoTimeout = setTimeout(cerrarMensajeModal, 5000);
}

function cerrarMensajeModal() {
    const modal = document.getElementById("mensajeModal");
    modal.style.display = "none";
    if (exitoTimeout) {
        clearTimeout(exitoTimeout);
        exitoTimeout = null;
    }
}