/* ==========================
   STORAGE ENGINE
========================== */

const STORAGE_KEY = "stumble_pro_database_v1";

/* ==========================
   DEFAULT DATABASE
========================== */

const DEFAULT_DB = {

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
   GLOBAL DATABASE
========================== */

let db = {};

/* ==========================
   SAVE DATABASE
========================== */

function saveDatabase() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(db)
        );

        updateSaveIndicator(true);

    } catch(error) {

        console.error(error);

        updateSaveIndicator(false);

    }

}

/* ==========================
   LOAD DATABASE
========================== */

function loadDatabase() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if(saved){

            db = JSON.parse(saved);

        }else{

            db = structuredClone(
                DEFAULT_DB
            );

            saveDatabase();

        }

    } catch(error){

        console.error(error);

        db = structuredClone(
            DEFAULT_DB
        );

    }

}

/* ==========================
   RESET DATABASE
========================== */

function resetDatabase(){

    db = structuredClone(
        DEFAULT_DB
    );

    saveDatabase();

}

/* ==========================
   SAVE INDICATOR
========================== */

function updateSaveIndicator(success){

    const el =
        document.getElementById(
            "saveStatus"
        );

    if(!el) return;

    if(success){

        el.innerHTML =
        "✅ Saved";

    }else{

        el.innerHTML =
        "❌ Save Failed";

    }

}

/* ==========================
   DATABASE STATS
========================== */

function getDatabaseStats(){

    return {

        players:
            db.players.length,

        tournaments:
            db.tournaments.length,

        matches:
            db.matches.length,

        seasons:
            db.seasons.length,

        achievements:
            db.achievements.length

    };

}

/* ==========================
   DATABASE SUMMARY
========================== */

function renderDatabaseSummary(){

    const container =
        document.getElementById(
            "adminDbSummary"
        );

    if(!container) return;

    const stats =
        getDatabaseStats();

    container.innerHTML = `

        <div>
            👥 Players:
            ${stats.players}
        </div>

        <div>
            🏆 Tournaments:
            ${stats.tournaments}
        </div>

        <div>
            🎮 Matches:
            ${stats.matches}
        </div>

        <div>
            📅 Seasons:
            ${stats.seasons}
        </div>

        <div>
            🏅 Achievements:
            ${stats.achievements}
        </div>

    `;

}

/* ==========================
   AUTO SAVE
========================== */

setInterval(() => {

    saveDatabase();

}, 30000);

/* ==========================
   BACKUP SYSTEM
========================== */

function createBackup(){

    const backup = {

        createdAt:
            new Date()
            .toISOString(),

        data: db

    };

    localStorage.setItem(

        "stumble_backup",

        JSON.stringify(
            backup
        )

    );

}

/* ==========================
   RESTORE BACKUP
========================== */

function restoreBackup(){

    const backup =

        localStorage.getItem(
            "stumble_backup"
        );

    if(!backup){

        alert(
            "No backup found"
        );

        return;
    }

    db = JSON.parse(
        backup
    ).data;

    saveDatabase();

}

/* ==========================
   DATABASE VERSION
========================== */

function getVersion(){

    return "1.0.0";

}
