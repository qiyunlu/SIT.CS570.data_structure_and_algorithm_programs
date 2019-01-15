const fs = require('fs');
const async = require('async');
const readline = require('readline');

module.exports = function(gamePara) {

var ordList = ['X','O','A','B','C','D','E','F','G','H',
                'I','J','K','L','M','N','P','Q','R','S',
                'T','U','V','W','Y','Z',];
var winner = null;

// play and loop
async.whilst(
    // if true then loop
    function() {
        return winner == null;
    },
    // loop body
    function(callback) {
        // print the board
        console.log("\n===================="+ordList[gamePara.order]+"'s Turn====================\n");
        gamePara.order += 1;
        if(gamePara.order >= gamePara.peoNum) {
            gamePara.order = 0;
        }

        for(var i = 1, str01 = ""; i <= gamePara.boaWid; i++) {
            str01 += " "+(Array(3).join(0) + i).slice(-3);
        }
        console.log("  "+str01);
        for(var i = 1; i <= gamePara.boaWid; i += 0.5) {
            // Horizontal cut off
            if((i % 1) != 0) {
                for(var k = 2, str02 = ""; k <= gamePara.boaWid; k++) {
                    str02 += "+---";
                }
                console.log("   ---"+str02);
            }
            // normal rows
            else {
                for(var j = 2, str03 = ""; j <= gamePara.boaWid; j++) {
                    str03 += "| "+gamePara.condition[parseInt(i)-1][j-1]+" ";
                }
                console.log((Array(3).join(0) + i).slice(-3)+" "+gamePara.condition[parseInt(i)-1][0]+" "+str03);
            }
        }
        // read player input
        const rl11 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl11.question('\n Input a row and a column separated by a space, or Q to quit. ', (answer11) => {
            rl11.close();
            // quit and save game
            if(answer11 == "Q") {
                winner = "-1";
                callback(null, winner);
            } else {
                var rc = answer11.split(' ');
                if(isNaN(rc[0]) || isNaN(rc[1])) {
                    // input error
                    callback(1, winner);
                } else if(gamePara.condition[parseInt(rc[0])-1][parseInt(rc[1])-1] == " ") {
                    if(gamePara.order == 0) {
                        gamePara.condition[parseInt(rc[0])-1][parseInt(rc[1])-1] = ordList[gamePara.peoNum-1];
                    } else {
                        gamePara.condition[parseInt(rc[0])-1][parseInt(rc[1])-1] = ordList[gamePara.order-1];
                    }
                    // Judge whether it is someone's victory
                    var draw = 1;
                    for(var i = 0; i < gamePara.boaWid; i++) {
                        for(var j = 0; j < gamePara.boaWid; j++) {
                            var who = gamePara.condition[i][j];
                            if(who != " ") {
                                for(var k = 0, num1 = 0; k < gamePara.vicNum; k++) {
                                    if(i < gamePara.boaWid && (j+k) < gamePara.boaWid && gamePara.condition[i][j+k] == who) {
                                        num1 += 1;
                                        if(num1 == gamePara.vicNum) {
                                            winner = who;
                                            callback(null, winner);
                                        }
                                    }
                                }
                                for(var l = 0, num2 = 0; l < gamePara.vicNum; l++) {
                                    if((i+l) < gamePara.boaWid && (j+l) < gamePara.boaWid && gamePara.condition[i+l][j+l] == who) {
                                        num2 += 1;
                                        if(num2 == gamePara.vicNum) {
                                            winner = who;
                                            callback(null, winner);
                                        }
                                    }
                                }
                                for(var m = 0, num3 = 0; m < gamePara.vicNum; m++) {
                                    if((i+m) < gamePara.boaWid && j < gamePara.boaWid && gamePara.condition[i+m][j] == who) {
                                        num3 += 1;
                                        if(num3 == gamePara.vicNum) {
                                            winner = who;
                                            callback(null, winner);
                                        }
                                    }
                                }
                                for(var n = 0, num4 = 0; n < gamePara.vicNum; n++) {
                                    if((i+n) < gamePara.boaWid && 0 <= (j-n) && gamePara.condition[i+n][j-n] == who) {
                                        num4 += 1;
                                        if(num4 == gamePara.vicNum) {
                                            winner = who;
                                            callback(null, winner);
                                        }
                                    }
                                }
                            } else {
                                // still have blanks
                                draw = 0;
                            }
                        }
                    }
                    if(draw) {
                        // no blank on the board
                        winner = "nobody. It is draw";
                        callback(null, winner);
                    } else {
                        if(winner == null) {
                            callback(null, winner);
                        }
                    }
                } else {
                    // not blank
                    callback(1, winner);
                }
            }
        });
    },
    // enter here after jump out of loop
    function (err, winner) {
        if(err) {
            console.log("\n Error, game quits.");
            return 0;
        } else {
            if(winner == "-1") {
                // save data
                const rl12 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl12.question('\n Input a name for your saved data. ', (answer12) => {
                    rl12.close();
                    if(gamePara.order == 0) {
                        gamePara.order = gamePara.peoNum-1;
                    } else {
                        gamePara.order -= 1;
                    }
                    fs.writeFileSync("./public/"+answer12, JSON.stringify(gamePara));
                    console.log("\n Quit game.");
                    return 0;
                });
            }
            else {
                console.log("\n The winner is "+winner+"!");
                return 0;
            }
        }
    }
);
}
