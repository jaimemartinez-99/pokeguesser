import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import colores from './colores';  
import './App.css';
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
  const location = useLocation();
  const [maxNumber, setMaxNumber] = useState(getMaxNumber(localStorage.getItem('maxValue')));

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
      .then(data => setPokemonData(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userInput.toLowerCase() === pokemonData.name) {
      setSuccessMessage('Correcto!');
      setRecord(record + 1); // Se incrementa el récord en 1
      setUserInput('');
      fetchPokemon();
    } else {
      setSuccessMessage('');
      setRecord(0); // Se resetea el récord a 0
      alert('Has fallado, debes empezar de nuevo');
      fetchPokemon();// Se muestra una alerta
    }
  };

  return (
    <div className="app-container">
    <Link to="/" className="header-link" style={{ color: pokemonData ? colores[pokemonData.types[0].type.name] : '#000' }}><h1>Pokéguesser</h1></Link>      
      {pokemonData && (
        <img className="pokemon-image" src={pokemonData.sprites.other['official-artwork'].front_default} alt="Pokemon" />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Introduce el nombre"
        />
        <button className="submit-button" type="submit">Submit</button>
      </form>
      <b>Record: {record}</b>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default App;