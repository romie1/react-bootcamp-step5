import React, { useEffect, useState } from 'react';
import { SHE_TECH_LOGO } from './const';
import { buildGameBoard } from './utils';
import './reset.css';
import './style.css';

/**
 * Step 5:
 *
 * A questo punto, avendo un contatore delle coppie di carte scoperte, possiamo controllare quando il giocatore è riuscito a trovare tutte le coppie e decretarne la vincita tramite un alert nel browser.
 *
 * Abbiamo visto nel precedente step come "osservare" il valore di una variabile e innescare delle azioni al suo cambio di valore, anche qui dunque useremo useEffect.
 *
 * Quando tutte le coppie sono state trovate (match è uguale a ROW_COLUMN_CELLS_COUNT * ROW_COLUMN_CELLS_COUNT / 2) mostriamo al giocatore che ha completato il gioco utilizzando la funzione alert('testo') di javascript.
 *
 * */
const Board = () => {
  const [board, setBoard] = useState(buildGameBoard());
  const [selections, setSelections] = useState([]);
  const [matches, setMatches] = useState(0);

  const onCardClick = (evt, rowIdx, cellIdx) => {
    if (selections.length === 2) return;

    setBoard((prevBoard) => {
      const card = prevBoard[rowIdx][cellIdx];
      card.selected = true;
      setSelections([...selections, card]);
      return prevBoard;
    });
  };

  useEffect(() => {
    if (selections.length === 2) {
      if (selections[0].symbol.id !== selections[1].symbol.id) {
        /**
         * per rendere l'esperienza utente migliore, prima di far rigirare le carte nel momento in cui il giocatore ha sbagliato coppia ci serviamo di un setTimeout. Un conto alla rovescia che, in questo caso, aspetterà 750 millisecondi prima di far rigirare le carte.
         */
        setTimeout(() => {
          setBoard((prevBoard) => {
            selections.forEach((s) => {
              prevBoard[s.row][s.column].selected = false;
            });
            return prevBoard;
          });
          setSelections([]);
        }, 750);
      } else {
        setSelections([]);
        setMatches((prevMatches) => prevMatches + 1);
      }
    }
  }, [selections]);

  useEffect(
    () => {}, //primo parametro, funzione che viene eseguita quando uno degli elementi indicato nel secondo parametro cambia
    [] // secondo parametro, elenco di variabili di stato da osservare (in questo frangente a noi interessa unicamente selections)
  );

  return (
    <div className="game-board">
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="game-board-row">
          {row.map((cell, cellIdx) => (
            <div
              key={cellIdx}
              className={`game-board-cell ${
                cell.selected ? 'game-board-cell-flipped' : ''
              }`}
            >
              <div
                className="play-card"
                onClick={(evt) => onCardClick(evt, rowIdx, cellIdx)}
              >
                <div className="play-card-front">
                  <img src={SHE_TECH_LOGO} />
                </div>
                <div
                  className="play-card-back"
                  style={{ backgroundColor: `${cell.symbol?.color}` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <div className="container">
      <Board />
    </div>
  );
}
