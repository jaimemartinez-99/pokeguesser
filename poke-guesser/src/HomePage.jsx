import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [variable, setVariable] = useState(null);
  const handleClick = (value) => {
    // Guarda el valor en el almacenamiento local
    localStorage.setItem('maxValue', value);
  };

  return (
    <div className="home-container">
    <h1 className="title">PokéGuesser</h1>
    <h2 className="title">Elige tu generación favorita</h2>
      {[...Array(9)].map((_, i) => (
        <Link key={i} to="/app" onClick={() => handleClick(i + 1)}>
          <button>Gen {i + 1}</button>
        </Link>
      ))}
    </div>
  );
}

export default HomePage;