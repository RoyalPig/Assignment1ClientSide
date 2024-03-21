(function() {
    var gameStarted = false;
    var startTime;

    async function fetchPuzzleData() {
        const url = "https://prog2700.onrender.com/threeinarow/random";
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
                    //Left click
                    td.addEventListener('click', function() {
                        if (!gameStarted) {
                            startTime = Date.now(); // Capture the start time
                            gameStarted = true;
                        }
                        let newState = (parseInt(td.dataset.currentState) + 1) % 3;
                        td.dataset.currentState = newState;
                        td.style.backgroundColor = getColorForState(newState);
                        checkForWin(table);
                    });
                    //Right click
                    td.addEventListener('contextmenu', function(event) {
                        event.preventDefault(); 
                        if (!gameStarted) {
                            startTime = Date.now(); // Capture the start time
                            gameStarted = true;
                        }
                        let newState = (parseInt(td.dataset.currentState) + 2) % 3; // +2 instead of -1 to handle negative modulo
                        td.dataset.currentState = newState;
                        td.style.backgroundColor = getColorForState(newState);
                        checkForWin(table);
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
            alert(result);
        });

        document.getElementById('theGame').appendChild(checkWinButton); 
    }

    function checkForWin(table) {
        console.log("check for win function");
        const rowCount = table.rows.length;
        const colCount = table.rows[0].cells.length;
        let isComplete = true;

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const cell = table.rows[i].cells[j];
                const currentState = parseInt(cell.dataset.currentState);
                const correctState = parseInt(cell.dataset.correctState);
                
                if (currentState === 0) {
                    isComplete = false; // Found an empty cell
                } else if (currentState !== correctState) {
                    return "Something is wrong"; // Puzzle is incorrect
                }
            }
        }

        if (isComplete) {
            const endTime = Date.now();
            const elapsedTime = endTime - startTime; // Time in milliseconds
            const seconds = (elapsedTime / 1000).toFixed(3); // Convert to seconds
            alert(`You did it!! Time taken: ${seconds} seconds.`);
            gameStarted = false; // Reset the gameStarted flag
        } else {
            return "So far so good"; // All colored squares are correct but the puzzle is incomplete
        }
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
})();
