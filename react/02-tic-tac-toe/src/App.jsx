import { useState } from "react";
import confetti from "canvas-confetti";

import "./App.css";

import { TURNS } from "./constants";
import { Square } from "./components/Square";
import { checkWinner, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";

function App() {
  const initialBoard = Array(9).fill(null);
  const initialTurn = TURNS.X;

  const [board, setBoard] = useState(() => {
    const savedBoard = window.localStorage.getItem("board");
    return savedBoard ? JSON.parse(savedBoard) : initialBoard;
  });
  const [turn, setTurn] = useState(() => {
    const savedTurn = window.localStorage.getItem("turn");
    return savedTurn ? savedTurn : initialTurn;
  });
  const [winner, setWinner] = useState(null);

  const updateBoard = (index) => {
    if (board[index] || winner !== null) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    const newWinner = checkWinner(newBoard);

    // Save the current board state to localStorage
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    if (newWinner) {
      confetti(); // Celebrate the win
      setWinner(newWinner); // Set the winner
      return;
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // Tie
      return;
    }

    setTurn(newTurn);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn(initialTurn);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
    confetti.reset(); // Reset confetti
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <section className="game">
        {board.map((value, index) => (
          <Square key={index} index={index} updateBoard={updateBoard}>
            {value}
          </Square>
        ))}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <section className="reset">
        <button onClick={resetGame}>Reset Game</button>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
}

export default App;
