export interface GlobalContextType {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  pokemon: PokemonDetail | null;
  setPokemon: React.Dispatch<React.SetStateAction<PokemonDetail | null>>;
  pokemonList: PokemonBasic[];
  setPokemonList: React.Dispatch<React.SetStateAction<PokemonBasic[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialLoading: boolean;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;

  searchPokemon: () => Promise<void>;
  capitalize: (str: string) => string;
  getTypeColor: (type: string) => string;
  backToGrid: () => void;
}
export interface PokemonBasic {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail extends PokemonBasic {
  abilities: PokemonAbility[];
  moves: string[];
  stats: PokemonStat[];
  description: string;
}
export type ViewMode = "grid" | "detail";