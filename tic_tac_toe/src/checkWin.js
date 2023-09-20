const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export function checkWin(gameState) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (
            gameState[a] !== "" &&
            gameState[a] === gameState[b] &&
            gameState[b] === gameState[c]
        ) {
            return true;
        }
    }
    return false;
}

export function checkDraw(gameState) {
    return gameState.every(cell => cell !== "");
}