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

    // Check if the data and table exists
    if (!data || !data.rows) {
        console.error('The puzzle data is undefined or does not contain a rows property.');
        return;
    }
    console.log(data);

    const table = document.createElement('table');
    data.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            const color = getColorForState(cell.currentState);
            td.style.backgroundColor = color;
            if (cell.canToggle) {
                td.addEventListener('click', function() {
                    cell.currentState = (cell.currentState + 1) % 3;
                    td.style.backgroundColor = getColorForState(cell.currentState);
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

    return false;
}


function getColorForState(state) {
    switch (state) {
        case 0: return 'grey';
        case 1: return 'black';
        case 2: return 'blue';
        default: return 'green'; // Just in case
    }
}

createPuzzleGrid();