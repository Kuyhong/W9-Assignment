import React, { useState } from "react";
import Entity from "./Entity.jsx";
import GameOver from "./GameOver.jsx";
import Log from "./Log.jsx";

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
  const [playerHealth, setplayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [logs, setLogs] = useState([]);

  function restartGame() {
    setplayerHealth(100);
    setMonsterHealth(100);
    setLogs([]);
  }

  const isGameOver = playerHealth <= 0 || monsterHealth <= 0;
  const gameResult = playerHealth <= 0 ? "Monster Wins!" : "Player Wins!";
  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function handleAttack() {
    const playerDamage = getRandomValue(5, 10);
    const monsterDamage = getRandomValue(8, 20);
    const newMonsterHealth = monsterHealth - playerDamage;

    setMonsterHealth(newMonsterHealth);
    setLogs((prevLogs) => [createLogAttack(true, playerDamage), ...prevLogs]);

    if (newMonsterHealth > 0) {
      const newPlayerHealth = playerHealth - monsterDamage;
      setplayerHealth(newPlayerHealth);
      setLogs((prevLogs) => [createLogAttack(false, monsterDamage), ...prevLogs]);
    }
  }

  function handleSpecialAttack() {
    const playerDamage = getRandomValue(10, 20);
    const monsterDamage = getRandomValue(8, 20);
    const newMonsterHealth = monsterHealth - playerDamage;

    setMonsterHealth(newMonsterHealth);
    setLogs((prevLogs) => [createLogAttack(true, playerDamage), ...prevLogs]);

    if (newMonsterHealth > 0) {
      const newPlayerHealth = playerHealth - monsterDamage;
      setplayerHealth(newPlayerHealth);
      setLogs((prevLogs) => [createLogAttack(false, monsterDamage), ...prevLogs]);
    }
  }

  function handleHeal() {
    const playerHealing = getRandomValue(10, 30);
    const monsterDamage = getRandomValue(8, 20);
    const newPlayerHealth = Math.min(playerHealth + playerHealing, 100);
    setplayerHealth(newPlayerHealth);
    setLogs((prevLogs) => [createLogHeal(playerHealing), ...prevLogs]);

    if (newPlayerHealth > 0) {
      const newPlayerHealthAfterDamage = newPlayerHealth - monsterDamage;
      setplayerHealth(newPlayerHealthAfterDamage);
      setLogs((prevLogs) => [createLogAttack(false, monsterDamage), ...prevLogs]);
    }
  }

  function handleKillYourself() {
    const newPlayerHealth = 0;
    setplayerHealth(newPlayerHealth);
    setLogs((prevLogs) => [createLogAttack(true, playerHealth), ...prevLogs]);
  }
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Entity name="Monster" health={monsterHealth} />
      <Entity name="Player" health={playerHealth} />

      {!isGameOver ? (
        <section id="controls">
          <button onClick={handleAttack}>ATTACK</button>
          <button onClick={handleSpecialAttack}>SPECIAL ATTACK</button>
          <button onClick={handleHeal}>HEAL</button>
          <button onClick={handleKillYourself}>KILL YOURSELF</button>
        </section>
      ) : (
        <GameOver title={gameResult} restartGame={restartGame} />
      )}

      <Log logs={logs} />
    </>
  );
}

export default Game;
