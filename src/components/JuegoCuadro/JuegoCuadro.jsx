import React, { useState, useEffect } from 'react';
import './JuegoCuadro.css';

import HelloKitty from '../../assets/Sanrio/personaje1.png';
import Kuromi from '../../assets/Sanrio/personaje2.png';
import Cinnamoroll from '../../assets/Sanrio/personaje4.png';
import MyMelody from '../../assets/Sanrio/personaje3.png';
import sonidoAtrapado from '../../assets/Sonidos/poop.mp3'; 

function JuegoCuadro({ volverMenu }) {
  const [nombre, setNombre] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [posicion, setPosicion] = useState({ top: '50%', left: '50%' });
  const [tiempo, setTiempo] = useState(30);
  const [jugando, setJugando] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [imagenActual, setImagenActual] = useState(HelloKitty);
  const [tamanioCuadrado, setTamanioCuadrado] = useState({ width: 120, height: 120 }); 
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const personajes = [
    { nombre: 'Hello Kitty', imagen: HelloKitty, tamanio: { width: 120, height: 120 } },
    { nombre: 'Kuromi', imagen: Kuromi, tamanio: { width: 120, height: 120 } },
    { nombre: 'My Melody', imagen: Cinnamoroll, tamanio: { width: 120, height: 120 } },
    { nombre: 'Cinnamoroll', imagen: MyMelody, tamanio: { width: 120, height: 120 } }
  ];

  const sonido = new Audio(sonidoAtrapado);

  useEffect(() => {
    const rankingGuardado = localStorage.getItem('rankingSanrioAtrapa');
    if (rankingGuardado) {
      setRanking(JSON.parse(rankingGuardado));
    }
  }, []);

  const iniciarJuego = () => {
    if (!nombre) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    setPuntos(0);
    setTiempo(30);
    setJugando(true);
    setJuegoTerminado(false);
    moverCuadrado();
  };

  const moverCuadrado = () => {
    const top = Math.random() * 85 + '%';
    const left = Math.random() * 85 + '%';
    setPosicion({ top, left });
  };

  const manejarClick = () => {
    setPuntos(puntos + 1);
    sonido.play(); // Reproducir 
    moverCuadrado();
  };

  const finalizarJuego = () => {
    setJugando(false);
    setJuegoTerminado(true);

    const nuevoRegistro = {
      nombre: nombre,
      puntos: puntos,
      fecha: new Date().toLocaleDateString(),
      personaje: personajes.find(p => p.imagen === imagenActual).nombre,
      tiempo: 30 - tiempo
    };

    const nuevoRanking = [...ranking, nuevoRegistro]
      .sort((a, b) => b.puntos - a.puntos || a.tiempo - b.tiempo)
      .slice(0, 5);

    setRanking(nuevoRanking);
    localStorage.setItem('rankingSanrioAtrapa', JSON.stringify(nuevoRanking));
  };

  const volverAlInicio = () => {
    setJuegoTerminado(false);
  };

  useEffect(() => {
    if (jugando && tiempo > 0) {
      const timer = setInterval(() => setTiempo(tiempo - 1), 1000);
      return () => clearInterval(timer);
    } else if (tiempo === 0 && jugando) {
      finalizarJuego();
    }
  }, [jugando, tiempo]);

  const cambiarPersonaje = (personaje) => {
    setImagenActual(personaje.imagen);
    setTamanioCuadrado(personaje.tamanio);
  };

  const borrarRanking = () => {
    localStorage.removeItem('rankingSanrioAtrapa');
    setRanking([]);
  };

  return (
    <div className="juego-atrapa">
      <h2>✨ Atrapa al Personaje! ✨</h2>

      {juegoTerminado ? (
        <div className="pantalla-final">
          <h3>¡Juego terminado, {nombre}!</h3>
          <p>Puntuación final: {puntos}</p>
          <button onClick={volverAlInicio}>Jugar de nuevo</button>
          <button onClick={volverMenu}>Volver al menú</button>
        </div>
      ) : jugando ? (
        <div className="pantalla-juego">
          <div className="info-juego">
            <p>Puntos: {puntos}</p>
            <p>Tiempo: {tiempo}s</p>
          </div>

          <div
            className="personaje"
            style={{
              top: posicion.top,
              left: posicion.left,
              width: `${tamanioCuadrado.width}px`,
              height: `${tamanioCuadrado.height}px`,
              backgroundImage: `url(${imagenActual})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              position: 'absolute',
              cursor: 'pointer'
            }}
            onClick={manejarClick}
          ></div>
        </div>
      ) : (
        <div className="pantalla-inicio">
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <h3>Elige tu personaje:</h3>
          <div className="selector-personajes">
            {personajes.map((personaje) => (
              <div
                key={personaje.nombre}
                className={`opcion-personaje ${imagenActual === personaje.imagen ? 'seleccionado' : ''}`}
                onClick={() => cambiarPersonaje(personaje)}
              >
                <img 
                  src={personaje.imagen} 
                  alt={personaje.nombre}
                  style={{ width: '120px', height: '120px' }} 
                />
                <span>{personaje.nombre}</span>
              </div>
            ))}
          </div>

          <button onClick={iniciarJuego}>Comenzar Juego</button>
          <button onClick={volverMenu}>Volver al menú</button>
          

          {ranking.length > 0 && (
            <div className="ranking">
              <h3>🏆 Top 5 Jugadores</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Puntos</th>
                    <th>Personaje</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((jugador, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{jugador.nombre}</td>
                      <td>{jugador.puntos}</td>
                      <td>{jugador.personaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={borrarRanking}>🗑️ Borrar Ranking</button>
            </div>
          )}
        </div>
      )}
    </div>
    
  );
  
}

export default JuegoCuadro;
