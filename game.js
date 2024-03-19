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

    const gameContainer = document.getElementById('theGame');
    const table = document.createElement('table');
    table.className = 'puzzleGrid'; 

    data.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            td.className = 'puzzleCell'; 

            if (cell.currentValue === 1) {

            } else if (cell.currentValue === 2) {

            } else {

            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    gameContainer.innerHTML = '';
    gameContainer.appendChild(table);
}

createPuzzleGrid();
