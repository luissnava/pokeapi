import { useContext } from "react";
import { globalContext } from "../context/Globalcontext";

const PokemonsView: React.FC = () => {
  const context = useContext(globalContext);
  if (!context) {
    return null;
  }
  const { searchText, searchPokemon, setSearchText, loading, initialLoading, error, viewMode, pokemon, backToGrid, capitalize, getTypeColor, pokemonList } = context;
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
      <a href="https://pokeapi.co/docs/v2" target="_blank" rel="noopener noreferrer">
        <img src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="logo" width={200} height={200} />
      </a>
      <div className="max-w-6xl w-full flex flex-col items-center text-center space-y-6 p-6">
        <h1 className="text-4xl font-light text-gray-800">Pokédex</h1>

        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar Pokémon por nombre"
            className="flex-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            onKeyDown={(e) => e.key === "Enter" && searchPokemon()}
          />
          <button
            onClick={searchPokemon}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Loader para cualquier carga */}
        {(loading || initialLoading) && (
          <div className="w-full flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Vista detallada de un solo Pokémon */}
        {viewMode === "detail" && pokemon && (
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-2 flex justify-start">
              <button
                onClick={backToGrid}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                ← Volver a la lista
              </button>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Columna de imagen */}
              <div className="flex flex-col items-center md:w-1/3">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-48 h-48 object-contain"
                />
                <h2 className="text-2xl font-bold mt-2">
                  {capitalize(pokemon.name)} #{pokemon.id}
                </h2>
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map(type => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(type)}`}
                    >
                      {capitalize(type)}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-gray-600 text-sm italic">
                  {pokemon.description.replace(/\f/g, " ")}
                </p>
              </div>

              {/* Columna de datos */}
              <div className="md:w-2/3">

                {/* Estadísticas base */}
                <div>
                  <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
                    Estadísticas base
                  </h3>
                  <div className="space-y-2">
                    {pokemon.stats.map((stat, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between">
                          <span className="font-medium">{capitalize(stat.name)}</span>
                          <span>{stat.value}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, stat.value / 2)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de cuadrícula de Pokémon */}
        {viewMode === "grid" && !initialLoading && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pokemonList.map(pokemon => (
              <div
                key={pokemon.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center"
                onClick={() => {
                  setSearchText(pokemon.name);
                  searchPokemon();
                }}
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-24 h-24 object-contain"
                />
                <h3 className="font-medium mt-2">{capitalize(pokemon.name)}</h3>
                <span className="text-gray-500 text-sm">#{pokemon.id}</span>
                <div className="flex gap-1 mt-1">
                  {pokemon.types.map(type => (
                    <span
                      key={type}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}
                    >
                      {capitalize(type)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonsView;