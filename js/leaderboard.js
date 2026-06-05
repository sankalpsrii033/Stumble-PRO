/* ==========================
   LEADERBOARD ENGINE
========================== */

/* ==========================
   SORT HELPERS
========================== */

function sortByPoints() {

    return [...db.players]

    .sort(
        (a,b) =>
        b.points - a.points
    );

}

function sortByWins() {

    return [...db.players]

    .sort(
        (a,b) =>
        b.wins - a.wins
    );

}

function sortByCups() {

    return [...db.players]

    .sort(
        (a,b) =>
        (b.cups || 0) -
        (a.cups || 0)
    );

}

function sortByElo() {

    return [...db.players]

    .sort(
        (a,b) =>
        b.elo - a.elo
    );

}

function sortByWinRate() {

    return [...db.players]

    .sort((a,b) => {

        const rateA =

            a.matches > 0

            ?

            (a.wins / a.matches)

            : 0;

        const rateB =

            b.matches > 0

            ?

            (b.wins / b.matches)

            : 0;

        return rateB - rateA;

    });

}

/* ==========================
   GOAT SCORE
========================== */

function calculateGoatScore(player){

    return (

        player.points * 1 +

        player.wins * 10 +

        (player.cups || 0) * 50 +

        (player.elo || 1000)

    );

}

function sortByGoatScore(){

    return [...db.players]

    .sort(

        (a,b) =>

        calculateGoatScore(b)

        -

        calculateGoatScore(a)

    );

}

/* ==========================
   RENDER LEADERBOARD
========================== */

function renderLeaderboard(
    mode = "goat"
){

    const container =

        document.getElementById(
            "leaderboardBody"
        );

    if(!container)
        return;

    let players = [];

    switch(mode){

        case "points":
            players =
            sortByPoints();
            break;

        case "wins":
            players =
            sortByWins();
            break;

        case "cups":
            players =
            sortByCups();
            break;

        case "elo":
            players =
            sortByElo();
            break;

        case "winrate":
            players =
            sortByWinRate();
            break;

        default:
            players =
            sortByGoatScore();

    }

    container.innerHTML = "";

    players.forEach(

        (player,index) => {

        const row =
        document.createElement("tr");

        const winRate =

            player.matches > 0

            ?

            (

                player.wins

                /

                player.matches

            ) * 100

            :

            0;

        row.innerHTML = `

        <td>

        #${index + 1}

        </td>

        <td>

        ${player.name}

        </td>

        <td>

        ${player.points}

        </td>

        <td>

        ${player.wins}

        </td>

        <td>

        ${player.elo}

        </td>

        <td>

        ${winRate.toFixed(1)}%

        </td>

        `;

        container.appendChild(
            row
        );

    });

}

/* ==========================
   TOP PLAYERS
========================== */

function getTopPlayer(){

    if(
        db.players.length === 0
    )
        return null;

    return sortByGoatScore()[0];

}

function getTopPointPlayer(){

    if(
        db.players.length === 0
    )
        return null;

    return sortByPoints()[0];

}

function getTopWinPlayer(){

    if(
        db.players.length === 0
    )
        return null;

    return sortByWins()[0];

}

function getTopCupPlayer(){

    if(
        db.players.length === 0
    )
        return null;

    return sortByCups()[0];

}

/* ==========================
   DASHBOARD RANKINGS
========================== */

function renderLiveRankings(){

    const container =

        document.getElementById(
            "liveRankings"
        );

    if(!container)
        return;

    container.innerHTML = "";

    const topPlayers =

        sortByGoatScore()
        .slice(0,5);

    topPlayers.forEach(

        (player,index) => {

        const item =
        document.createElement(
            "div"
        );

        item.className =
        "ranking-item";

        item.innerHTML = `

        <strong>

        #${index+1}

        </strong>

        ${player.name}

        -

        ${player.points} pts

        `;

        container.appendChild(
            item
        );

    });

}

/* ==========================
   LEADERBOARD STATS
========================== */

function getLeaderboardStats(){

    return {

        totalPlayers:
            db.players.length,

        topPlayer:
            getTopPlayer(),

        topWins:
            getTopWinPlayer(),

        topPoints:
            getTopPointPlayer(),

        topCups:
            getTopCupPlayer()

    };

}
