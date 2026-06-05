/* ==========================
   PLAYER ENGINE
========================== */

function generatePlayerId() {
    return "P" + Date.now();
}

/* ==========================
   ADD PLAYER
========================== */

function addPlayer() {

    const name =
        document.getElementById("playerName")?.value?.trim();

    const username =
        document.getElementById("playerUsername")?.value?.trim();

    if (!name) {
        alert("Enter player name");
        return;
    }

    const player = {

        id: generatePlayerId(),

        name: name,

        username: username || "",

        matches: 0,

        wins: 0,

        losses: 0,

        points: 0,

        elo: 1000,

        cups: 0,

        trophies: 0,

        achievements: [],

        streak: 0,

        bestStreak: 0,

        joinDate: new Date().toISOString()

    };

    db.players.push(player);

    saveDatabase();

    renderPlayers();

    updateDashboard();

}

/* ==========================
   DELETE PLAYER
========================== */

function deletePlayer(playerId) {

    const confirmDelete =
        confirm("Delete this player?");

    if (!confirmDelete) return;

    db.players = db.players.filter(
        player => player.id !== playerId
    );

    saveDatabase();

    renderPlayers();

}

/* ==========================
   SEARCH PLAYER
========================== */

function searchPlayers() {

    const search =
        document.getElementById("playerSearch")
        ?.value
        .toLowerCase() || "";

    return db.players.filter(player =>
        player.name.toLowerCase().includes(search)
    );

}

/* ==========================
   RENDER PLAYERS
========================== */

function renderPlayers() {

    const grid =
        document.getElementById("playersGrid");

    if (!grid) return;

    const players = searchPlayers();

    grid.innerHTML = "";

    if(players.length === 0){

        grid.innerHTML =
        "<p>No players found</p>";

        return;
    }

    players.forEach(player => {

        const card =
        document.createElement("div");

        card.className =
        "player-card";

        card.innerHTML = `

        <h3>${player.name}</h3>

        <p>🏆 Points: ${player.points}</p>

        <p>⚡ ELO: ${player.elo}</p>

        <p>🥇 Wins: ${player.wins}</p>

        <button onclick="viewPlayer('${player.id}')">
        View
        </button>

        <button onclick="deletePlayer('${player.id}')">
        Delete
        </button>

        `;

        grid.appendChild(card);

    });

}

/* ==========================
   VIEW PLAYER
========================== */

function viewPlayer(playerId) {

    const player =
        db.players.find(
            p => p.id === playerId
        );

    if (!player) return;

    showPage("playerProfile");

    document.getElementById(
        "profileName"
    ).innerText =
        player.name;

    document.getElementById(
        "profileMatches"
    ).innerText =
        player.matches;

    document.getElementById(
        "profileWins"
    ).innerText =
        player.wins;

    document.getElementById(
        "profileElo"
    ).innerText =
        player.elo;

    const winRate =

        player.matches > 0

        ?

        (
            player.wins /
            player.matches
        ) * 100

        :

        0;

    document.getElementById(
        "profileWinrate"
    ).innerText =
        winRate.toFixed(1) + "%";

}

/* ==========================
   TOP PLAYER
========================== */

function getTopPlayer() {

    if (db.players.length === 0)
        return null;

    return [...db.players]
    .sort((a,b)=>
        b.points - a.points
    )[0];

}
