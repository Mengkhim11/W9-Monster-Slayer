import { useState } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [battleLog, setBattleLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  const attackMonster = () => {
    const damage = getRandomValue(5, 12);
    const newMonsterHealth = Math.max(0, monsterHealth - damage);
    setMonsterHealth(newMonsterHealth);
    
    const log = createLogAttack(false, damage);
    setBattleLog(prev => [log, ...prev]);
    
    if (newMonsterHealth <= 0) {
      endGame('player');
      return;
    }
    
    monsterAttack();
  };

  const specialAttack = () => {
    const damage = getRandomValue(10, 25);
    const newMonsterHealth = Math.max(0, monsterHealth - damage);
    setMonsterHealth(newMonsterHealth);
    
    const log = createLogAttack(false, damage);
    setBattleLog(prev => [log, ...prev]);
    
    if (newMonsterHealth <= 0) {
      endGame('player');
      return;
    }
    
    monsterAttack();
  };

  const healPlayer = () => {
    const healing = getRandomValue(8, 20);
    const newPlayerHealth = Math.min(100, playerHealth + healing);
    setPlayerHealth(newPlayerHealth);
    
    const log = createLogHeal(healing);
    setBattleLog(prev => [log, ...prev]);
    
    monsterAttack();
  };

  const surrender = () => {
    endGame('monster');
  };

  const monsterAttack = () => {
    const damage = getRandomValue(8, 15);
    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    
    const log = createLogAttack(true, damage);
    setBattleLog(prev => [log, ...prev]);
    
    if (newPlayerHealth <= 0) {
      endGame('monster');
    }
  };

  const endGame = (winner) => {
    setGameOver(true);
    setWinner(winner);
  };

  const startNewGame = () => {
    setMonsterHealth(100);
    setPlayerHealth(100);
    setBattleLog([]);
    setGameOver(false);
    setWinner(null);
  };

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <section className="container">
        <h2>Monster Health</h2>
        <div className="healthbar">
          <div style={{ width: `${monsterHealth}%` }} className="healthbar__value"></div>
        </div>
      </section>


      <section className="container">
        <h2>Your Health</h2>
        <div className="healthbar">
          <div style={{ width: `${playerHealth}%` }} className="healthbar__value"></div>
        </div>
      </section>

      {gameOver && (
        <section className="container">
          <h2>Game Over!</h2>
          {winner === 'monster' && <h3>You lost!</h3>}
          {winner === 'player' && <h3>You won!</h3>}
          <button type="button" onClick={startNewGame}>Start New Game</button>
        </section>
      )}

      {!gameOver && (
        <section id="controls">
          <button type="button" onClick={attackMonster}>ATTACK</button>
          <button type="button" onClick={specialAttack}>SPECIAL !</button>
          <button type="button" onClick={healPlayer}>HEAL</button>
          <button type="button" onClick={surrender}>KILL YOURSELF</button>
        </section>
      )}

      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {battleLog.map((log, index) => (
            <li key={index}>
              <span className={log.isPlayer ? 'log--player' : 'log--monster'}>
                {log.isPlayer ? 'Player' : 'Monster'}
              </span>
              <span>
                {log.text}
                <span className={log.isDamage ? 'log--damage' : 'log--heal'}>
                  {log.text.match(/\d+/)?.[0]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Game;
