import React, { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";

import TypeCard from "./TypeCard";
import Modal from "./Modal";

const PokeCard = (props) => {
  const { selectedPokemon } = props;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, ability, stats, types, moves, sprites } = data || {};
  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });
  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) return;

    // chech cache for move
    let c = {};
    if (localStorage.getItem("pokemon-moves")) {
      c = JSON.parse(localStorage.getItem("pokemon-moves"));
    }

    if (move in c) {
      setSkill(c[move]);
      console.log("Found move in cache");
      return;
    }
    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData =await res.json();
      console.log("Fetched move from api", moveData);
      const description = moveData?.flavor_text_entries.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      c[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(c));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSkill(false);
    }
  }
  useEffect(() => {
    // if loading, exit loop
    if (loading || !localStorage) return;

    // check if the selcted pokemon information is availabele in th cache
    // 1.define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    // 2. check if the selected pokemon is in the cache, otherwise fetch from API
    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      console.log("Found pokemon in cache");
      return;
    }

    // passed all the catch staff to no avail and we need to fetch the data from the api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;

        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        console.log("Fetched pokemon data");
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();

    // 3. if we fetch from thr api, make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-"," ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return (
          <TypeCard key={typeIndex} type={typeObj?.type?.name} />
        )})}
      </div>
      <img
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
        className="default-image"
      />
      <div className="image-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObje, moveIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() => {
                fetchMoveData(moveObje?.move?.name, moveObje?.move?.url)
              }}
            >
              <p>{moveObje?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokeCard;
