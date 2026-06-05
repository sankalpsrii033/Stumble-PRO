/* ==========================
   TOURNAMENT ENGINE
========================== */

function generateTournamentId() {
    return "T" + Date.now();
}

/* ==========================
   ADD TOURNAMENT
========================== */

function addTournament() {

    const name =
        document.getElementById("tournamentName")?.value?.trim();

    if (!name) {
        alert("Tournament name required");
        return;
    }

    const tournament = {

        id: generateTournamentId(),

        name: name,

        type: "Tournament",

        status: "Upcoming",

        players: [],

        matches: [],

        winner: null,

        createdAt: new Date().toISOString()

    };

    db.tournaments.push(tournament);

    saveDatabase();

    renderTournaments();

    updateDashboard();
}

/* ==========================
   DELETE TOURNAMENT
========================== */

function deleteTournament(id) {

    const confirmDelete =
        confirm("Delete tournament?");

    if (!confirmDelete) return;

    db.tournaments =
        db.tournaments.filter(
            t => t.id !== id
        );

    saveDatabase();

    renderTournaments();
}

/* ==========================
   START TOURNAMENT
========================== */

function startTournament(id) {

    const tournament =
        db.tournaments.find(
            t => t.id === id
        );

    if (!tournament) return;

    tournament.status = "Live";

    saveDatabase();

    renderTournaments();
}

/* ==========================
   COMPLETE TOURNAMENT
========================== */

function completeTournament(id, winnerId) {

    const tournament =
        db.tournaments.find(
            t => t.id === id
        );

    if (!tournament) return;

    tournament.status = "Completed";

    tournament.winner = winnerId;

    const player =
        db.players.find(
            p => p.id === winnerId
        );

    if(player){

        player.tournamentsWon =
            (player.tournamentsWon || 0) + 1;

        player.cups =
            (player.cups || 0) + 1;

    }

    saveDatabase();

    renderTournaments();
}

/* ==========================
   GET TOURNAMENT
========================== */

function getTournament(id){

    return db.tournaments.find(
        t => t.id === id
    );

}

/* ==========================
   RENDER TOURNAMENTS
========================== */

function renderTournaments() {

    const grid =
        document.getElementById(
            "tournamentsGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    if(db.tournaments.length === 0){

        grid.innerHTML =
        "<p>No tournaments found</p>";

        return;
    }

    db.tournaments.forEach(t => {

        const card =
        document.createElement("div");

        card.className =
        "tournament-card";

        card.innerHTML = `

        <h3>${t.name}</h3>

        <p>📌 Status: ${t.status}</p>

        <p>🎮 Matches:
        ${t.matches.length}</p>

        <button
        onclick="startTournament('${t.id}')">

        Start

        </button>

        <button
        onclick="deleteTournament('${t.id}')">

        Delete

        </button>

        `;

        grid.appendChild(card);

    });

}

/* ==========================
   TOURNAMENT STATS
========================== */

function getLiveTournamentCount(){

    return db.tournaments.filter(
        t => t.status === "Live"
    ).length;

}

function getCompletedTournamentCount(){

    return db.tournaments.filter(
        t => t.status === "Completed"
    ).length;

}

/* ==========================
   TOURNAMENT CHAMPION
========================== */

function getTournamentChampion(){

    const completed =

        db.tournaments.filter(
            t => t.status === "Completed"
        );

    if(completed.length === 0)
        return null;

    return completed[
        completed.length - 1
    ];

}
