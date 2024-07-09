import { useReducer } from 'react';
import './App.css';
import Borad from './components/Board/Board';
import AppContext from './contexts/Context';
import { reducer } from './reducer/Reducer';
import { initGame } from './constant';
import Control from './components/Control/Control';
import TakeBack from './components/Control/bits/TakeBack';

function App() {

  const [appState, dispatch] = useReducer(reducer, initGame)
  const providerState = {
    appState,
    dispatch
  }
  return (
    <AppContext.Provider value={providerState}>
      <div className="App">
        <Borad />
        <Control>
          <TakeBack />
        </Control>
      </div>
    </AppContext.Provider>
  );
}

export default App;
