import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { first151Pokemon, getFullPokedexNumber } from "../utils";
const SideNav = (props) => {
  const { selectedPokemon, setSelectedPokemon, handleCloseMenu,showSideMenu } = props;

  const [serchValue, setSerchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    // if full pokedex number includes the current search value, return true
    if ((getFullPokedexNumber(eleIndex)).includes(serchValue))
      return true;

    // if the pokemon name includes the current search value, return true
    if (ele.toLowerCase().includes(serchValue.toLowerCase())) return true;

    // otherwise exclude from the array
    return false;
  });
  return (
    <nav className={''+ (showSideMenu ? "open":'')}>
      <div className={"header" + (showSideMenu ? "open":'')}  style={{display:'flex', alignItems:'center', gap:'10px'}}>
        <button onClick={handleCloseMenu}
        className="open-nav-button">
          <FaArrowLeftLong style={{fontSize:'24px'}} />
        </button>
        <h1 className="text-gradient">Pokedex</h1>
      </div>
      <input
        value={serchValue}
        onChange={(e) => {
          setSerchValue(e.target.value);
        }}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexnumber = first151Pokemon.indexOf(pokemon)
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexnumber);
              handleCloseMenu()
            }}
            className={
              "nav-card" +
              (pokemonIndex === selectedPokemon ? "nav-card-selected " : "")
            }
            key={pokemonIndex}
          >
            <p>{getFullPokedexNumber(truePokedexnumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;
