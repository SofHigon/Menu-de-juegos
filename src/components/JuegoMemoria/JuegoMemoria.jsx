import React, { useState, useEffect } from 'react';
import './JuegoMemoria.css';

import A1 from '../../assets/MelodyA/A1.jpeg';
import A2 from '../../assets/MelodyA/A2.jpeg';
import A3 from '../../assets/MelodyA/A3.jpeg';
import A4 from '../../assets/MelodyA/A4.jpeg';
import A5 from '../../assets/MelodyA/A5.jpeg';
import A6 from '../../assets/MelodyA/A6.jpeg';

import M1 from '../../assets/MelodyEs/M1.jpeg';
import M2 from '../../assets/MelodyEs/M2.jpeg';
import M3 from '../../assets/MelodyEs/M3.jpeg';
import M4 from '../../assets/MelodyEs/M4.jpeg';
import M5 from '../../assets/MelodyEs/M5.jpeg';
import M6 from '../../assets/MelodyEs/M6.jpeg';

const temas = {
  'amigos de my melody': [A1, A2, A3, A4, A5, A6],
  'melody fashion time': [M1, M2, M3, M4, M5, M6]
};

function JuegoMemoria({ volverMenu, nombreJugador }) {
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [intentos, setIntentos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [tema, setTema] = useState('amigos de my melody');
  const [jugando, setJugando] = useState(false);

  useEffect(() => {
    if (jugando) {
      const timer = setTimeout(() => setTiempo(t => t + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [jugando, tiempo]);

  const iniciarJuego = () => {
    const baraja = [...temas[tema], ...temas[tema]]
      .sort(() => 0.5 - Math.random())
      .map((simbolo, i) => ({ id: i, simbolo }));

    setCartas(baraja);
    setEncontradas([]);
    setSeleccionadas([]);
    setIntentos(0);
    setTiempo(0);
    setJugando(true);
  };

  const seleccionar = (carta) => {
    if (
      seleccionadas.length === 2 ||
      seleccionadas.includes(carta) ||
      encontradas.some(c => c.id === carta.id)
    ) return;

    const nuevas = [...seleccionadas, carta];
    setSeleccionadas(nuevas);

    if (nuevas.length === 2) {
      setIntentos(i => i + 1);

      if (nuevas[0].simbolo === nuevas[1].simbolo) {
        setEncontradas([...encontradas, ...nuevas]);
        setSeleccionadas([]);

        if (encontradas.length + 2 === temas[tema].length * 2) {
          setJugando(false);
          guardarRanking();
        }
      } else {
        setTimeout(() => setSeleccionadas([]), 1000);
      }
    }
  };

  const guardarRanking = () => {
    const ranking = JSON.parse(localStorage.getItem('rankingMemoria')) || [];
    ranking.push({ nombre: nombreJugador, intentos, tiempo });
    ranking.sort((a, b) => (a.intentos - b.intentos) || (a.tiempo - b.tiempo));
    const top5 = ranking.slice(0, 5);
    localStorage.setItem('rankingMemoria', JSON.stringify(top5));
    setTop(top5); 
  };

  const [top, setTop] = useState(() => JSON.parse(localStorage.getItem('rankingMemoria')) || []);

  const borrarRanking = () => {
    localStorage.removeItem('rankingMemoria');
    setTop([]); 
  };

  // Ajustar el número de columnas en base al número de cartas
  const numColumnas = Math.ceil(Math.sqrt(cartas.length));

  return (
    <div className="juego-memoria">
      <h2>🎀My Melody Memory🎀</h2>

      <label>Elegir tema:</label>
      <select
        value={tema}
        onChange={e => setTema(e.target.value)}
        disabled={jugando}
      >
        <option value="amigos de my melody">Amigos de My Melody</option>
        <option value="melody fashion time">Melody Fashion Time</option>
      </select>

      <button onClick={iniciarJuego}>Iniciar</button>

      <p>Intentos: {intentos} | Tiempo: {tiempo}s</p>

      <div className="tablero" style={{ gridTemplateColumns: `repeat(${numColumnas}, 75px)` }}>
        {cartas.map(carta => (
          <div
            key={carta.id}
            className={`carta ${seleccionadas.includes(carta) || encontradas.some(c => c.id === carta.id) ? 'volteada' : ''}`}
            onClick={() => seleccionar(carta)}
          >
            <div className="contenido">
              {seleccionadas.includes(carta) || encontradas.some(c => c.id === carta.id) ? (
                <img src={carta.simbolo} alt="My Melody" />
              ) : (
                "?"
              )}
            </div>
          </div>
        ))}
      </div>

      {!jugando && intentos > 0 && <h3>¡Juego terminado!</h3>}

      {top.length > 0 && (
        <div className="ranking">
          <h3>🏆 Top 5 jugadores</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Intentos</th>
                <th>Tiempo (s)</th>
              </tr>
            </thead>
            <tbody>
              {top.map((jugador, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{jugador.nombre}</td>
                  <td>{jugador.intentos}</td>
                  <td>{jugador.tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={borrarRanking}>🗑️ Borrar Ranking</button>
        </div>
      )}

      <button onClick={volverMenu}>Volver al menú</button>
    </div>
  );
}

export default JuegoMemoria;
