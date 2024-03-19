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
            const color = getColorForState(cellData.currentState);
            td.style.backgroundColor = color;
            if (cellData.canToggle) {
                td.addEventListener('click', function() {
                    let newState = (parseInt(td.dataset.currentState) + 1) % 3;
                    td.dataset.currentState = newState;
                    td.style.backgroundColor = getColorForState(newState);
                });
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    document.getElementById('theGame').appendChild(table);
    var checkWinButton = document.createElement('button');
    checkWinButton.innerText = 'Check for Win'; 
    checkWinButton.addEventListener('click', function() {
        var result = checkForWin(table);
        alert(result ? "You won!" : "Not yet..."); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    });

    document.getElementById('theGame').appendChild(checkWinButton); 
}


function checkForWin(table) {
    console.log("check for win function");
    const rowCount = table.rows.length;
    const colCount = table.rows[0].cells.length;

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const cell = table.rows[i].cells[j];
            const currentState = parseInt(cell.dataset.currentState);
            const correctState = parseInt(cell.dataset.correctState);
            console.log("Checking cell:", cell, "current state:", currentState, "correct state:", correctState);
            
            if (currentState !== correctState) {
                console.log("Cell state is incorrect", cell);
                return false; // A cell's state is not correct
            }
        }
    }

    // If you reach this point, all cells have the correct state
    return true;
}



/* 
function checkForWin(table) {
    console.log("check for win function");
    const rowCount = table.rows.length;
    const colCount = table.rows[0].cells.length;
    
    // This assumes the grid is always square, i.e., rowCount == colCount
    const halfSize = rowCount / 2;

    // Check rows for equal number of state 1 and state 2
    for (let i = 0; i < rowCount; i++) {
        let state1Count = 0;
        let state2Count = 0;
        for (let j = 0; j < colCount; j++) {
            if (table.rows[i].cells[j].currentState == 1) {
                state1Count++;
            } else if (table.rows[i].cells[j].currentState == 2) {
                state2Count++;
            }
        }
        // If the counts of state 1 and state 2 are not half the size of the grid, return false
        if (state1Count !== halfSize || state2Count !== halfSize) {
            console.log("Rows check time fail. Womp womp! State1: " + state1Count + "State2: " + state2Count);
            return false;
        }
    }

    // Check columns for equal number of state 1 and state 2
    for (let j = 0; j < colCount; j++) {
        let state1Count = 0;
        let state2Count = 0;
        for (let i = 0; i < rowCount; i++) {
            if (table.rows[i].cells[j].currentState == 1) {
                state1Count++;
            } else if (table.rows[i].cells[j].currentState == 2) {
                state2Count++;
            }
        }
        // If the counts of state 1 and state 2 are not half the size of the grid, return false
        if (state1Count !== halfSize || state2Count !== halfSize) {
            console.log("Colums check time fail. Womp womp! State1: " + state1Count + "State2: " + state2Count);
            return false;
        }
    }

    // If all rows and columns have an equal number of state 1 and state 2 and each count is half the size of the grid, return true
    return true;
} */



function getColorForState(state) {
    switch (state) {
        case 0: return 'grey';
        case 1: return 'black';
        case 2: return 'blue';
        default: return 'green'; // Just in case
    }
}

createPuzzleGrid();