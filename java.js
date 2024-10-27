const cardsArray = [
    { name: '1', img: 'imagenes/miguel hidalgo.jpg' },
    { name: '1', img: 'imagenes/miguel hidalgo.jpg' },
    { name: '2', img: 'imagenes/jose mara morelos.jpg' },
    { name: '2', img: 'imagenes/jose mara morelos.jpg' },
    { name: '3', img: 'imagenes/ignacio aldama.jpg' },
    { name: '3', img: 'imagenes/ignacio aldama.jpg' },
    { name: '4', img: 'imagenes/josefa ortiz.jpg' },
    { name: '4', img: 'imagenes/josefa ortiz.jpg' },
    { name: '5', img: 'imagenes/juan aldama.jpg' },
    { name: '5', img: 'imagenes/juan aldama.jpg' },
    { name: '6', img: 'imagenes/leona viario.jpg' },
    { name: '6', img: 'imagenes/leona viario.jpg' },
    { name: '7', img: 'imagenes/mariano abasolo.jpg' },
    { name: '7', img: 'imagenes/mariano abasolo.jpg' }
];

const memorama = document.querySelector('.memorama');
const resetButton = document.getElementById('resetButton');
const attemptsCounter = document.getElementById('attemptsCounter');
let attempts = 0;


function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function createBoard() {
    

    memorama.innerHTML = ''; // Limpiar el tablero
    const shuffledCards = shuffle(cardsArray.slice());
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card.name;
        cardElement.innerHTML = `
            <div class="inner">
                <div class="front">❓</div>
                <div class="back"><img src="${card.img}" alt="${card.name}" class="imgmemo"></div>
            </div>
        `;
        memorama.appendChild(cardElement);
    });
    addEventListeners();
}

function addEventListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    attempts++;
    attemptsCounter.textContent = attempts;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    attempts = 0;
    attemptsCounter.textContent = attempts;
    createBoard();
}

// Inicializar el tablero
createBoard();

// Añadir evento para el botón de reinicio
resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetGame();
});

let matches = 0;
const mensajeModal = document.getElementById('mensajeModal');
const closeModalButton = document.querySelector('.cerrar');

function showModal() {
    mensajeModal.style.display = 'block';
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matches++;
    if (matches === cardsArray.length / 2) {
        setTimeout(showModal, 500); // Muestra el mensaje de felicitación
    }

    resetBoard();
}

function resetGame() {
    attempts = 0;
    matches = 0;
    attemptsCounter.textContent = attempts;
    mensajeModal.style.display = 'none'; // Oculta el modal si estaba visible
    createBoard();
}

// Añade un evento para cerrar el modal
closeModalButton.addEventListener('click', () => {
    mensajeModal.style.display = 'none';
});

// Oculta el modal si se hace clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === mensajeModal) {
        mensajeModal.style.display = 'none';
    }
});

