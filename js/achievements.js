/* ==========================
   ACHIEVEMENT ENGINE
========================== */

const ACHIEVEMENTS = [

{
    id: "first_win",
    name: "🥇 First Victory",
    description: "Win your first match"
},

{
    id: "ten_wins",
    name: "🔥 Winner",
    description: "Win 10 matches"
},

{
    id: "fifty_wins",
    name: "⚡ Champion",
    description: "Win 50 matches"
},

{
    id: "hundred_points",
    name: "💰 Point Collector",
    description: "Reach 100 points"
},

{
    id: "five_streak",
    name: "🚀 Hot Streak",
    description: "Win 5 matches in a row"
},

{
    id: "ten_streak",
    name: "👑 Unstoppable",
    description: "Win 10 matches in a row"
},

{
    id: "elo_1200",
    name: "🥈 Gold Rank",
    description: "Reach 1200 ELO"
},

{
    id: "elo_1500",
    name: "💎 Diamond Rank",
    description: "Reach 1500 ELO"
},

{
    id: "tournament_champion",
    name: "🏆 Tournament Champion",
    description: "Win a tournament"
},

{
    id: "goat",
    name: "⭐ GOAT",
    description: "Become #1 on leaderboard"
}

];

/* ==========================
   UNLOCK ACHIEVEMENT
========================== */

function unlockAchievement(
    player,
    achievementId
){

    if(
        player.achievements
        .includes(
            achievementId
        )
    ){
        return;
    }

    player.achievements.push(
        achievementId
    );

    addActivity(
        `${player.name}
        unlocked
        ${achievementId}`
    );

}

/* ==========================
   CHECK PLAYER
========================== */

function checkPlayerAchievements(
    player
){

    if(
        player.wins >= 1
    ){
        unlockAchievement(
            player,
            "first_win"
        );
    }

    if(
        player.wins >= 10
    ){
        unlockAchievement(
            player,
            "ten_wins"
        );
    }

    if(
        player.wins >= 50
    ){
        unlockAchievement(
            player,
            "fifty_wins"
        );
    }

    if(
        player.points >= 100
    ){
        unlockAchievement(
            player,
            "hundred_points"
        );
    }

    if(
        player.streak >= 5
    ){
        unlockAchievement(
            player,
            "five_streak"
        );
    }

    if(
        player.streak >= 10
    ){
        unlockAchievement(
            player,
            "ten_streak"
        );
    }

    if(
        player.elo >= 1200
    ){
        unlockAchievement(
            player,
            "elo_1200"
        );
    }

    if(
        player.elo >= 1500
    ){
        unlockAchievement(
            player,
            "elo_1500"
        );
    }

}

/* ==========================
   CHECK ALL
========================== */

function checkAchievements(){

    db.players.forEach(
        player => {

        if(
            !player.achievements
        ){
            player.achievements = [];
        }

        checkPlayerAchievements(
            player
        );

    });

    checkGoatAchievement();

    saveDatabase();

    renderAchievements();

}

/* ==========================
   GOAT CHECK
========================== */

function checkGoatAchievement(){

    const goat =
        getTopPlayer();

    if(!goat)
        return;

    unlockAchievement(
        goat,
        "goat"
    );

}

/* ==========================
   TOURNAMENT CHAMPION
========================== */

function awardTournamentChampion(
    playerId
){

    const player =
        db.players.find(
            p =>
            p.id === playerId
        );

    if(!player)
        return;

    unlockAchievement(
        player,
        "tournament_champion"
    );

}

/* ==========================
   ACHIEVEMENT NAME
========================== */

function getAchievement(
    id
){

    return ACHIEVEMENTS.find(
        a => a.id === id
    );

}

/* ==========================
   RENDER ACHIEVEMENTS
========================== */

function renderAchievements(){

    const gallery =
        document.getElementById(
            "achievementGrid"
        );

    if(!gallery)
        return;

    gallery.innerHTML = "";

    db.players.forEach(
        player => {

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "achievement-card";

        let badges = "";

        player.achievements
        .forEach(id => {

            const achievement =
                getAchievement(id);

            if(
                achievement
            ){

                badges += `

                <div
                class="badge">

                ${achievement.name}

                </div>

                `;

            }

        });

        card.innerHTML = `

        <h3>
        ${player.name}
        </h3>

        <p>

        ${player.achievements.length}

        Achievements

        </p>

        ${badges}

        `;

        gallery.appendChild(
            card
        );

    });

}

/* ==========================
   PLAYER ACH COUNT
========================== */

function getAchievementCount(
    playerId
){

    const player =
        db.players.find(
            p =>
            p.id === playerId
        );

    if(!player)
        return 0;

    return player
    .achievements
    .length;

}

/* ==========================
   TOP ACHIEVER
========================== */

function getTopAchiever(){

    if(
        db.players.length === 0
    )
        return null;

    return [...db.players]

    .sort(

        (a,b)=>

        b.achievements.length

        -

        a.achievements.length

    )[0];

}
