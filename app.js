/* ==========================
   STUMBLE PRO v2
   CORE DATABASE ENGINE
========================== */

const STORAGE_KEY = "stumble_pro_database";

/* ==========================
   DATABASE
========================== */

let db = {
    players: [],
    tournaments: [],
    matches: [],
    seasons: [],
    achievements: [],
    activityFeed: [],
    settings: {
        points: {
            first: 10,
            second: 7,
            third: 5,
            fourth: 3,
            other: 1
        }
    }
};

/* ==========================
   SAVE / LOAD
========================== */

function saveDatabase() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(db)
    );

    updateSaveStatus();
}

function loadDatabase() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if(saved){

        db = JSON.parse(saved);

    }else{

        saveDatabase();

    }
}

function updateSaveStatus(){

    const status =
        document.getElementById("saveStatus");

    if(!status) return;

    status.innerHTML =
        "✅ All Data Saved";
}

/* ==========================
   ID GENERATOR
========================== */

function generateId(){

    return (
        Date.now().toString() +
        Math.random()
        .toString(36)
        .substring(2,8)
    );

}

/* ==========================
   ACTIVITY FEED
========================== */

function addActivity(text){

    db.activityFeed.unshift({

        id: generateId(),

        text,

        date: new Date().toISOString()

    });

    if(db.activityFeed.length > 100){

        db.activityFeed.pop();

    }

    saveDatabase();

    renderActivityFeed();
}

/* ==========================
   PLAYER ENGINE
========================== */

function addPlayer(){

    const name =
        document.getElementById("playerName")?.value || "";

    const username =
        document.getElementById("playerUsername")?.value || "";

    if(!name){

        alert("Player name required");

        return;
    }

    const player = {

        id: generateId(),

        name,

        username,

        matches: 0,

        wins: 0,

        losses: 0,

        points: 0,

        elo: 1000,

        cups: 0,

        tournamentsWon: 0,

        achievements: [],

        streak: 0,

        bestStreak: 0,

        createdAt: Date.now()

    };

    db.players.push(player);

    saveDatabase();

    addActivity(
        `${name} joined STUMBLE PRO`
    );

    renderPlayers();

    updateDashboard();
}

/* ==========================
   PLAYER RENDER
========================== */

function renderPlayers(){

    const grid =
        document.getElementById("playersGrid");

    if(!grid) return;

    const search =
        document
        .getElementById("playerSearch")
        ?.value
        .toLowerCase() || "";

    let players = [...db.players];

    players = players.filter(player =>

        player.name
        .toLowerCase()
        .includes(search)

    );

    grid.innerHTML = "";

    players.forEach(player => {

        const card =
        document.createElement("div");

        card.className =
            "player-card";

        card.innerHTML = `

            <h3>${player.name}</h3>

            <p>ELO: ${player.elo}</p>

            <p>Wins: ${player.wins}</p>

            <p>Points: ${player.points}</p>

            <button
            onclick="viewPlayer('${player.id}')">

            View

            </button>

        `;

        grid.appendChild(card);

    });

}

/* ==========================
   PLAYER PROFILE
========================== */

function viewPlayer(id){

    const player =
        db.players.find(
            p => p.id === id
        );

    if(!player) return;

    showPage("playerProfile");

    document.getElementById(
        "profileName"
    ).innerText = player.name;

    document.getElementById(
        "profileMatches"
    ).innerText = player.matches;

    document.getElementById(
        "profileWins"
    ).innerText = player.wins;

    document.getElementById(
        "profileElo"
    ).innerText = player.elo;

    const rate =

        player.matches === 0

        ? 0

        :

        (
            player.wins /
            player.matches
        ) * 100;

    document.getElementById(
        "profileWinrate"
    ).innerText =
        rate.toFixed(1) + "%";

}

/* ==========================
   DASHBOARD
========================== */

function updateDashboard(){

    const players =
        document.getElementById(
            "totalPlayers"
        );

    const tournaments =
        document.getElementById(
            "totalTournaments"
        );

    const matches =
        document.getElementById(
            "totalMatches"
        );

    if(players)
        players.innerText =
        db.players.length;

    if(tournaments)
        tournaments.innerText =
        db.tournaments.length;

    if(matches)
        matches.innerText =
        db.matches.length;

}

/* ==========================
   PAGE SYSTEM
========================== */

function showPage(pageId){

    document
    .querySelectorAll(".page")
    .forEach(page => {

        page.classList.remove(
            "active"
        );

    });

    const page =
        document.getElementById(
            pageId
        );

    if(page){

        page.classList.add(
            "active"
        );

    }

}

/* ==========================
   MODALS
========================== */

function openModal(id){

    const modal =
        document.getElementById(id);

    if(modal){

        modal.classList.add(
            "active"
        );

    }

}

function closeModal(id){

    const modal =
        document.getElementById(id);

    if(modal){

        modal.classList.remove(
            "active"
        );

    }

}

/* ==========================
   ACTIVITY FEED RENDER
========================== */

function renderActivityFeed(){

    const container =
        document.getElementById(
            "activityFeed"
        );

    if(!container) return;

    container.innerHTML = "";

    db.activityFeed
    .slice(0,10)
    .forEach(item => {

        const div =
        document.createElement("div");

        div.innerHTML = `

            <p>${item.text}</p>

        `;

        container.appendChild(div);

    });

}

/* ==========================
   STARTUP
========================== */

window.onload = () => {

    loadDatabase();

    renderPlayers();

    renderActivityFeed();

    updateDashboard();

};
