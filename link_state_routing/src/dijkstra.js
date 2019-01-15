module.exports = function(id, table) {

    var arr = [];
    var S = [];
    var Q = [];

    for(var i = 0; i < table.length; i++) {
        arr[i] = [];
        for(var j = 0; j < table.length; j++) {
            arr[i][j] = [-1, 0];
        }
    }

    for(var i = 0; i < table.length; i++) {
        var _id = table[i].id;
        var _tb = table[i].table;
        for(var j = 0; j < _tb.length; j++) {
            arr[_id][_tb[j][0]] = [1, 0];
            arr[_tb[j][0]][_id] = [1, 0];
        }
    }

    S.push(id);
    Q.push(id);

    var v = -1;
    var w = -1;
    while(Q[0] != undefined) {
        v = Q[0];
        var deleteV = true;
        for(var i = 0; i < arr[v].length; i++) {
            if(arr[v][i][0] == 1 && arr[v][i][1] == 0) {
                w = i;
                deleteV = false;
                break;
            }
        }

        if(deleteV) {
            Q.shift();
        }
        else {
            arr[v][w] = [1, 1];
            arr[w][v] = [1, 1];

            var inS = false;
            for(var i = 0; i < S.length; i++) {
                if(S[i] == w) {
                    inS = true;
                    break;
                }
            }
            if(!inS) {
                S.push(w);
                Q.push(w);
            }
        }
    }

    var result = [];
    var number = -1;
    for(var i = 0; i < table.length; i++) {
        if(table[i].id == id) {
            number = table[i].table.length;
        }
    }
    for(var i = 0; i < table.length; i++) {
        var _id = table[i].id;
        if(_id != id) {
            var bingo = false;
            for(var j = 1; j <= number; j++) {
                if(_id == S[j]) {
                    result.push([_id, S[j]]);
                    bingo = true;
                    break;
                }
            }
            if(!bingo) {
                result.push([_id, S[_id%number+1]]);
            }
        }
    }

    return result;
}