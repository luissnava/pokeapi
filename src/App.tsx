import GlobalContext from './context/Globalcontext';
import PokemonsView from './components/PokemonDashboard';


function App() {
  return (
    <GlobalContext>
      <PokemonsView />
    </GlobalContext>
  );
}

export default App;
