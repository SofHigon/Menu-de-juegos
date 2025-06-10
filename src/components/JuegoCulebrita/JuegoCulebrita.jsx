import React, { useState, useEffect, useRef } from 'react';
import './JuegoCulebrita.css';

const TAMAÑO_TABLERO = 10;
const DIRECCIONES = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};
const SERPIENTE_INICIAL = [[5, 5]];
const DIRECCION_INICIAL = [1, 0];

function JuegoCulebrita({ volverMenu, nombreJugador }) {
  const [serpiente, setSerpiente] = useState(SERPIENTE_INICIAL);
  const [direccion, setDireccion] = useState(DIRECCION_INICIAL);
  const [comida, setComida] = useState(generarComida());
  const [puntaje, setPuntaje] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [velocidad, setVelocidad] = useState(300);
  const [intentos, setIntentos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [mejoresPuntuaciones, setMejoresPuntuaciones] = useState(() => {
    const rankingGuardado = localStorage.getItem('rankingSerpiente');
    return rankingGuardado ? JSON.parse(rankingGuardado) : [];
  });
  
  const intervaloJuego = useRef(null);
  const intervaloTiempo = useRef(null);
  const ultimaDireccion = useRef(DIRECCION_INICIAL);

  function generarComida() {
    let nuevaComida;
    do {
      nuevaComida = [
        Math.floor(Math.random() * TAMAÑO_TABLERO),
        Math.floor(Math.random() * TAMAÑO_TABLERO)
      ];
    } while (serpiente.some(segmento => segmento[0] === nuevaComida[0] && segmento[1] === nuevaComida[1]));
    return nuevaComida;
  }

  useEffect(() => {
    const manejarTecla = (e) => {
      if (!jugando) return;
      
      const nuevaDireccion = DIRECCIONES[e.key];
      if (nuevaDireccion) {
        const [ultimaX, ultimaY] = ultimaDireccion.current;
        const [nuevaX, nuevaY] = nuevaDireccion;
        if (!(ultimaX === -nuevaX && ultimaY === -nuevaY)) {
          setDireccion(nuevaDireccion);
        }
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [jugando]);

  useEffect(() => {
    if (!jugando) return;

    intervaloTiempo.current = setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);

    intervaloJuego.current = setInterval(moverSerpiente, velocidad);

    return () => {
      clearInterval(intervaloJuego.current);
      clearInterval(intervaloTiempo.current);
    };
  }, [jugando, velocidad, direccion]);

  function moverSerpiente() {
    setSerpiente(serpienteActual => {
      const [cabezaX, cabezaY] = serpienteActual[0];
      const [dx, dy] = direccion;
      const nuevaCabeza = [cabezaX + dx, cabezaY + dy];

      if (
        nuevaCabeza[0] < 0 || nuevaCabeza[0] >= TAMAÑO_TABLERO ||
        nuevaCabeza[1] < 0 || nuevaCabeza[1] >= TAMAÑO_TABLERO ||
        serpienteActual.some(([x, y]) => x === nuevaCabeza[0] && y === nuevaCabeza[1])
      ) {
        terminarJuego();
        return serpienteActual;
      }

      const nuevaSerpiente = [nuevaCabeza, ...serpienteActual];
      
      if (nuevaCabeza[0] === comida[0] && nuevaCabeza[1] === comida[1]) {
        setPuntaje(p => p + 1);
        setComida(generarComida());
        return nuevaSerpiente;
      }
      
      const serpienteMovida = [...nuevaSerpiente];
      serpienteMovida.pop();
      return serpienteMovida;
    });
    ultimaDireccion.current = direccion;
  }

  function iniciarJuego() {
    setSerpiente(SERPIENTE_INICIAL);
    setDireccion(DIRECCION_INICIAL);
    ultimaDireccion.current = DIRECCION_INICIAL;
    setComida(generarComida());
    setPuntaje(0);
    setTiempo(0);
    setJugando(true);
    setIntentos(i => i + 1);
  }

  function terminarJuego() {
    setJugando(false);
    guardarPuntaje();
  }

  function guardarPuntaje() {
    const nuevoRanking = [
      ...mejoresPuntuaciones,
      { 
        jugador: nombreJugador, 
        puntaje, 
        tiempo,
        intentos: intentos + 1,
        fecha: new Date().toLocaleDateString()
      }
    ];
    
    const rankingOrdenado = nuevoRanking.sort((a, b) => b.puntaje - a.puntaje || a.tiempo - b.tiempo).slice(0, 5);
    
    setMejoresPuntuaciones(rankingOrdenado);
    localStorage.setItem('rankingSerpiente', JSON.stringify(rankingOrdenado));
  }

  function borrarRanking() {
    localStorage.removeItem('rankingSerpiente');
    setMejoresPuntuaciones([]);
  }

  return (
    <div className="juego-culebrita">
      <h2> 🐍 Aventuras de Kuromi 🐍</h2>
      
      <div className="contenedor-principal">
        {/*  Tablero */}
        <div className="columna-tablero">
          <div className="tablero-container">
            <div className="tablero">
              {Array.from({ length: TAMAÑO_TABLERO }).map((_, y) => (
                <div key={y} className="fila">
                  {Array.from({ length: TAMAÑO_TABLERO }).map((_, x) => {
                    const esSerpiente = serpiente.some(([sx, sy]) => sx === x && sy === y);
                    const esCabeza = serpiente[0][0] === x && serpiente[0][1] === y;
                    const esComida = comida[0] === x && comida[1] === y;
                    
                    return (
                      <div 
                        key={x}
                        className={`
                          celda 
                          ${esSerpiente ? 'serpiente' : ''} 
                          ${esCabeza ? 'cabeza' : ''}
                          ${esComida ? 'comida' : ''}
                        `}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="controles-juego">
            <div className="control-velocidad">
              <label>Velocidad:</label>
              <select 
                value={velocidad} 
                onChange={(e) => setVelocidad(Number(e.target.value))}
                disabled={jugando}
              >
                <option value="500">Fácil</option>
                <option value="300">Normal</option>
                <option value="150">Difícil</option>
              </select>
            </div>
            
            <button 
              onClick={iniciarJuego} 
              disabled={jugando}
              className="boton-iniciar"
            >
              {jugando ? 'Jugando...' : 'Iniciar Juego'}
            </button>
          </div>
        </div>
        
        {/* Información y ranking */}
        <div className="columna-info">
          <div className="info-juego">
            <div className="info-caja">
              <span>Puntaje:</span>
              <strong>{puntaje}</strong>
            </div>
            <div className="info-caja">
              <span>Tiempo:</span>
              <strong>{tiempo}s</strong>
            </div>
            <div className="info-caja">
              <span>Intentos:</span>
              <strong>{intentos}</strong>
            </div>
          </div>
          
          {!jugando && puntaje > 0 && (
            <div className="mensaje-fin">
              <h3>¡Juego Terminado!</h3>
              <p>Puntaje final: {puntaje} | Tiempo: {tiempo}s</p>
            </div>
          )}
          
          <div className="ranking">
            <h3>🏆 Top 5 Jugadores</h3>
            
            {mejoresPuntuaciones.length > 0 ? (
              <div className="tabla-ranking">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Jugador</th>
                      <th>Puntos</th>
                      <th>Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mejoresPuntuaciones.map((jugador, index) => (
                      <tr key={`${jugador.jugador}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{jugador.jugador}</td>
                        <td>{jugador.puntaje}</td>
                        <td>{jugador.tiempo}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="sin-registros">No hay registros aún</p>
            )}
            
            <button 
              onClick={borrarRanking} 
              className="boton-borrar"
              disabled={mejoresPuntuaciones.length === 0}
            >
              🗑️ Borrar Ranking
            </button>
          </div>
        </div>
      </div>
      
      <div className="instrucciones">
        <p>Usa las flechas del teclado para mover la serpiente</p>
      </div>

      <button onClick={volverMenu} className="boton-volver">
        Volver al Menú 
      </button>
    </div>
  );
}

export default JuegoCulebrita;