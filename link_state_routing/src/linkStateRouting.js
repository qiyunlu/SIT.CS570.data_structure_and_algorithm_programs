// this is Lu's link state routing
const fs = require('fs');
const async = require('async');
const readline = require('readline');

const LSP = require('./LSP');
const dijkstra = require('./dijkstra');

// a list to hold all routers
var rList = [];

// Router class
class Router {

    constructor(id, networkName, linkedRouter) {
        this.id = id;
        this.networkName = networkName;
        this.backup = {id: id, table: linkedRouter};

        this.routingTable = [JSON.parse(JSON.stringify(this.backup))];
        this.sequenceNumber = 1;
        this.packetHistory = [];
        this.state = "on";
    }

    startUp() {
        this.state = "on";
        for(var i = 0; i < this.routingTable[0].table.length; i++) {
            this.routingTable[0].table[i][1] = this.backup.table[i][1];
        }
    }

    shutDown() {
        this.state = "off";
        for(var i = 0; i < this.routingTable[0].table.length; i++) {
            this.routingTable[0].table[i][1] = -1;
        }
    }

    sendLSP(lsp, list) {
        var count = 0;
        async.whilst(
            function() {
                return count < list.length;
            },
            function(callback) {
                rList[list[count]].receivePacket(lsp);
                count++;
                callback(null);
            },
            function (err) {}
        );
    }

    receivePacket(lsp) {
        if(this.state == "off") {
            return;
        }
        lsp.TTL--;
        // discard LSP
        if(lsp.TTL <= 0 || (this.packetHistory[lsp.id] != undefined && this.packetHistory[lsp.id] >= lsp.sequenceNumber)) {
            return;
        }
        // update packet history
        this.packetHistory[lsp.id] = lsp.sequenceNumber;
        // not discarded
        this.routingTable = this.combineRoutingTable(this.routingTable, lsp.routingTable);
        // send LSP
        var list = [];
        for(var i = 0; i < this.backup.table.length; i++) {
            if(this.backup.table[i][0] != lsp.currentFrom) {
                list.push(this.backup.table[i][0]);
            }
        }
        lsp.currentFrom = this.id;
        this.sendLSP(lsp, list);
    }

    originatePacket() {
        if(this.state == "off") {
            return;
        }
        var list = [];
        for(var i = 0; i < this.backup.table.length; i++) {
            list.push(this.backup.table[i][0]);
        }
        var tick = {id: this.id, turn: 1, value: -1};
        this.sendTick(tick, list);
        var lsp = new LSP(this.id, this.sequenceNumber, [this.routingTable[0]]);
        this.sequenceNumber++;
        this.sendLSP(lsp, list);
    }

    sendTick(tick, list) {
        var count = 0;
        async.whilst(
            function() {
                return count < list.length;
            },
            function(callback) {
                rList[list[count]].receiveTick(tick);
                count++;
                callback(null);
            },
            function (err) {}
        );
    }

    receiveTick(tick) {
        if(this.state == "off") {
            rList[tick.id].routingTable = this.setCost(rList[tick.id].routingTable, this.id, tick.id, -1);
            rList[tick.id].routingTable = this.setCost(rList[tick.id].routingTable, tick.id, this.id, -1);
        }
        else if(this.state == "on") {
            var _get = this.getCost(this.routingTable, this.id, tick.id);
            if(_get < 0) {
                return;
            }
            rList[tick.id].routingTable = this.setCost(rList[tick.id].routingTable, this.id, tick.id, _get);
            rList[tick.id].routingTable = this.setCost(rList[tick.id].routingTable, tick.id, this.id, _get);
        }
    }

    combineRoutingTable(baseT, addT) {
        for(var i = 0; i < addT.length; i++) {
            for(var j = 0; j < addT[i].table.length; j++) {
                baseT = this.setCost(baseT, addT[i].id, addT[i].table[j][0], addT[i].table[j][1]);
                baseT = this.setCost(baseT, addT[i].table[j][0], addT[i].id, addT[i].table[j][1]);
            }
        }
        return baseT;
    }

    getCost(table, from, to) {
        for(var i = 0; i < table.length; i++) {
            if(table[i].id == from) {
                for(var j = 0; j < table[i].table.length; j++) {
                    if(table[i].table[j][0] == to) {
                        return table[i].table[j][1];
                    }
                }
                return -1;
            }
        }
        return -1;
    }

    setCost(table, from, to, value) {
        for(var i = 0; i < table.length; i++) {
            if(table[i].id == from) {
                for(var j = 0; j < table[i].table.length; j++) {
                    if(table[i].table[j][0] == to) {
                        table[i].table[j][1] = value;
                        return table;
                    }
                }
                table[i].table.push([to, value]);
                return table;
            }
        }
        table.push({id: from, table: [[to, value]]});
        return table;
    }

    printTable() {
        var result = dijkstra(this.id, this.routingTable);

        console.log("\n   network    |    outgoing link");
        for(var i = 0; i < result.length; i++) {
            if(rList[result[i][0]].state == "off") {
                console.log("\n  "+rList[result[i][0]].networkName+"  |    Not reachable");
                continue;
            }
            console.log("\n  "+rList[result[i][0]].networkName+"  |     "+rList[result[i][1]].networkName);
        }
        console.log("\n");
    }

}




// start from here

// read from infile.dat
var data = fs.readFileSync("./infile.dat", "utf-8");
var _r = {id: null, networkName: null, linkedRouter: []};
// seperate lines
data = data.split("\n");
for(var i = 0; i < data.length; i++) {
    // get rid of empty line
    if(data[i] == "") {
        data.splice(i, 1);
        i--;
    }
    else {
        data[i] = data[i].split("\t");
        var _d = "";
        for(var j = 0; j < data[i].length; j++) {
            _d = _d + data[i][j] + " ";
        }
        data[i] = _d.split(" ");
        // router id and network name
        if(data[i][0] != "") {
            for(var j = 0; j < data[i].length; j++) {
                if(data[i][j] == "") {
                    data[i].splice(j, 1);
                    j--;
                }
            }
            _r.id = +data[i][0];
            _r.networkName = data[i][1]+"";
        }
        // directly linked router
        else {
            for(var j = 0; j < data[i].length; j++) {
                if(data[i][j] == "") {
                    data[i].splice(j, 1);
                    j--;
                }
            }
            if(data[i].length == 2) {
                _r.linkedRouter.push([+data[i][0], +data[i][1]]);
            }
            else {
                _r.linkedRouter.push([+data[i][0], 1]);
            }
            // generate a new router
            if(data[i+1] == undefined || data[i+1][0] != " ") {
                rList[_r.id] = new Router(_r.id, _r.networkName, _r.linkedRouter);
                _r = {id: null, networkName: null, linkedRouter: []};
            }
        }
    }
}

// read input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt('Input> ');
rl.prompt();
rl.on('line', function(line) {
    
    line = line.split("\t");
    var _l = "";
    for(var i = 0; i < line.length; i++) {
        _l = _l + line[i] + " ";
    }
    line = _l.split(" ");
    for(var i = 0; i < line.length; i++) {
        if(line[i] == "") {
            line.splice(i, 1);
            i--;
        }
    }
    
    // continue
    if(line[0] == "C" && line.length == 1) {
        for(var i = 0; i < rList.length; i++) {
            if(rList[i] != undefined) {
                rList[i].originatePacket();
            }
        }
        rl.prompt();
    }
    // shut down a router
    else if(line[0] == "S" && line.length == 2) {
        if(rList[line[1]] != undefined) {
            rList[line[1]].shutDown();
        }
        rl.prompt();
    }
    // start up a router
    else if(line[0] == "T" && line.length == 2) {
        if(rList[line[1]] != undefined) {
            rList[line[1]].startUp();
        }
        rl.prompt();
    }
    // display the routing table
    else if(line[0] == "P" && line.length == 2) {
        if(rList[line[1]] != undefined) {
            rList[line[1]].printTable();
        }
        rl.prompt();
    }
    // quit
    else if(line[0] == "Q" && line.length == 1) {
        rl.close();
    }
    else {
        console.log("Command Error!");
        rl.prompt();
    }

});

rl.on('close', function() {
    return;
});
