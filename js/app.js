/* ==========================
   STUMBLE PRO
   MAIN CONTROLLER
========================== */

/* ==========================
   NAVIGATION
========================== */

function navigateTo(page){

    document
    .querySelectorAll(".page")
    .forEach(p => {

        p.classList.remove(
            "active"
        );

    });

    const target =

        document.getElementById(
            `page-${page}`
        );

    if(target){

        target.classList.add(
            "active"
        );

    }

    updatePageData(page);

}

/* ==========================
   PAGE REFRESH
========================== */

function updatePageData(page){

    switch(page){

        case "players":
            renderPlayers();
            break;

        case "tournaments":
            renderTournaments();
            break;

        case "matches":
            renderMatches();
            break;

        case "leaderboard":
            renderLeaderboard();
            break;

        case "achievements":
            renderAchievements();
            break;

        case "statistics":
            updateStatistics();
            break;

        case "seasons":
            renderSeasons();
            break;

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
   SIDEBAR
========================== */

function toggleSidebar(){

    const sidebar =

        document.getElementById(
            "sidebar"
        );

    if(sidebar){

        sidebar.classList.toggle(
            "open"
        );

    }

}

/* ==========================
   DASHBOARD
========================== */

function updateDashboard(){

    const players =
        document.getElementById(
            "statPlayers"
        );

    const tournaments =
        document.getElementById(
            "statTournaments"
        );

    const matches =
        document.getElementById(
            "statMatches"
        );

    if(players){

        players.innerText =
        db.players.length;

    }

    if(tournaments){

        tournaments.innerText =
        db.tournaments.length;

    }

    if(matches){

        matches.innerText =
        db.matches.length;

    }

    renderLiveRankings();

}

/* ==========================
   REFRESH EVERYTHING
========================== */

function refreshAll(){

    updateDashboard();

    renderPlayers();

    renderTournaments();

    renderMatches();

    renderLeaderboard();

    renderAchievements();

    renderSeasons();

    updateStatistics();

    renderDatabaseSummary();

}

/* ==========================
   AUTO CHECKS
========================== */

function performSystemChecks(){

    checkAchievements();

    saveDatabase();

}

/* ==========================
   LIVE UPDATE LOOP
========================== */

setInterval(() => {

    updateDashboard();

}, 5000);

/* ==========================
   AUTO SAVE
========================== */

setInterval(() => {

    saveDatabase();

}, 30000);

/* ==========================
   STARTUP
========================== */

window.addEventListener(

    "load",

    () => {

        loadDatabase();

        refreshAll();

        performSystemChecks();

        console.log(
            "STUMBLE PRO Loaded"
        );

    }

);

/* ==========================
   KEYBOARD SHORTCUTS
========================== */

document.addEventListener(

    "keydown",

    (e) => {

        if(

            e.ctrlKey &&

            e.key === "s"

        ){

            e.preventDefault();

            saveDatabase();

        }

    }

);
