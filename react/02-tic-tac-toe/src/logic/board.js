import { WINNING_COMBO } from "../constants";

export const checkWinner = (boardToCheck) => {
  for (const combo of WINNING_COMBO) {
    const [a, b, c] = combo;
    if (
      boardToCheck[a] &&
      boardToCheck[a] === boardToCheck[b] &&
      boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a];
    }
  }

  return null; // No winner yet
};

export const checkEndGame = (boardToCheck) => {
  return boardToCheck.every((square) => square !== null);
};
