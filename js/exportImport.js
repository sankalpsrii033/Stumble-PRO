/* ==========================
   EXPORT / IMPORT ENGINE
========================== */

/* ==========================
   EXPORT DATA
========================== */

function exportData(){

    const data = JSON.stringify(
        db,
        null,
        2
    );

    const blob = new Blob(

        [data],

        {
            type:
            "application/json"
        }

    );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;

    link.download =

        `stumble-pro-backup-${
            new Date()
            .toISOString()
            .split("T")[0]
        }.json`;

    document.body
    .appendChild(link);

    link.click();

    document.body
    .removeChild(link);

    URL.revokeObjectURL(
        url
    );

    alert(
        "Backup exported successfully"
    );

}

/* ==========================
   IMPORT DATA
========================== */

function importData(event){

    const file =

        event.target.files[0];

    if(!file)
        return;

    const reader =
        new FileReader();

    reader.onload =

    function(e){

        try{

            const imported =

                JSON.parse(
                    e.target.result
                );

            if(
                !imported.players
            ){

                throw new Error(
                    "Invalid File"
                );

            }

            db = imported;

            saveDatabase();

            refreshAll();

            alert(
                "Backup imported successfully"
            );

        }

        catch(error){

            alert(
                "Invalid JSON file"
            );

            console.error(
                error
            );

        }

    };

    reader.readAsText(
        file
    );

}

/* ==========================
   IMPORT BUTTON
========================== */

function importDataPrompt(){

    const input =

        document.getElementById(
            "importFileInput"
        );

    if(input){

        input.click();

    }

}

/* ==========================
   CLEAR DATABASE
========================== */

function clearAllData(){

    localStorage.removeItem(
        STORAGE_KEY
    );

    db = structuredClone(
        DEFAULT_DB
    );

    saveDatabase();

    refreshAll();

}

/* ==========================
   CONFIRM CLEAR
========================== */

function confirmClearData(){

    const confirmDelete =

        confirm(

        "Delete ALL data permanently?"

        );

    if(
        !confirmDelete
    )
        return;

    clearAllData();

    alert(
        "Database cleared"
    );

}

/* ==========================
   BACKUP TO LOCAL
========================== */

function saveBackup(){

    localStorage.setItem(

        "stumble_backup",

        JSON.stringify(db)

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
    );

    saveDatabase();

    refreshAll();

    alert(
        "Backup restored"
    );

}

/* ==========================
   AUTO BACKUP
========================== */

function autoBackup(){

    saveBackup();

}

setInterval(

    autoBackup,

    60000

);

/* ==========================
   DATABASE INFO
========================== */

function getDatabaseSize(){

    return Math.round(

        JSON.stringify(db)
        .length / 1024

    );

}

/* ==========================
   BACKUP INFO
========================== */

function getBackupInfo(){

    return {

        players:
            db.players.length,
