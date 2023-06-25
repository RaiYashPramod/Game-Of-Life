import { useState, useRef } from "react";
import { produce } from "immer";
import "./App.css";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = () => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = x + i;
              const newJ = y + j;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  };

  return (
    <div className="container">
      <div className="controls">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
          className={`control-button ${running ? "active" : ""}`}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            const newGrid = produce(grid, (gridCopy) => {
              for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                  gridCopy[i][j] = Math.random() > 0.75 ? 1 : 0;
                }
              }
            });

            setGrid(newGrid);
          }}
          className="control-button"
        >
          Random
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setRunning(!running);
          }}
          className="control-button"
        >
          Reset
        </button>
      </div>
      <div className="grid">
        {grid.map((rows, i) =>
          rows.map((_col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });

                setGrid(newGrid);
              }}
              className={`cell ${grid[i][j] ? "alive" : ""}`}
            ></div>
          ))
        )}
      </div>
      <div className="learn-more">
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </div>
    </div>
  );
};

export default App;
