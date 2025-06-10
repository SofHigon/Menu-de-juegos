import React, { useState } from 'react';
import './App.css';
import JuegoCuadro from './components/JuegoCuadro/JuegoCuadro';
import JuegoMemoria from './components/JuegoMemoria/JuegoMemoria';
import JuegoCulebrita from './components/JuegoCulebrita/JuegoCulebrita';
import kittyImage from './assets/kitty.jpeg';
import melodyImage from './assets/melody.jpeg';
import kuromiImage from './assets/kuromi.jpeg';

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [nombreJugador, setNombreJugador] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    if (nombreJugador.trim() !== '') {
      setPantalla('menu');
    }
  };

  const volverMenu = () => setPantalla('menu');

  return (
    <div className="app-container">
      {pantalla === 'inicio' && (
        <div className="inicio-container">
          <h1 className="titulo-principal">🌸 Hello Kitty & Friends: Game Paradise 🌸</h1>
          <form onSubmit={handleStart} className="formulario-inicio">
            <div className="input-group">
              <label htmlFor="nombre">Ingresa tu nombre:</label>
              <input
                id="nombre"
                type="text"
                value={nombreJugador}
                onChange={(e) => setNombreJugador(e.target.value)}
                placeholder="Ej: Hello Kitty"
                required
              />
            </div>
            <button type="submit" className="boton-principal">
              Entrar al Mundo Hello Kitty
            </button>
          </form>
        </div>
      )}

      {pantalla === 'menu' && (
        <div className="menu-container">
          <h2 className="saludo">¡Hola, {nombreJugador}! 💗</h2>
          <p className="subtitulo">Elige tu juego favorito:</p>
          
          <div className="juegos-grid">
            <div className="juego-card" onClick={() => setPantalla('cuadro')}>
              <img src={kittyImage} alt="Hello Kitty" className="juego-imagen" />
              <h3>Kitty Catch!</h3>
              <p>Haz clic en los personajes que aparecen</p>
              <button className="boton-juego">Jugar</button>
            </div>
            
            <div className="juego-card" onClick={() => setPantalla('memoria')}>
              <img src={melodyImage} alt="My Melody" className="juego-imagen" />
              <h3>My Melody Memory</h3>
              <p>Encuentra todas las parejas</p>
              <button className="boton-juego">Jugar</button>
            </div>
            
            <div className="juego-card" onClick={() => setPantalla('culebrita')}>
              <img src={kuromiImage} alt="Kuromi" className="juego-imagen" />
              <h3>Aventura de Kuromi</h3>
              <p>Guía a Kuromi para comer dulces</p>
              <button className="boton-juego">Jugar</button>
            </div>
          </div>
        </div>
      )}

      {pantalla === 'cuadro' && <JuegoCuadro volverMenu={volverMenu} nombreJugador={nombreJugador} />}
      {pantalla === 'memoria' && <JuegoMemoria volverMenu={volverMenu} nombreJugador={nombreJugador} />}
      {pantalla === 'culebrita' && <JuegoCulebrita volverMenu={volverMenu} nombreJugador={nombreJugador} />}
    </div>
  );
}

export default App;