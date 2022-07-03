import React, { useState, useEffect } from "react";
import "./board.css";

function GameBoard() {
  const WORD_LENGTH = 5;
  const SOLUTION = "BLOCK";
  const ALLOWED_GUESSES = 6;
  //   const [board, setBoard] = useState(Array(6).fill(new Array(5).fill("")));
  const [board, setBoard] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [row, setRow] = useState(0);
  const [box, setBox] = useState(0);
  const [gameOver, setGameOver] = useState([false, ""]);

  const handleRowFinish = () => {
    if (row > ALLOWED_GUESSES - 1) {
      setGameOver([true, "YOU LOST"]);
    }
    checkSolution();
  };

  const checkSolution = () => {
    if (board[row - 1] == undefined) return;

    const getCount = (letter, word) => {
      let count = 0;
      for (const l of word) {
        l == letter && count++;
      }
      return count;
    };

    let wordObject = {};
    board[row - 1].map((letter, i) => {
      wordObject[letter] = getCount(letter, SOLUTION);
    });

    let foundCorrect = 0;
    board[row - 1].map((letter, i) => {
      let tile = document.getElementById(`${row - 1}${i}`);
      if (SOLUTION[i] == letter) {
        wordObject[letter]--;
        tile.classList.add("correct");
        foundCorrect++;
        console.log(foundCorrect);
        foundCorrect == WORD_LENGTH && setGameOver([true, "You Won!!!"]);
        return;
      }
    });
    board[row - 1].map((letter, i) => {
      let tile = document.getElementById(`${row - 1}${i}`);
      if (SOLUTION.includes(letter)) {
        if (wordObject[letter] == 0) return;
        wordObject[letter]--;
        tile.classList.add("included");
      }
    });
  };
  useEffect(() => handleRowFinish(), [row]);
  //   const [board, setBoard] = useState([["a"], ["a"]]);
  const handleKey = (e) => {
    if (gameOver[0]) return;
    const isLetter = e.key >= "a" && e.key <= "z";
    if (!isLetter) return;

    let key = e.key;
    setBoard((board) => {
      let temp = [...board];
      temp[row][box] = key.toUpperCase();
      return temp;
    });
    if (box < WORD_LENGTH - 1) {
      setBox((box) => box + 1);
    } else {
      setBox(0);
      setRow((row) => row + 1);
      row + 1 === ALLOWED_GUESSES && setGameOver([true, "You Lost"]);
    }
  };
  useEffect(() => {
    if (gameOver[0]) return;
    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [box]);
  useEffect(() => {
    if (gameOver[0]) {
      alert(gameOver[1]);
    }
  }, [gameOver]);
  return (
    <div className="board">
      {board.map((row, i) => {
        return (
          <div className="row" key={i}>
            {row.map((box, j) => (
              //   <div className="box">{box}</div>
              <div className="box" id={`${i}${j}`} key={j}>
                {board[i][j]}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;
