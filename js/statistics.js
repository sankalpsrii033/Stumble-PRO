/* ==========================
   STATISTICS ENGINE
========================== */

let winRateChart = null;
let pointsChart = null;
let eloChart = null;

/* ==========================
   PLAYER WIN RATE
========================== */

function getPlayerWinRate(player){

    if(player.matches === 0)
        return 0;

    return Number(

        (
            player.wins /
            player.matches
        ) * 100

    ).toFixed(1);

}

/* ==========================
   TOP PLAYERS DATA
========================== */

function getTopPlayers(limit = 10){

    return [...db.players]

    .sort(
        (a,b)=>
        b.points - a.points
    )

    .slice(0,limit);

}

/* ==========================
   WIN RATE CHART
========================== */

function renderWinRateChart(){

    const canvas =
        document.getElementById(
            "chartWinRates"
        );

    if(!canvas)
        return;

    if(winRateChart){

        winRateChart.destroy();

    }

    const players =
        getTopPlayers();

    winRateChart =
    new Chart(canvas, {

        type: "bar",

        data: {

            labels:

                players.map(
                    p => p.name
                ),

            datasets: [

                {

                    label:
                    "Win Rate %",

                    data:

                    players.map(
                        p =>
                        getPlayerWinRate(p)
                    )

                }

            ]

        }

    });

}

/* ==========================
   POINTS CHART
========================== */

function renderPointsChart(){

    const canvas =
        document.getElementById(
            "chartPointsDist"
        );

    if(!canvas)
        return;

    if(pointsChart){

        pointsChart.destroy();

    }

    const players =
        getTopPlayers();

    pointsChart =
    new Chart(canvas, {

        type: "doughnut",

        data: {

            labels:

                players.map(
                    p => p.name
                ),

            datasets: [

                {

                    data:

                    players.map(
                        p => p.points
                    )

                }

            ]

        }

    });

}

/* ==========================
   ELO CHART
========================== */

function renderEloChart(){

    const canvas =
        document.getElementById(
            "chartTournamentPerf"
        );

    if(!canvas)
        return;

    if(eloChart){

        eloChart.destroy();

    }

    const players =

        [...db.players]

        .sort(
            (a,b)=>
            b.elo - a.elo
        )

        .slice(0,10);

    eloChart =
    new Chart(canvas, {

        type: "line",

        data: {

            labels:

                players.map(
                    p => p.name
                ),

            datasets: [

                {

                    label:
                    "ELO",

                    data:

                    players.map(
                        p => p.elo
                    )

                }

            ]

        }

    });

}

/* ==========================
   PLAYER COMPARISON
========================== */

function comparePlayers(
    playerAId,
    playerBId
){

    const playerA =
        db.players.find(
            p => p.id === playerAId
        );

    const playerB =
        db.players.find(
            p => p.id === playerBId
        );

    if(
        !playerA ||
        !playerB
    )
        return null;

    return {

        points:

            playerA.points -
            playerB.points,

        wins:

            playerA.wins -
            playerB.wins,

        elo:

            playerA.elo -
            playerB.elo

    };

}

/* ==========================
   TOTAL MATCHES
========================== */

function getTotalMatchesPlayed(){

    return db.matches.length;

}

/* ==========================
   TOTAL TOURNAMENTS
========================== */

function getTotalTournaments(){

    return db.tournaments.length;

}

/* ==========================
   AVERAGE ELO
========================== */

function getAveragePlayerElo(){

    if(
        db.players.length === 0
    )
        return 0;

    const total =

        db.players.reduce(

            (sum,player)=>

            sum + player.elo,

            0

        );

    return Math.round(

        total /

        db.players.length

    );

}

/* ==========================
   INSIGHTS
========================== */

function generateInsights(){

    const container =
        document.getElementById(
            "smartInsights"
        );

    if(!container)
        return;

    const topPlayer =
        getTopPlayer();

    const topElo =
        getHighestEloPlayer();

    const topAchiever =
        getTopAchiever();

    container.innerHTML = `

    <div class="insight-card">

    🏆 Top Player

    <br>

    ${
        topPlayer
        ?
        topPlayer.name
        :
        "N/A"
    }

    </div>

    <div class="insight-card">

    ⚡ Highest ELO

    <br>

    ${
        topElo
        ?
        topElo.name
        :
        "N/A"
    }

    </div>

    <div class="insight-card">

    🏅 Most Achievements

    <br>

    ${
        topAchiever
        ?
        topAchiever.name
        :
        "N/A"
    }

    </div>

    <div class="insight-card">

    🎮 Matches

    <br>

    ${getTotalMatchesPlayed()}

    </div>

    `;

}

/* ==========================
   DASHBOARD STATS
========================== */

function updateStatistics(){

    renderWinRateChart();

    renderPointsChart();

    renderEloChart();

    generateInsights();

}

/* ==========================
   PLAYER SUMMARY
========================== */

function getPlayerSummary(
    playerId
){

    const player =
        db.players.find(
            p => p.id === playerId
        );

    if(!player)
        return null;

    return {

        matches:
            player.matches,

        wins:
            player.wins,

        losses:
            player.losses,

        elo:
            player.elo,

        points:
            player.points,

        winRate:
            getPlayerWinRate(
                player
            )

    };

}
