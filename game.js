document.addEventListener('DOMContentLoaded', () => {
    
    const board = document.getElementById('board');
    const timerDisplay = document.getElementById('time');
    const pauseButton = document.getElementById('pause');
    const resumeButton = document.getElementById('resume');
    const resetButton = document.getElementById('reset');
    const replayButton = document.getElementById('replay');
    
    let timer;
    let timeLeft = 60;
    let gamePaused = false;

    // Initialize the board
    function createBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                board.appendChild(cell);
            }
        }
    }

    // Timer logic
    function startTimer() {
        timer = setInterval(() => {
            if (!gamePaused) {
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                if (timeLeft === 0) {
                    clearInterval(timer);
                    alert('Time is up! The other player wins!');
                }
            }
        }, 1000);
    }

    pauseButton.addEventListener('click', () => {
        gamePaused = true;
    });

    resumeButton.addEventListener('click', () => {
        if(gamePaused)
            gamePaused = false;
            startTimer();
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        startTimer();
    });

    replayButton.addEventListener('click', replayGame);

    createBoard();
    startTimer();
});

const pieces = {
    Titan: 'T',
    Tank: 'K',
    Ricochet: 'R',
    SemiRicochet: 'S',
    Cannon: 'C'
};

// Example of initial placement, modify as needed
const initialPositions = {
    0: { 0: pieces.Cannon, 7: pieces.Cannon }, // Cannons on the base rank
    7: { 3: pieces.Titan, 4: pieces.Titan }, // Titans on opposite sides
    // Add other pieces as needed
};

// Place initial pieces on the board
function placeInitialPieces() {
    // Example initial configuration, you can adjust this based on your game rules
    const initialPositions = {
        0: { 0: pieces.Titan, 1: pieces.Tank, 2: pieces.Ricochet, 3: pieces.SemiRicochet, 4: pieces.Cannon },
        7: { 7: pieces.Titan, 6: pieces.Tank, 5: pieces.Ricochet, 4: pieces.SemiRicochet, 3: pieces.Cannon }
    };

    for (const row in initialPositions) {
        for (const col in initialPositions[row]) {
            const piece = initialPositions[row][col];
            // Ensure that row and col are within the 8x8 grid
            if (row >= 0 && row < 8 && col >= 0 && col < 8) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.textContent = piece;
                } else {
                    console.error(`Cell at row ${row}, col ${col} not found`);
                }
            } else {
                console.error(`Invalid position: row ${row}, col ${col}`);
            }
        }
    }
}

// Movement logic
function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = fromCell.textContent;

    if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
        toCell.textContent = piece;
        fromCell.textContent = '';
    } else {
        alert('Invalid move');
    }
}

// Handle cell click for moving pieces
board.addEventListener('click', (e) => {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (!cell.textContent) return; // If the cell is empty, do nothing

    if (selectedCell) {
        movePiece(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), row, col);
        selectedCell = null;
    } else {
        selectedCell = cell;
    }
});

let selectedCell = null;

placeInitialPieces();

function shootBullet(fromRow, fromCol, direction) {
    // Placeholder function to handle bullet shooting
    // Direction could be 'left' or 'right'
    let col = fromCol;
    while (col >= 0 && col < 8) {
        const cell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${col}"]`);
        if (cell.textContent && cell.textContent !== pieces.Cannon) {
            alert(`Hit ${cell.textContent}`);
            break;
        }
        col += (direction === 'left' ? -1 : 1);
    }
}

// Add event listener for shooting
document.addEventListener('keydown', (e) => {
    if (selectedCell && selectedCell.textContent === pieces.Cannon) {
        if (e.key === 'ArrowLeft') {
            shootBullet(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), 'left');
        } else if (e.key === 'ArrowRight') {
            shootBullet(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), 'right');
        }
    }
});

pauseButton.addEventListener('click', () => {
    gamePaused = true;
});

resumeButton.addEventListener('click', () => {
    gamePaused = false;
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    gamePaused = false;
    selectedCell = null;
    board.innerHTML = '';
    createBoard();
    placeInitialPieces();
    startTimer();
});

// game.js (continued)

let moveHistory = [];
let currentMoveIndex = -1;

function saveMove(fromRow, fromCol, toRow, toCol, piece) {
    moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
    moveHistory.push({ fromRow, fromCol, toRow, toCol, piece });
    currentMoveIndex++;
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

// Bind undo and redo to keys or buttons
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        undoMove();
    }
    if (e.ctrlKey && e.key === 'y') {
        redoMove();
    }
});

// game.js (continued)

function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = fromCell.textContent;

    if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
        toCell.textContent = piece;
        fromCell.textContent = '';
        saveMove(fromRow, fromCol, toRow, toCol, piece);
    } else {
        alert('Invalid move');
    }
}

// game.js (continued)

function shootBullet(fromRow, fromCol, direction) {
    let col = fromCol;
    while (col >= 0 && col < 8) {
        const cell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${col}"]`);
        if (cell.textContent) {
            if (cell.textContent === pieces.SemiRicochet) {
                // Handle semi ricochet destruction logic
                cell.textContent = '';
                alert('Semi Ricochet destroyed!');
                break;
            }
            alert(`Hit ${cell.textContent}`);
            break;
        }
        col += (direction === 'left' ? -1 : 1);
    }
}

// game.js (continued)

function storeMoveHistory() {
    localStorage.setItem('moveHistory', JSON.stringify(moveHistory));
}

function loadMoveHistory() {
    const storedHistory = localStorage.getItem('moveHistory');
    if (storedHistory) {
        moveHistory = JSON.parse(storedHistory);
        currentMoveIndex = moveHistory.length - 1;
    }
}

// Call storeMoveHistory after each move
function saveMove(fromRow, fromCol, toRow, toCol, piece) {
    moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
    moveHistory.push({ fromRow, fromCol, toRow, toCol, piece });
    currentMoveIndex++;
    storeMoveHistory();
}

// Load move history on game start
document.addEventListener('DOMContentLoaded', () => {
    loadMoveHistory();
    createBoard();
    placeInitialPieces();
    startTimer();
});

// game.js (continued)

function displayMoveHistory() {
    const historyDiv = document.getElementById('move-history');
    historyDiv.innerHTML = '';
    moveHistory.forEach((move, index) => {
        const moveElement = document.createElement('div');
        moveElement.textContent = `Move ${index + 1}: ${move.piece} from (${move.fromRow}, ${move.fromCol}) to (${move.toRow}, ${move.toCol})`;
        historyDiv.appendChild(moveElement);
    });
}

// Update displayMoveHistory after each move
function saveMove(fromRow, fromCol, toRow, toCol, piece) {
    moveHistory = moveHistory.slice(0, currentMoveIndex + 1);
    moveHistory.push({ fromRow, fromCol, toRow, toCol, piece });
    currentMoveIndex++;
    storeMoveHistory();
    displayMoveHistory();
}

// Initial call to display history on game load
document.addEventListener('DOMContentLoaded', () => {
    loadMoveHistory();
    createBoard();
    placeInitialPieces();
    startTimer();
    displayMoveHistory();
});

// game.js (continued)

function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromCell = document.querySelector(`.cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = fromCell.textContent;

    if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
        fromCell.classList.add('moving');
        setTimeout(() => {
            toCell.textContent = piece;
            fromCell.textContent = '';
            fromCell.classList.remove('moving');
            saveMove(fromRow, fromCol, toRow, toCol, piece);
        }, 300);
    } else {
        alert('Invalid move');
    }
}

// game.js (continued)

function botMove() {
    // Placeholder for bot move logic
    // Implement simple AI to make moves
    // For now, just make a random valid move
    const validMoves = [];
    document.querySelectorAll('.cell').forEach(cell => {
        if (cell.textContent && cell.textContent !== pieces.Cannon) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (isValidMove(cell.textContent, row, col, newRow, newCol)) {
                        validMoves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol });
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

// Call botMove at intervals or based on player's move
function playerMove(fromRow, fromCol, toRow, toCol) {
    movePiece(fromRow, fromCol, toRow, toCol);
    setTimeout(botMove, 1000);
}


const spells = {
    passThrough: 'P'
};

function castSpell(spell, row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell && cell.textContent) {
        // Example spell: passThrough
        if (spell === spells.passThrough) {
            cell.dataset.passThrough = 'true';
            setTimeout(() => {
                delete cell.dataset.passThrough;
            }, 3000); // Spell lasts for 3 seconds
        }
    }
}

// Bind spell casting to keys or buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
        const cell = selectedCell;
        if (cell) {
            castSpell(spells.passThrough, parseInt(cell.dataset.row), parseInt(cell.dataset.col));
        }
    }
});
