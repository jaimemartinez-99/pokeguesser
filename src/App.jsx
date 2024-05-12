import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import colores from './colores';
import './App.css';
import medalla1 from './images/medalla1.webp';
import medalla2 from './images/medalla2.webp';
import medalla3 from './images/medalla3.webp';
import medalla4 from './images/medalla4.webp';
import medalla5 from './images/medalla5.webp';
import medalla6 from './images/medalla6.webp';
import medalla7 from './images/medalla7.webp';
import medalla8 from './images/medalla8.webp';

// Recupera el valor del almacenamiento local
const maxValue = localStorage.getItem('maxValue');
const maxNumber = getMaxNumber(maxValue);
console.log(maxNumber);
function getMaxNumber(value) {
  switch (value) {
    case '1':
      return 151;
    case '2':
      return 251;
    case '3':
      return 386;
    case '4':
      return 493;
    case '5':
      return 649;
    case '6':
      return 721;
    case '7':
      return 809;
    case '8':
      return 905;
    case '9':
      return 1025;
    default:
      return 1025; // Valor por defecto
  }
}

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [record, setRecord] = useState(0);
  const [maxNumber, setMaxNumber] = useState(getMaxNumber(localStorage.getItem('maxValue')));
  const [revealedLetters, setRevealedLetters] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayRecord, setDisplayRecord] = useState(0);
  const [revealLetterCount, setRevealLetterCount] = useState(0);
  const [lastPokemon, setLastPokemon] = useState('');
  const location = useLocation();

  let medalla;
  if (displayRecord < 3) {
    medalla = medalla1;
  } else if (displayRecord < 6) {
    medalla = medalla2;
  } else if (displayRecord < 9) {
    medalla = medalla3;
  } else if (displayRecord < 9) {
    medalla = medalla4;
  } else if (displayRecord < 12) {
    medalla = medalla5;
  } else if (displayRecord < 15) {
    medalla = medalla6;
  } else if (displayRecord < 18) {
    medalla = medalla7;
  } else if (displayRecord >= 18) {
    medalla = medalla8;
  }
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setMaxNumber(0);
    } else {
      setMaxNumber(getMaxNumber(localStorage.getItem('maxValue')));
    }
  }, [location]);

  const fetchPokemon = () => {
    const randomnumber = Math.floor(Math.random() * maxNumber) + 1; // Se elige un número aleatorio entre 1 y 151
    const url = `https://pokeapi.co/api/v2/pokemon/${randomnumber}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setPokemonData(data);
        console.log(data.name); // Muestra el nombre del Pokémon en la consola
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userInput.toLowerCase() === pokemonData.name) {
      setSuccessMessage('Correcto!');
      setRecord(record + 1);
      setDisplayRecord(record + 1);  // Se incrementa el récord en 1
      setUserInput('');
      setRevealLetterCount(0);
      setRevealedLetters(''); // Borrar las letras reveladas
      fetchPokemon();
    } else {
      setOpen(true);
      setDisplayRecord(record);
      setRecord(0); // Se resetea el récord a 0
      setSuccessMessage('');
      setUserInput('');
      setRevealedLetters(''); // Borrar las letras reveladas
      setLastPokemon(pokemonData.name);
      fetchPokemon();// Se muestra una alerta
    }
  };

  const handleRevealLetterClick = () => {
    if (pokemonData && revealedLetters.length < pokemonData.name.length) {
      const cost = 1 + revealLetterCount;
      if (record >= cost) {
        const pokemonName = pokemonData.name.toLowerCase();
        let nextLetterToReveal = '';
        let i;
      
        for (i = 0; i < pokemonName.length; i++) {
          if (pokemonName[i] !== userInput[i]) {
            nextLetterToReveal = pokemonName[i];
            break;
          }
        }
      
        if (nextLetterToReveal) {
          // Si la letra en la posición que se va a revelar no coincide con la letra del usuario, la reemplaza
          if (userInput[i] !== nextLetterToReveal) {
            setUserInput(userInput.slice(0, i) + nextLetterToReveal + userInput.slice(i + 1));
          }
          setRecord(record - cost);
          setRevealLetterCount(revealLetterCount + 1);
        }
      } else {
        alert('No tienes suficientes puntos para revelar una letra');
      }
    }
  };

  const handleResolveClick = () => {
    if (pokemonData) {
      if (record >= 8) { // Comprueba si el record es mayor o igual a 8
        const pokemonName = pokemonData.name;
        const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        setUserInput(capitalizedPokemonName);
        setRecord(record - 8);
      } else {
        alert('No tienes suficientes puntos para resolver');
      }
    }
  };

  return (
    <div className={`app-container ${open || infoOpen ? 'hidden' : ''}`}>
      <Link to="/" className="header-link" style={{ color: pokemonData ? colores[pokemonData.types[0].type.name] : '#000' }}><h1>Pokéguesser</h1></Link>
      {pokemonData && (
        <img className="pokemon-image" src={pokemonData.sprites.other['official-artwork'].front_default} alt="Pokemon" />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Introduce el nombre"
        />
        <button className="submit-button" type="submit">Enviar</button>
      </form>
      <b className="record-text">Record: {record}</b>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div className="pistas">
        <h3 className="pistas-text">Pistas</h3>
        <button className={`ayuda ${record < 1 ? 'button-disabled' : ''}`} onClick={handleRevealLetterClick} title="Coste: 1 punto">
          Revelar letra
        </button>
        <button className={`ayuda ${record < 8 ? 'button-disabled' : ''}`} onClick={handleResolveClick} title="Coste: 8 puntos">
          Resolver
        </button>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <h1>¡Has Perdido!</h1>
            <p>El Pokémon era: {lastPokemon.charAt(0).toUpperCase() + lastPokemon.slice(1)}</p>
            <div className="record-container">
              <b className='recordText'>Tu record final es: {displayRecord}</b>
              <img className="medalla" src={medalla} alt="Record" />
            </div>
            <button className="close" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </Popup>
      </div>
      <div>
        <button className="info-button" onClick={() => setInfoOpen(true)}>
          Información
        </button>
        <Popup open={infoOpen} closeOnDocumentClick onClose={() => setInfoOpen(false)}>
          <div className="modal">
            <h1>Información</h1>
            <p> El objetivo del juego es adivinar el Pokémon. Por cada acierto se sumará 1 a tu récord. </p>
            <p> Además, puedes utilizar los puntos obtenidos para canjearlos por pistas. </p> 
            <p> Revelar una letra cuesta 1 punto y revelar la palabra entera cuesta 8. </p>  
            <p> Puedes darle al título para volver a seleccionar Generación</p>
            <b> ¡Buena suerte!</b>
            <p></p>
            <button className="close" onClick={() => setInfoOpen(false)}>
              Cerrar
            </button>
          </div>
        </Popup>
      </div>
    </div>
  );
}
export default App;