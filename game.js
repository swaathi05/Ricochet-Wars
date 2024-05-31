const board = document.getElementById("board");
const timerDisplay = document.getElementById("time");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const resetButton = document.getElementById("reset");
const moveHistoryDiv = document.getElementById("move-history");

let timer;
let timeLeft = 60;
let gamePaused = false;
let selectedCell = null;

const pieces = {
  Titan: "T",
  Tank: "K",
  Ricochet: "R",
  SemiRicochet: "S",
  Cannon: "C",
};

const spells = {
  passThrough: "P",
};

let moveHistory = [];
let currentMoveIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  placeInitialPieces();
  startTimer();
  displayMoveHistory();
  loadMoveHistory();
});

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      board.appendChild(cell);
    }
  }
}

function placeInitialPieces() {
  const initialPositions = {
    0: {
      0: pieces.Titan,
      1: pieces.Tank,
      2: pieces.Ricochet,
      3: pieces.SemiRicochet,
      4: pieces.Cannon,
    },
    7: {
      7: pieces.Titan,
      6: pieces.Tank,
      5: pieces.Ricochet,
      4: pieces.SemiRicochet,
      3: pieces.Cannon,
    },
  };

  for (const row in initialPositions) {
    for (const col in initialPositions[row]) {
      const piece = initialPositions[row][col];
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      if (cell) {
        cell.textContent = piece;
      } else {
        console.error(`Cell at row ${row}, col ${col} not found`);
      }
    }
  }
}

function startTimer() {
  timer = setInterval(() => {
    if (!gamePaused) {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft === 0) {
        clearInterval(timer);
        alert("Time is up! The other player wins!");
      }
    }
  }, 1000);
}

pauseButton.addEventListener("click", () => {
  gamePaused = true;
  clearInterval(timer);
});

resumeButton.addEventListener("click", () => {
  if (gamePaused) {
    gamePaused = false;
    startTimer();
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(timer);
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  gamePaused = false;
  selectedCell = null;
  createBoard();
  placeInitialPieces();
  startTimer();
});

board.addEventListener("click", (e) => {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (!cell.textContent) return; // If the cell is empty, do nothing

  if (selectedCell) {
    movePiece(
      parseInt(selectedCell.dataset.row),
      parseInt(selectedCell.dataset.col),
      row,
      col
    );
    selectedCell = null;
  } else {
    selectedCell = cell;
  }
});

function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  return rowDiff <= 1 && colDiff <= 1;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  const fromCell = document.querySelector(
    `.cell[data-row="${fromRow}"][data-col="${fromCol}"]`
  );
  const toCell = document.querySelector(
    `.cell[data-row="${toRow}"][data-col="${toCol}"]`
  );
  const piece = fromCell.textContent;

  if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
    toCell.textContent = piece;
    fromCell.textContent = "";
    saveMove(fromRow, fromCol, toRow, toCol, piece);
  } else {
    alert("Invalid move");
  }
}

function shootBullet(fromRow, fromCol, direction) {
  let col = fromCol;
  while (col >= 0 && col < 8) {
    const cell = document.querySelector(
      `.cell[data-row="${fromRow}"][data-col="${col}"]`
    );
    if (cell.textContent) {
      if (cell.textContent === pieces.SemiRicochet) {
        cell.textContent = "";
        alert("Semi Ricochet destroyed!");
        break;
      }
      alert(`Hit ${cell.textContent}`);
      break;
    }
    col += direction === "left" ? -1 : 1;
  }
}

document.addEventListener("keydown", (e) => {
  if (selectedCell && selectedCell.textContent === pieces.Cannon) {
    if (e.key === "ArrowLeft") {
      shootBullet(
        parseInt(selectedCell.dataset.row),
        parseInt(selectedCell.dataset.col),
        "left"
      );
    } else if (e.key === "ArrowRight") {
      shootBullet(
        parseInt(selectedCell.dataset.row),
        parseInt(selectedCell.dataset.col),
        "right"
      );
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "p") {
    const cell = selectedCell;
    if (cell) {
      castSpell(
        spells.passThrough,
        parseInt(cell.dataset.row),
        parseInt(cell.dataset.col)
      );
    }
  }

  if (e.ctrlKey && e.key === "z") {
    undoMove();
  }
  if (e.ctrlKey && e.key === "y") {
    redoMove();
  }
});

function castSpell(spell, row, col) {
  const cell = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  if (cell && cell.textContent) {
    if (spell === spells.passThrough) {
      cell.dataset.passThrough = "true";
      setTimeout(() => {
        delete cell.dataset.passThrough;
      }, 3000);
    }
  }
}

function saveMove(fromRow, fromCol, toRow, toCol, piece) {
  moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
  moveHistory.push({ fromRow, fromCol, toRow, toCol, piece });
  currentMoveIndex++;
  storeMoveHistory();
  displayMoveHistory();
}

function undoMove() {
  if (currentMoveIndex < 0) return;
  const lastMove = moveHistory[currentMoveIndex];
  movePiece(lastMove.toRow, lastMove.toCol, lastMove.fromRow, lastMove.fromCol);
  currentMoveIndex--;
}

function redoMove() {
  if (currentMoveIndex >= moveHistory.length - 1) return;
  currentMoveIndex++;
  const nextMove = moveHistory[currentMoveIndex];
  movePiece(nextMove.fromRow, nextMove.fromCol, nextMove.toRow, nextMove.toCol);
}

function storeMoveHistory() {
  localStorage.setItem("moveHistory", JSON.stringify(moveHistory));
}

function loadMoveHistory() {
  const storedHistory = localStorage.getItem("moveHistory");
  if (storedHistory) {
    moveHistory = JSON.parse(storedHistory);
    currentMoveIndex = moveHistory.length - 1;
  }
}

function displayMoveHistory() {
  moveHistoryDiv.innerHTML = "";
  moveHistory.forEach((move, index) => {
    const moveElement = document.createElement("div");
    moveElement.textContent = `Move ${index + 1}: ${move.piece} from (${
      move.fromRow
    }, ${move.fromCol}) to (${move.toRow}, ${move.toCol})`;
    moveHistoryDiv.appendChild(moveElement);
  });
}

function botMove() {
  const validMoves = [];
  document.querySelectorAll(".cell").forEach((cell) => {
    if (cell.textContent && cell.textContent !== pieces.Cannon) {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (isValidMove(cell.textContent, row, col, newRow, newCol)) {
            validMoves.push({
              fromRow: row,
              fromCol: col,
              toRow: newRow,
              toCol: newCol,
            });
          }
        }
      }
    }
  });

  if (validMoves.length > 0) {
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    movePiece(move.fromRow, move.fromCol, move.toRow, move.toCol);
  }
}

function playerMove(fromRow, fromCol, toRow, toCol) {
  movePiece(fromRow, fromCol, toRow, toCol);
  setTimeout(botMove, 1000);
}
