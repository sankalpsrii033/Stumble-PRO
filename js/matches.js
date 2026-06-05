/* ==========================
   MATCH ENGINE
========================== */

function generateMatchId() {

    return "M" + Date.now();

}

/* ==========================
   ADD MATCH
========================== */

function addMatch() {

    const tournamentId =
        document.getElementById(
            "matchTournament"
        )?.value;

    const winnerId =
        document.getElementById(
            "matchWinner"
        )?.value;

    if(!winnerId){

        alert("Select winner");

        return;
    }

    const match = {

        id: generateMatchId(),

        tournamentId,

        winnerId,

        date:
            new Date()
            .toISOString(),

        createdAt:
            Date.now()

    };

    db.matches.push(match);

    updatePlayerStats(
        winnerId
    );

    assignMatchPoints(
        winnerId
    );

    saveDatabase();

    renderMatches();

    updateDashboard();

}

/* ==========================
   UPDATE PLAYER STATS
========================== */

function updatePlayerStats(
    winnerId
){

    db.players.forEach(player => {

        player.matches++;

        if(
            player.id === winnerId
        ){

            player.wins++;

            player.streak++;

            if(
                player.streak >
                player.bestStreak
            ){

                player.bestStreak =
                player.streak;

            }

        }else{

            player.losses++;

            player.streak = 0;

        }

    });

}

/* ==========================
   ASSIGN POINTS
========================== */

function assignMatchPoints(
    winnerId
){

    const player =
        db.players.find(
            p => p.id === winnerId
        );

    if(!player) return;

    player.points +=
        db.settings.points.first;

}

/* ==========================
   DELETE MATCH
========================== */

function deleteMatch(
    matchId
){

    const confirmDelete =
        confirm(
            "Delete match?"
        );

    if(!confirmDelete)
        return;

    db.matches =
        db.matches.filter(
            match =>
            match.id !== matchId
        );

    saveDatabase();

    renderMatches();

}

/* ==========================
   GET MATCH
========================== */

function getMatch(
    matchId
){

    return db.matches.find(
        match =>
        match.id === matchId
    );

}

/* ==========================
   GET PLAYER NAME
========================== */

function getPlayerName(
    playerId
){

    const player =
        db.players.find(
            p => p.id === playerId
        );

    return player
        ? player.name
        : "Unknown";

}

/* ==========================
   GET TOURNAMENT NAME
========================== */

function getTournamentName(
    tournamentId
){

    const tournament =
        db.tournaments.find(
            t => t.id === tournamentId
        );

    return tournament
        ? tournament.name
        : "None";

}

/* ==========================
   RENDER MATCHES
========================== */

function renderMatches(){

    const container =
        document.getElementById(
            "matchesTable"
        );

    if(!container)
        return;

    container.innerHTML = "";

    if(
        db.matches.length === 0
    ){

        container.innerHTML =
        "<p>No matches recorded</p>";

        return;
    }

    db.matches
    .slice()
    .reverse()
    .forEach(match => {

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "match-card";

        card.innerHTML = `

        <h3>
        🎮 Match
        </h3>

        <p>
        Winner:
        ${getPlayerName(
            match.winnerId
        )}
        </p>

        <p>
        Tournament:
        ${getTournamentName(
            match.tournamentId
        )}
        </p>

        <p>
        ${new Date(
            match.date
        ).toLocaleString()}
        </p>

        <button
        onclick="
        deleteMatch(
        '${match.id}'
        )">

        Delete

        </button>

        `;

        container.appendChild(
            card
        );

    });

}

/* ==========================
   MATCH STATS
========================== */

function getTotalMatches(){

    return db.matches.length;

}

function getLatestMatch(){

    if(
        db.matches.length === 0
    )
        return null;

    return db.matches[
        db.matches.length - 1
    ];

}

/* ==========================
   RECENT MATCHES
========================== */

function renderRecentMatches(){

    const container =
        document.getElementById(
            "recentMatches"
        );

    if(!container)
        return;

    container.innerHTML = "";

    const recent =
        db.matches
        .slice(-5)
        .reverse();

    recent.forEach(match => {

        const div =
        document.createElement(
            "div"
        );

        div.innerHTML = `

        🏆
        ${getPlayerName(
            match.winnerId
        )}

        `;

        container.appendChild(
            div
        );

    });

}
