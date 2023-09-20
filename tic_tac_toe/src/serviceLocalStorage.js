export function saveGameState(gameState, currentPlayer, gameActive, againstComputer) {
    localStorage.setItem("gameState", JSON.stringify(gameState));
    localStorage.setItem("currentPlayer", currentPlayer);
    localStorage.setItem("gameActive", gameActive);
    localStorage.setItem("againstComputer", againstComputer);
}
  
export function cleanGameState() {
    localStorage.removeItem("gameState");
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("gameActive");
    localStorage.removeItem("againstComputer");
}

export async function loadState() {
    const savedGameState = localStorage.getItem("gameState");
    const savedCurrentPlayer = localStorage.getItem("currentPlayer");
    const savedGameActive = localStorage.getItem("gameActive");
    const savedAgainstComputer = localStorage.getItem("againstComputer");
    return { savedGameState, savedCurrentPlayer, savedGameActive, savedAgainstComputer }
}

