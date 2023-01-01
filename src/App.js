
import './App.css';
import Screen from './Components/Screen';
import Controls from './Components/Controls'
import Player from './Components/Player';

function App() {
  return (
    <div className="App">
      <div className="component-container">
        <Screen/>
        <Controls />
        {/* <Player/> */}
      </div>
    </div>
  );
}

export default App;
