// App.js

import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [playerInput, setPlayerInput] = useState('');
  const [playerList, setPlayerList] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [coinResult, setCoinResult] = useState('');

  const handlePlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerInput(event.target.value);
  };

  const handleAddPlayer = () => {
    if (playerInput.trim() !== '') {
      setPlayerList([...playerList, playerInput]);
      setPlayerInput('');
    }
  };

  const handleClearList = () => {
    setPlayerList([]);
    setTeam1([]);
    setTeam2([]);
  };

  const handleCoinToss = () => {
    const x = 'Kopf';
    const y = 'Zahl';

    setTimeout(() => setCoinResult('.'), 200);
    setTimeout(() => setCoinResult('..'), 500);
    setTimeout(() => setCoinResult('...'), 800);

    setTimeout(() => {
      const coinToss = Math.random() <= 0.5 ? x : y;
      setCoinResult(coinToss);
    }, 1500);
  };

  const handleGenerateTeams = () => {
    const shuffledPlayers = shuffleArray(playerList);
    const halfLength = Math.ceil(shuffledPlayers.length / 2);
    const firstTeam = shuffledPlayers.slice(0, halfLength);
    const secondTeam = shuffledPlayers.slice(halfLength);

    setTeam1(firstTeam);
    setTeam2(secondTeam);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div>
      <div className="header">TeamGeneraTor</div>
      <div className="in_outContainer">
        <div className="containerInput">
          <input
            type="text"
            value={playerInput}
            onChange={handlePlayerInputChange}
            placeholder="playerName"
          />
          <button onClick={handleAddPlayer}>Add player</button>
          <button onClick={handleCoinToss}>coinToss</button>
          <button onClick={handleGenerateTeams}>Gen teams</button>
          <button onClick={handleClearList}>Clear List</button>
        </div>
        <div className="containerTeams">
          <div className="teamContainer">Team 1: {team1.join(', ')}</div>
          <div className="teamContainer">Team 2: {team2.join(', ')}</div>
          <div id="parentContainer">{coinResult}</div>
          <div id="preTeamTable">{playerList.join(', ')}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
