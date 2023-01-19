/** Referents */
const btnInit = document.querySelector("#btnInit"),
  btnOrder = document.querySelector("#btnOrder"),
  btnStop = document.querySelector("#btnStop"),
  pointsHTML = document.querySelectorAll("small"),
  turnHTML = document.querySelector("#turn"),
  playerCards = document.querySelectorAll(".cards");

/** Variables */
let deck = [],
  playersPoints = [],
  turn = 0;

/**
 * C = Treboles
 * D = Diamantes
 * H = Corazones
 * S = Espadas
 */
const types = ["C", "D", "H", "S"],
  specials = ["A", "J", "Q", "K"];

/** Functions */

// Inicializa el juego
const init = (quantityPlayers = 3) => {
  deck = createDeck();
  playersPoints = [];
  turn = 0;

  for (let i = 0; i < quantityPlayers; i++)
    playersPoints.push({
      id: i < quantityPlayers - 1 ? `Jugador ${i + 1}` : "computadora",
      points: 0,
    });

  for (let player in playersPoints) {
    pointsHTML[player].textContent = 0;
    playerCards[player].textContent = "";
  }

  enableButtons();
  setTurn(turn);
};

// Crea una nueva baraja
const createDeck = () => {
  deck = [];

  for (let type of types) {
    for (let i = 2; i <= 10; i++) deck.push(i + type);

    for (let speacial of specials) deck.push(speacial + type);
  }

  return _.shuffle(deck);
};

// Obtiene una carta de la baraja
const getCard = () => {
  if (deck.length <= 0) throw "No hay cartas en el deck";

  return deck.pop();
};

// Devuelve el valor de la carta
const getCardValue = (card) => {
  const value = card.substring(0, card.length - 1);

  return !isNaN(value) ? value * 1 : value === "A" ? 11 : 10;
};

// Determina el ganador
const determinateWinner = (playersPoints) => {
  const [player1Point, player2Point, computerPoint] = playersPoints;

  setTimeout(() => {
    if (
      (player1Point.points === player2Point.points) ===
      computerPoint.points
    ) {
      alert("Nadie gana :(");
      return;
    }

    const playerWinner = playersPoints
      .filter((playerPoints) => playerPoints.points <= 21)
      .reduce(
        (acc, playerPoint) => {
          if (acc.points < playerPoint.points) acc = playerPoint;

          return acc;
        },
        { points: 0, id: "computer" }
      );

    console.log("🚀 ~ setTimeout ~ playerWinner", playerWinner);

    alert(`${playerWinner.id} gana!`);
  }, 400);
};

// Acumula los puntos de los jugadores
const accumulatePoints = ({ card, turn }) => {
  playersPoints[turn].points += getCardValue(card);
  pointsHTML[turn].textContent = playersPoints[turn].points;

  return playersPoints[turn];
};

// Crea la carta en el HTML
const createCard = ({ card, turn }) => {
  const imgCard = document.createElement("img");
  imgCard.src = `assets/${card}.png`;
  imgCard.classList.add("card");
  playerCards[turn].append(imgCard);
};

// Ejecuta el turno de la computadora
const computerTurn = (minPoints) => {
  setTurn(playersPoints.length - 1);
  let computerPoints = 0;

  do {
    const card = getCard();
    computerPoints = accumulatePoints({ card, turn: playersPoints.length - 1 });
    createCard({ card, turn: playersPoints.length - 1 });
  } while (computerPoints < minPoints && minPoints <= 21);

  determinateWinner(playersPoints);
};

// Esta función desactiva los botones pedir y detener
const disableButtons = () => {
  btnOrder.disabled = true;
  btnStop.disabled = true;
};

// Esta función activa los botones pedir y detener
const enableButtons = () => {
  btnOrder.disabled = false;
  btnStop.disabled = false;
};

const nextTurn = () => {
  turn += 1;

  setTurn(turn);
};

const setTurn = (turn) => {
  turnHTML.textContent = `- Turno de ${playersPoints[turn].id}`;
};

const isTheLastTurn = () => {
  return turn === playersPoints.length - 2;
};

/** Events */

// Inicia un nuevo juego
btnInit.addEventListener("click", () => {
  init();
});

// Pide una nueva carta
btnOrder.addEventListener("click", () => {
  const card = getCard();
  const _playerPoints = accumulatePoints({ card, turn });
  createCard({ card, turn });

  if (_playerPoints.points < 21) return;

  /** Pasar al siguiente jugador */
  if (!isTheLastTurn()) {
    nextTurn();
    return;
  }

  disableButtons();
  computerTurn(Math.min(...playersPoints));
});

// Detiene el turno del jugador
btnStop.addEventListener("click", () => {
  if (!isTheLastTurn()) {
    nextTurn();
    return;
  }

  disableButtons();
  computerTurn(Math.min(...playersPoints));
});