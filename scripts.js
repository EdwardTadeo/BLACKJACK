// Referencias del DOM
const btnNuevoJuego = document.querySelector("#btnNuevoJuego"),
  btnPedirCarta = document.querySelector("#btnPedirCarta"),
  btnDetener = document.querySelector("#btnDeneter"),
  puntosHTML = document.querySelectorAll("small"),
  jugadoresCartas = document.querySelectorAll(".cards"),
  turnoJugadores = document.querySelector("#turno");

// Variables
let baraja = [],
  jugadoresPuntos = [];
  turno=0;

/**
 * C = Treboles
 * D = Diamantes
 * H = Corazones
 * S = Espadas
 */

const tipos = ["C", "D", "H", "S"],
  especiales = ["A", "J", "Q", "K"];

/** Inicializa la app */
const init = (cantidadJugadores = 3) => {
  baraja = crearBaraja();
  jugadoresPuntos = [];
  turno=0;

  for (let i = 0; i < cantidadJugadores; i++) {
    jugadoresPuntos.push({
      id: i < cantidadJugadores - 1 ? `Jugador ${i + 1}` : "computadora",
      points: 0,
    });
  }

  for (let jugador in jugadoresPuntos) {
    puntosHTML[jugador].textContent = 0;
    jugadoresCartas[jugador].textContent = "";
  }

  habilitarBotones();
  CambiarTurno(turno);
};

const habilitarBotones = () => {
  btnPedirCarta.disabled = false;
  btnDetener.disabled = false;
};

const deshabilitarBotones = () => {
  btnPedirCarta.disabled = true;
  btnDetener.disabled = true;
};

//Nuevo Turno
const NuevoTurno = () => {
  turno += 1;

  CambiarTurno(turno);
};
//Cambiar de turno
const CambiarTurno = (turno) => {
  turnoJugadores.textContent = `- Turno de ${jugadoresPuntos[turno].id}`;
};
//Cambiar a turno de la computadora
const UltimoTurno = () => {
  return turno === jugadoresPuntos.length - 2;
};


/** Se encarga de crear la baraja */
const crearBaraja = () => {
  baraja = [];

  for (let tipo of tipos) {
    for (let i = 2; i <= 10; i++) {
      baraja.push(i + tipo);
    }

    for (let especial of especiales) baraja.push(especial + tipo);
  }

  return _.shuffle(baraja);
};

/** Se encarga de obtener una carta */
const obtenerCarta = () => {
  if (baraja.length <= 0) throw "No hay cartas en la baraja";

  return baraja.pop();
};

/**
 * - Obtener valor de la carta
 * - Acumular puntos
 *
 *
 */
//Acumula los puntos de los jugadores
const acumularPuntos = ({ carta, turno }) => {
  jugadoresPuntos[turno].points += obtenerValorDeCarta(carta);
  puntosHTML[turno].textContent = jugadoresPuntos[turno].points;

  return jugadoresPuntos[turno];
};
//Devuelve el valor de la carta
const obtenerValorDeCarta = (carta) => {
  const valor = carta.substring(0, carta.length - 1);

  return !isNaN(valor) ? valor * 1 : valor === "A" ? 11 : 10;
};
//Crear carta
const crearCarta = ({ carta, turno }) => {
  const imagen = document.createElement("img");
  imagen.src = `assets/${carta}.png`;
  imagen.classList.add("carta");
  jugadoresCartas[turno].append(imagen);
};
//Iniciar turno de la computadora
const turnoComputadora = (puntosMinimos) => {
  CambiarTurno(jugadoresPuntos.length - 1);
  let computadoraPuntos = 0;

  do {
    const carta = obtenerCarta();
    computadoraPuntos = acumularPuntos({
      carta,
      turno: jugadoresPuntos.length - 1,
    });
    crearCarta({ carta, turno: jugadoresPuntos.length - 1 });
  } while (computadoraPuntos < puntosMinimos && puntosMinimos <= 21);

  determinarGanador(jugadoresPuntos);
};
//Determinar el ganador
const determinarGanador = (jugadoresPuntos) => {
  const [jugador1Puntos, jugador2Puntos,computadoraPuntos]=jugadoresPuntos;
  setTimeout(() => {
    if ((jugador1Puntos.points===jugador2Puntos.points)===computadoraPuntos.points ){
      alert("Nadie Gana!");
      return;
    }
    const JugadorGanador=jugadoresPuntos

    .filter((jugadorPuntos) => jugadorPuntos.points <= 21)
    .reduce(
      (acumulador, jugadorPuntos) => {
        if (acumulador.points < jugadorPuntos.points) acumulador = jugadorPuntos;

        return acumulador;
      },
      { points: 0, id: "Computadora" }
    );


  alert(`HA GANADO EL ${JugadorGanador.id}!`);
}, 400);
};

// Eventos;
btnNuevoJuego.addEventListener("click", () => {
  init();
});
//Pedir carta
btnPedirCarta.addEventListener("click", () => {
  const carta = obtenerCarta();
  const jugadorPuntos = acumularPuntos({ carta, turno });
  crearCarta({ carta, turno });

  if (jugadorPuntos.points < 21) return;

  if(!UltimoTurno()){
    NuevoTurno();
    return;
  }

  deshabilitarBotones();
  turnoComputadora(Math.max(...jugadoresPuntos));
});

btnDetener.addEventListener("click", () => {
  if(!UltimoTurno()){
    NuevoTurno();
    return;
  }
  deshabilitarBotones();
  turnoComputadora(Math.max(...jugadoresPuntos));
});
