// Arreglo de preguntas
const preguntas = [
    {
      texto: "¿Miguel Hidalgo nació el 8 de mayo de 1753?",
      respuestas: ["Sí", "No", "Tal vez"],
      correcta: 0,
      imagen: "imagenes/miguel hidalgo.jpg"
    },
    {
      texto: "¿Cuándo inició la Independencia de México?",
      respuestas: ["16 de septiembre de 1810", "10 de mayo de 1810", "20 de noviembre de 1821"],
      correcta: 0,
      imagen: "imagenes/bandera.jpg"
    },
    {
      texto: "¿Qué objetivo tenía la Independencia de México?",
      respuestas: ["Liberarse de España", "Buscar oro", "Expandir el territorio"],
      correcta: 0,
      imagen: "imagenes/bandera.jpg"
    },
    {
      texto: "¿En qué año fue el papel más destacado de Josefa Ortíz?",
      respuestas: ["1829", "1821", "1810"],
      correcta: 2,
      imagen: "imagenes/josefa ortiz.jpg"
    },
    {
      texto: "¿Cuándo murió Juan Aldama?",
      respuestas: ["26 de Septiembre de 1810", "26 de Junio de 1811", "27 de Junio de 1811"],
      correcta: 1,
      imagen: "imagenes/juan aldama.jpg"
    },
    {
      texto: "¿Quién instauró el primer gobierno insurgente?",
      respuestas: ["Miguel Hidalgo", "Ignacio Aldama", "José María"],
      correcta: 1,
      imagen: "imagenes/ignacio aldama.jpg"
    },
    {
      texto: "¿Qué estableció Jose María Morelos y Pavón?",
      respuestas: [
        "Que menores de 18 años aun no son adultos",
        "Que a los trabajadores les aumentaran el sueldo",
        "Que la educación fuera obligatoria y gratuita"
      ],
      correcta: 2,
      imagen: "imagenes/jose mara morelos.jpg"
    },
    {
      texto: "¿En qué año Mariano Abasolo se unió al movimiento insurgente?",
      respuestas: ["1810", "1820", "1821"],
      correcta: 0,
      imagen: "imagenes/mariano abasolo.jpg"
    },
    {
      texto: "Leona Vicario es reconocida como una de las...",
      respuestas: ["Patronas", "Madres de la Patria", "Adelitas"],
      correcta: 1,
      imagen: "imagenes/leona viario.jpg"
    }
  ];
  
  // Mezcla aleatoria
  const preguntasAleatorias = preguntas.sort(() => Math.random() - 0.5);
  
  let preguntaActual = 0;
  
  // Mostrar la primera pregunta al cargar
  window.onload = () => {
    mostrarPregunta(preguntaActual);
  };
  
  // Mostrar pregunta y respuestas dinámicamente
  function mostrarPregunta(index) {
    const pregunta = preguntasAleatorias[index];
    const img = document.querySelector(".imgjuego");
    const texto = document.querySelector(".txtpregunta");
    const opciones = document.getElementById("opciones");
  
    // Imagen y texto
    img.src = pregunta.imagen;
    texto.innerHTML = `<b>${index + 1}. ${pregunta.texto}</b>`;
  
    // Eliminar respuestas anteriores
    opciones.innerHTML = "";
  
    // Crear botones de respuesta
    pregunta.respuestas.forEach((respuesta, i) => {
      const btn = document.createElement("button");
      btn.classList.add("boton-opcion");
      btn.innerText = respuesta;
      btn.onclick = () => {
        if (i === pregunta.correcta) {
          actualizarPuntaje(1);
          siguientePregunta();
        } else {
          mostrarMensajeFallo();
        }
      };
      opciones.appendChild(btn);
    });
  }
  
  // Puntaje
  function actualizarPuntaje(incremento) {
    let puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
    puntaje += incremento;
    localStorage.setItem('puntaje', puntaje);
  }
  
  // Siguiente pregunta
  function siguientePregunta() {
    preguntaActual++;
    if (preguntaActual < preguntasAleatorias.length) {
      mostrarPregunta(preguntaActual);
    } else {
      // Aquí podrías mostrar una pantalla de felicitación o redirigir
      window.location.href = 'rompecabezasc.html';
    }
  }
  
  // Modal de error
  function mostrarMensajeFallo() {
    document.getElementById('mensajeFalloModal').style.display = 'flex';
  }
  
  function cerrarModal() {
    document.getElementById('mensajeFalloModal').style.display = 'none';
  }
  