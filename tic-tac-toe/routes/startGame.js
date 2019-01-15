// this is Lu's game
const fs = require('fs');
const readline = require('readline');

const playGame = require('./playGame');
var gameParameter = {
    peoNum: null,
    boaWid: null,
    vicNum: null,
    order: null,
    condition: null
};

// game menu
console.log("---------- Welcome to Tic-Tac-Toe ----------");
console.log("\n 1. New Game");
console.log("\n 2. Load Game");
console.log("\n 3. Quit");

const rl01 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl01.question('\n What do you want to do? ', (answer01) => {
    rl01.close();
    // quit game
    if(answer01 == 3) {
        return 0;
    // load game
    } else if(answer01 == 2) {
        const rl02 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl02.question('\n Which data will you load? ', (answer02) => {
            rl02.close();
            fs.exists("./public/"+answer02, function(exists) {
                if(exists) {
                    gameParameter = JSON.parse(fs.readFileSync("./public/"+answer02));
                    playGame(gameParameter);
                } else {
                    console.log("\n No such a saved data.");
                    return 0;
                }
            });
        });
    // new game
    } else if(answer01 == 1) {
        const rl03 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl03.question('\n How many players are playing?[2,26] ', (answer03) => {
            rl03.close();
            gameParameter.peoNum = parseInt(answer03);
            if(26 < gameParameter.peoNum || gameParameter.peoNum < 2) {
                console.log("\n Error Input!");
                return 0;
            }
            const rl04 = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl04.question('\n How large the board should be?[3,999] ', (answer04) => {
                rl04.close();
                gameParameter.boaWid = parseInt(answer04);
                if(999 < gameParameter.boaWid || gameParameter.boaWid < 3) {
                    console.log("\n Error Input!");
                    return 0;
                }
                const rl05 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl05.question('\n What the win sequence count should be?[3,'+gameParameter.boaWid+'] ', (answer05) => {
                    rl05.close();
                    gameParameter.vicNum = parseInt(answer05);
                    if(gameParameter.boaWid < gameParameter.vicNum || gameParameter.vicNum < 3 || (gameParameter.vicNum-1)*gameParameter.peoNum+1 > gameParameter.boaWid*gameParameter.boaWid) {
                        console.log("\n Error Input!");
                        return 0;
                    }
                    gameParameter.order = 0;
                    gameParameter.condition = new Array();
                    for(var i = 0; i < gameParameter.boaWid; i++) {
                        gameParameter.condition[i] = new Array();
                        for(var j = 0; j < gameParameter.boaWid; j++) {
                            gameParameter.condition[i][j] = " ";
                        }
                    }
                    // start playing
                    playGame(gameParameter);
                });
            });
        });
    // error input
    } else {
        console.log("\n Error Input!");
        return 0;
    }
});