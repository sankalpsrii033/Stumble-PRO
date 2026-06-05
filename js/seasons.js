/* ==========================
   SEASON ENGINE
========================== */

function generateSeasonId() {

    return "S" + Date.now();

}

/* ==========================
   CREATE SEASON
========================== */

function createSeason() {

    const name =
        document.getElementById(
            "seasonName"
        )?.value?.trim();

    if(!name){

        alert(
            "Enter season name"
        );

        return;
    }

    const season = {

        id: generateSeasonId(),

        name: name,

        startDate:
            new Date()
            .toISOString(),

        endDate: null,

        status: "Active",

        champion: null,

        rankings: [],

        matches: [],

        createdAt:
            Date.now()

    };

    db.seasons.push(
        season
    );

    addActivity(
        `📅 New Season Created: ${name}`
    );

    saveDatabase();

    renderSeasons();

}

/* ==========================
   END SEASON
========================== */

function endSeason(
    seasonId
){

    const season =
        db.seasons.find(
            s => s.id === seasonId
        );

    if(!season)
        return;

    season.status =
        "Completed";

    season.endDate =
        new Date()
        .toISOString();

    const champion =
        getTopPlayer();

    if(champion){

        season.champion =
            champion.id;

        champion.cups =
            (champion.cups || 0) + 1;

    }

    saveDatabase();

    renderSeasons();

}

/* ==========================
   ACTIVE SEASON
========================== */

function getActiveSeason(){

    return db.seasons.find(
        s =>
        s.status === "Active"
    );

}

/* ==========================
   ADD MATCH TO SEASON
========================== */

function addSeasonMatch(
    matchId
){

    const season =
        getActiveSeason();

    if(!season)
        return;

    season.matches.push(
        matchId
    );

}

/* ==========================
   GET SEASON CHAMPION
========================== */

function getSeasonChampion(
    seasonId
){

    const season =
        db.seasons.find(
            s => s.id === seasonId
        );

    if(
        !season ||
        !season.champion
    )
        return null;

    return db.players.find(
        p =>
        p.id === season.champion
    );

}

/* ==========================
   DELETE SEASON
========================== */

function deleteSeason(
    seasonId
){

    const confirmDelete =
        confirm(
            "Delete season?"
        );

    if(!confirmDelete)
        return;

    db.seasons =
        db.seasons.filter(
            season =>
            season.id !== seasonId
        );

    saveDatabase();

    renderSeasons();

}

/* ==========================
   RENDER SEASONS
========================== */

function renderSeasons(){

    const grid =
        document.getElementById(
            "seasonsGrid"
        );

    if(!grid)
        return;

    grid.innerHTML = "";

    if(
        db.seasons.length === 0
    ){

        grid.innerHTML =
        "<p>No seasons created</p>";

        return;

    }

    db.seasons.forEach(
        season => {

        const champion =
            getSeasonChampion(
                season.id
            );

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "season-card";

        card.innerHTML = `

        <h3>
        ${season.name}
        </h3>

        <p>
        Status:
        ${season.status}
        </p>

        <p>
        Matches:
        ${season.matches.length}
        </p>

        <p>
        Champion:
        ${
            champion
            ?
            champion.name
            :
            "TBD"
        }
        </p>

        <button
        onclick="
        endSeason(
        '${season.id}'
        )">

        End Season

        </button>

        <button
        onclick="
        deleteSeason(
        '${season.id}'
        )">

        Delete

        </button>

        `;

        grid.appendChild(
            card
        );

    });

}

/* ==========================
   SEASON HISTORY
========================== */

function getSeasonHistory(){

    return db.seasons.filter(
        season =>
        season.status ===
        "Completed"
    );

}

/* ==========================
   CURRENT CHAMPION
========================== */

function getCurrentChampion(){

    const completed =

        db.seasons.filter(
            season =>
            season.status ===
            "Completed"
        );

    if(
        completed.length === 0
    )
        return null;

    const latest =

        completed[
            completed.length - 1
        ];

    return getSeasonChampion(
        latest.id
    );

}

/* ==========================
   HALL OF FAME
========================== */

function getHallOfFame(){

    return [...db.players]

    .sort(

        (a,b)=>

        (b.cups || 0)

        -

        (a.cups || 0)

    )

    .slice(0,10);

}

/* ==========================
   SEASON STATS
========================== */

function getSeasonStats(){

    return {

        totalSeasons:
            db.seasons.length,

        activeSeason:
            getActiveSeason(),

        completedSeasons:
            getSeasonHistory()
            .length,

        currentChampion:
            getCurrentChampion()

    };

}
