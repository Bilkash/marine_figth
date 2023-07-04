import React, {useEffect, useState} from "react";
import axios from 'axios';
import "./index.css";
import {socket} from "../../socket";

export default function GameBoard() {
    const [gameState, setGameState] = useState([]);

    useEffect(() => {
      // Получение состояния игры из сервера
      axios({
        url: "/game-state",
        baseURL: "http://localhost:3001/api",
        method: "get"
      })
        .then(response => {
          setGameState(response.data);
        })
        .catch(error => {
          console.error('Ошибка при получении состояния игры:', error);
        });

      socket.on("gameState", (data) => {
        console.log("FROM SOCKET")
        console.log(data)
      });
    }, []);

    const handleCellClick = (row: any, col: any) => {
      // Обработка хода игрока
      axios.post('/api/make-move', { row, col })
        .then(response => {
          setGameState(response.data);
        })
        .catch(error => {
          console.error('Ошибка при обработке хода:', error);
        });
    };

  console.log(gameState)

    return (
      <div className="game-board">
        {gameState.map((row: string[], rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell${cell === 'ship' ? 'Ship' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    );
}
