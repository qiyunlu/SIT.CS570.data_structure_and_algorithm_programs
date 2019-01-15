// this is Lu's trie articles assignment
const fs = require('fs');
const readline = require('readline');

const Trie = require('./trie');

var hitCount = [];
var article = [];
var trie = new Trie();

function start() {
    // read companies.dat
    var list = fs.readFileSync("./companies.dat", "utf-8");
    // seperate lines
    list = list.split("\n");
    for(var i = 0; i < list.length; i++) {
        // get rid of empty line
        if(list[i] == "") {
            list.splice(i, 1);
            i--;
        }
        // seperate company names
        else {
            list[i] = list[i].split("\t");
        }
    }
    
    // store companies' primary names
    for(var i = 0; i < list.length; i++) {
        hitCount[i] = [list[i][0], 0];
    }
    
    // build trie
    for(var i = 0; i < list.length; i++) {
        for(var j = 0; j < list[i].length; j++) {
            // insert company names
            trie.insert(list[i][j], i);
        }
    }

    // read input articles
    var turn = 0;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt('Input> ');
    rl.prompt();

    rl.on('line', function(line) {
        var _allIsDot = true;
        for(var i = 0; i < line.length; i++) {
            if(line[i] != ".") {
                _allIsDot = false;
                break;
            }
        }
        if(_allIsDot) {
            rl.close();
        }
        else {
            article[turn] = line;
            turn++;
            rl.prompt();
        }
    });

    rl.on('close', function() {
        next01();
    });
}


function next01() {
    // find company names in articles
    var record = {
        totalWords: 0,
        hitArray: []
    };
    for(var i = 0; i < article.length; i++) {
        record = trie.countHit(article[i], record);
    }
    var hy = record.hitArray;
    for(var i = 0; i < hy.length; i++) {
        hitCount[hy[i]][1]++;
    }

    // print out result
    var totalHit = 0;
    console.log("\n | Company | Hit Count | Relevance |\n");
    for(var i = 0; i < hitCount.length; i++) {
        totalHit += hitCount[i][1];
        var rel = (hitCount[i][1]/record.totalWords*100).toFixed(4).toString();
        console.log(" | "+hitCount[i][0]+" | "+hitCount[i][1]+" | "+rel[0]+rel[1]+rel[2]+rel[3]+rel[4]+"% |");
    }
    var rel = (totalHit/record.totalWords*100).toFixed(4).toString();
    console.log(" | Total | "+totalHit+" | "+rel[0]+rel[1]+rel[2]+rel[3]+rel[4]+"% |");
    console.log("\n | Total Words | "+record.totalWords+" |\n");
}























// start running
start();
