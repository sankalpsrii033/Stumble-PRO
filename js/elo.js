/* ==========================
   ELO RATING ENGINE
========================== */

const ELO_K_FACTOR = 32;

/* ==========================
   EXPECTED SCORE
========================== */

function expectedScore(
    ratingA,
    ratingB
){

    return 1 /

    (

        1 +

        Math.pow(

            10,

            (ratingB - ratingA)
            / 400

        )

    );

}

/* ==========================
   UPDATE ELO
========================== */

function updateEloRatings(

    winnerId,

    loserId

){

    const winner =
        db.players.find(
            p => p.id === winnerId
        );

    const loser =
        db.players.find(
            p => p.id === loserId
        );

    if(
        !winner ||
        !loser
    ) return;

    const expectedWinner =

        expectedScore(

            winner.elo,

            loser.elo

        );

    const expectedLoser =

        expectedScore(

            loser.elo,

            winner.elo

        );

    winner.elo = Math.round(

        winner.elo +

        ELO_K_FACTOR *

        (

            1 -

            expectedWinner

        )

    );

    loser.elo = Math.round(

        loser.elo +

        ELO_K_FACTOR *

        (

            0 -

            expectedLoser

        )

    );

    saveDatabase();

}

/* ==========================
   RECALCULATE ELO
========================== */

function recalculateElo(){

    db.players.forEach(player => {

        player.elo = 1000;

    });

    saveDatabase();

    alert(
        "All ELO ratings reset to 1000"
    );

}

/* ==========================
   ELO LEADERBOARD
========================== */

function getTopEloPlayers(){

    return [...db.players]

    .sort(

        (a,b) =>

        b.elo - a.elo

    );

}

/* ==========================
   PLAYER RANK TITLE
========================== */

function getRankTitle(elo){

    if(elo >= 2000)
        return "🏆 Grandmaster";

    if(elo >= 1800)
        return "💎 Master";

    if(elo >= 1600)
        return "🔥 Diamond";

    if(elo >= 1400)
        return "🥇 Platinum";

    if(elo >= 1200)
        return "🥈 Gold";

    if(elo >= 1000)
        return "🥉 Silver";

    return "📘 Bronze";

}

/* ==========================
   RENDER ELO TABLE
========================== */

function renderEloLeaderboard(){

    const container =
        document.getElementById(
            "eloLeaderboard"
        );

    if(!container)
        return;

    const players =
        getTopEloPlayers();

    container.innerHTML = "";

    players.forEach(

        (player,index) => {

        const row =
        document.createElement(
            "div"
        );

        row.className =
        "leaderboard-row";

        row.innerHTML = `

        <span>

        #${index + 1}

        </span>

        <span>

        ${player.name}

        </span>

        <span>

        ${player.elo}

        </span>

        <span>

        ${getRankTitle(
            player.elo
        )}

        </span>

        `;

        container.appendChild(
            row
        );

    });

}

/* ==========================
   HIGHEST ELO PLAYER
========================== */

function getHighestEloPlayer(){

    if(
        db.players.length === 0
    ) return null;

    return [...db.players]

    .sort(

        (a,b) =>

        b.elo - a.elo

    )[0];

}

/* ==========================
   ELO STATS
========================== */

function getAverageElo(){

    if(
        db.players.length === 0
    ) return 0;

    const total =

        db.players.reduce(

            (sum,player) =>

            sum + player.elo,

            0

        );

    return Math.round(

        total /

        db.players.length

    );

}

/* ==========================
   ELO INSIGHTS
========================== */

function generateEloInsights(){

    const topPlayer =
        getHighestEloPlayer();

    if(!topPlayer){

        return "No players available";

    }

    return `

    ⚡ Highest Rated:
    ${topPlayer.name}

    (${topPlayer.elo})

    `;

}
