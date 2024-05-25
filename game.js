document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const timerDisplay = document.getElementById('time');
    const pauseButton = document.getElementById('pause');
    const resumeButton = document.getElementById('resume');
    const resetButton = document.getElementById('reset');
    
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
        gamePaused = false;
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        startTimer();
    });

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
    for (let row in initialPositions) {
        for (let col in initialPositions[row]) {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = initialPositions[row][col];
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
