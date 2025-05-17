import React, { useState, ReactNode, createContext, useEffect, useMemo } from 'react';
import { ViewMode } from '../type';
import { PokemonBasic, PokemonDetail, GlobalContextType } from '../type';
export const globalContext = createContext<GlobalContextType | undefined>(undefined);
interface GlobalProps {
  children: ReactNode;
}

const GlobalContext: React.FC<GlobalProps> = ({ children }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Cargar los primeros 100 Pokémons al inicio
  useEffect(() => {
    const getInitialPokemon = async (): Promise<void> => {
      try {
        setInitialLoading(true);
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json();

        // Obtener datos básicos de cada Pokémon
        const pokemonDetailsPromises = data.results.map(async (pokemon: { url: string }) => {
          const pokemonResponse = await fetch(pokemon.url);
          return await pokemonResponse.json();
        });

        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        // Mapear los datos para nuestro formato
        const formattedPokemonList: PokemonBasic[] = pokemonDetails.map((pokemon: any) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default,
          types: pokemon.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
        }));
        setPokemonList(formattedPokemonList);
      } catch (err) {
        setError("Error al cargar la lista de Pokémon");
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };

    getInitialPokemon();
  }, []);

  const searchPokemon = async (): Promise<void> => {
    if (!searchText.trim()) {
      // Si la búsqueda está vacía, mostrar la lista inicial
      setViewMode("grid");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPokemon(null);

      // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas
      const pokemonName = searchText.toLowerCase().trim();

      // Consultar datos básicos del Pokémon
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

      if (!response.ok) {
        throw new Error("Pokemon no encontrado");
      }

      const data = await response.json();

      // Consultar especies para obtener más detalles
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      // Organizar datos del Pokémon
      const pokemonData: PokemonDetail = {
        id: data.id,
        name: data.name,
        // Obtener la imagen oficial o la alternativa si no está disponible
        image: data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        // Mapear tipos
        types: data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
        // Mapear habilidades
        abilities: data.abilities.map((abilityInfo: { ability: { name: string }, is_hidden: boolean }) => ({
          name: abilityInfo.ability.name,
          isHidden: abilityInfo.is_hidden
        })),
        // Obtener los primeros 4 movimientos como representativos
        moves: data.moves.slice(0, 4).map((moveInfo: { move: { name: string } }) => moveInfo.move.name),
        // Mapear estadísticas base
        stats: data.stats.map((statInfo: { stat: { name: string }, base_stat: number }) => ({
          name: statInfo.stat.name,
          value: statInfo.base_stat
        })),
        // Obtener descripción en español si está disponible
        description: speciesData.flavor_text_entries.find(
          (entry: { language: { name: string } }) => entry.language.name === "es"
        )?.flavor_text || speciesData.flavor_text_entries.find(
          (entry: { language: { name: string } }) => entry.language.name === "en"
        )?.flavor_text || ""
      };

      setPokemon(pokemonData);
      setViewMode("detail");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  // Capitalizar primera letra
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
  };

  // Mapear nombres de tipos a colores de fondo
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      grass: "bg-green-500",
      electric: "bg-yellow-400",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-300",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-700",
      ghost: "bg-purple-700",
      dark: "bg-gray-800 text-white",
      dragon: "bg-indigo-700 text-white",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
      default: "bg-gray-200"
    };

    return typeColors[type] || typeColors.default;
  };

  // Función para volver a la vista de cuadrícula
  const backToGrid = (): void => {
    setViewMode("grid");
    setPokemon(null);
    setSearchText("");
  };

  const contextValue = useMemo(() => ({
  searchText,
  pokemon,
  pokemonList,
  loading,
  initialLoading,
  error,
  viewMode,
  setSearchText, 
  setPokemon,
  setPokemonList,
  setLoading,
  setInitialLoading,
  setError,
  setViewMode,
  
  // Functions
  searchPokemon,
  capitalize,
  getTypeColor,
  backToGrid
}), [
  searchText, pokemon, pokemonList, loading, 
  initialLoading, error, viewMode
]);

  return (
    <globalContext.Provider value={contextValue}>
      {children}
    </globalContext.Provider>
  );
};

export default GlobalContext;
