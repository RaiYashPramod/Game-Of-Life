import { useState, useRef } from "react";
import { produce } from "immer";
import "./App.css";

const numRows = 50;
const numCols = 50;

// Define the possible neighbor positions
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

// Function to generate an empty grid
const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  // State variables
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  // Ref to store the running state
  const runningRef = useRef(running);
  runningRef.current = running;

  // Function to run the simulation
  const runSimulation = () => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            // Count the number of alive neighbors
            operations.forEach(([x, y]) => {
              const newI = x + i;
              const newJ = y + j;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });

            // Apply the rules of the Game of Life to update the grid
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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "1rem",
        }}
      >
        {/* Start/Stop button */}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
          style={{ padding: "1rem", marginRight: "1rem" }}
        >
          {running ? "Stop" : "Start"}
        </button>
        {/* Randomize button */}
        <button
          onClick={() => {
            const newGrid = produce(grid, (gridCopy: number[][]) => {
              for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                  // Set cells randomly to be alive with a 25% chance
                  gridCopy[i][j] = Math.random() > 0.75 ? 1 : 0;
                }
              }
            });

            setGrid(newGrid);
          }}
          style={{ padding: "1rem", marginRight: "1rem" }}
        >
          Random
        </button>
        {/* Reset button */}
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setRunning(!running);
          }}
          style={{ padding: "1rem" }}
        >
          Reset
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Grid cells */}
        {grid.map((rows, i) =>
          rows.map((_col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy: number[][]) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });

                setGrid(newGrid);
              }}
              style={{
                height: 20,
                width: 20,
                border: "solid 1px grey",
                backgroundColor: grid[i][j] ? "white" : "",
              }}
            ></div>
          ))
        )}
      </div>
      {/* Link to learn more */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </div>
    </>
  );
};

export default App;
