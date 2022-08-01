import React, { useState } from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function App() {
  //Aux Functions
  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
    };
  }
  function allNewDice() {
    // dice=[{},{},...] donde cada elemento es {value:<random number>, isHeld: false (default)}
    let dice = [];
    for (let i = 0; i < 10; i++) {
      dice.push(generateNewDie());
    }
    return dice;
  }
  // State Declaration
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [startTime, setStarTime] = useState(performance.now());

  //Record
  const prevBestTime = JSON.parse(localStorage.getItem("bestTime")) || Infinity;

  const [bestRound, setBestRound] = useState({
    isBestRound: false,
    time: prevBestTime,
  });

  const { width, height } = useWindowSize();

  // Event Handlers
  function rollDice() {
    setDice((diceState) =>
      diceState.map((die) => (die.isHeld ? die : generateNewDie()))
    );
  }
  function resetGame() {
    setDice(allNewDice());
    setTenzies(false);
    setBestRound(() => ({ ...bestRound, isBestRound: false }));
    localStorage.setItem("bestTime", bestRound.time);
    setStarTime(performance.now());
  }
  React.useEffect(() => {
    const firstDie = dice[0];
    if (dice.every((die) => die.value === firstDie.value)) {
      const endTime = performance.now();
      const gameTime = endTime - startTime;
      if (gameTime < prevBestTime) {
        setBestRound({ isBestRound: true, time: gameTime });
      }

      setTenzies(true);
    } else {
      setTenzies(false);
    }
  }, [dice]);
  //Die Functions
  function toggleHold(id) {
    if (!tenzies) {
      setDice((diceState) =>
        diceState.map((die) =>
          die.id === id ? { ...die, isHeld: !die.isHeld } : die
        )
      );
    }
  }

  // State Mapping
  const diceElements = dice.map((die) => {
    return (
      <Die key={die.id} {...die} toggleHold={toggleHold} tenzies={tenzies} />
    );
  });

  /*Conditional Rendering*/
  let gameScreen;
  if (!tenzies) {
    /*Still Playing*/
    gameScreen = (
      <>
        <h1 className="title">Tenzies</h1>
        <p className="description">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice">{diceElements}</div>
        <button className="btn" onClick={rollDice}>
          Roll
        </button>
        {prevBestTime !== Infinity && (
          <p className="description best-time">
            BEST TIME: {(prevBestTime / 1000).toFixed(2)}s
          </p>
        )}
      </>
    );
  } else {
    /*Game Over*/
    gameScreen = (
      <>
        <h1 className="title tenzies">YOU WON</h1>
        {bestRound.isBestRound ? (
          <>
            <Confetti width={width} height={height} />
            <p className="description">
              WOW!!! {Math.round((bestRound.time / 1000).toFixed(2))}seconds!
              You broke a new record! Congratulations!!!
            </p>
          </>
        ) : (
          <p className="description">
            Your Time: {((performance.now() - startTime) / 1000).toFixed(2)}s
          </p>
        )}
        <div className="dice">{diceElements}</div>
        <button className="btn btn-reset" onClick={resetGame}>
          RESET
        </button>
      </>
    );
  }

  return (
    <main>
      <div className="gameboard">{gameScreen}</div>
    </main>
  );
}
