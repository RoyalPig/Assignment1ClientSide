async function fetchPuzzleData() {
    const url = "https://prog2700.onrender.com/threeinarow/sample";
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching puzzle data:", error);
    }
}

var gameStarted = false;
var startTime;
var leaderboard = [];

async function createPuzzleGrid() {
    const data = await fetchPuzzleData();

    if (!data || !data.rows) {
        console.error('The puzzle data is undefined or does not contain a rows property.');
        return;
    }
    console.log(data);

    const table = document.createElement('table');
    data.rows.forEach((row) => {
        const tr = document.createElement('tr');
        row.forEach((cellData) => {
            const td = document.createElement('td');
            td.dataset.currentState = cellData.currentState;
            td.dataset.correctState = cellData.correctState;
            td.style.backgroundColor = getColorForState(cellData.currentState);
            if (cellData.canToggle) {
                td.addEventListener('click', toggleCell);
                td.addEventListener('contextmenu', toggleCellRightClick);
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    document.getElementById('theGame').appendChild(table);
    var checkWinButton = document.createElement('button');
    checkWinButton.innerText = 'Check for Win';
    checkWinButton.addEventListener('click', () => checkForWin(table));
    document.getElementById('theGame').appendChild(checkWinButton);
}

function toggleCell() {
    if (!gameStarted) {
        startTime = Date.now(); // Capture the start time
        gameStarted = true;
    }
    let td = this;
    let newState = (parseInt(td.dataset.currentState) + 1) % 3;
    td.dataset.currentState = newState;
    td.style.backgroundColor = getColorForState(newState);
}

function toggleCellRightClick(event) {
    event.preventDefault();
    if (!gameStarted) {
        startTime = Date.now(); // Capture the start time
        gameStarted = true;
    }
    let td = this;
    let newState = (parseInt(td.dataset.currentState) + 2) % 3; // +2 instead of -1 to handle negative modulo
    td.dataset.currentState = newState;
    td.style.backgroundColor = getColorForState(newState);
}

function checkForWin(table) {
    let isComplete = true;
    const rowCount = table.rows.length;
    const colCount = table.rows[0].cells.length;

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const cell = table.rows[i].cells[j];
            if (parseInt(cell.dataset.currentState) !== parseInt(cell.dataset.correctState)) {
                isComplete = false;
                break;
            }
        }
        if (!isComplete) break;
    }

    if (isComplete) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const seconds = (elapsedTime / 1000).toFixed(3);
        let playerName = prompt(`You did it!! Time taken: ${seconds} seconds. Enter your name for the leaderboard:`);
        if (playerName) {
            updateLeaderboard(playerName, seconds);
            displayLeaderboard();
        }
        gameStarted = false;
    } else {
        alert("Keep trying!");
    }
}

function getColorForState(state) {
    switch (state) {
        case 0: return 'grey';
        case 1: return 'black';
        case 2: return 'blue';
        default: return 'green';
    }
}

function updateLeaderboard(name, time) {
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => parseFloat(a.time) - parseFloat(b.time)); // Sort by time
}

function displayLeaderboard() {
    let leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) {
        leaderboardDiv = document.createElement('div');
        leaderboardDiv.id = 'leaderboard';
        document.body.appendChild(leaderboardDiv);
    }

    leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach((entry, index) => {
        leaderboardDiv.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.time} seconds</p>`;
    });
}

createPuzzleGrid();
