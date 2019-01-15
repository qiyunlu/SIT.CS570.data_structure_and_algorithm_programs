const MaxHeap = require('./MaxHeap');

module.exports = function(str) {

    // Count Table records the times that each character appears in the string.
    var countTable = [];
    for(var i = 0; i < str.length; i++) {
        var notInCT = true;
        for(var j = 0; j < countTable.length; j++) {
            if(str[i] == countTable[j][0]) {
                countTable[j][1]++;
                notInCT = false;
                break;
            }
        }
        if(notInCT) {
            countTable.push([str[i], 1]);
        }
    }

    // Use Count Table to generate frequency max-heap.
    var frequencyMaxHeap = new MaxHeap();
    for(var i = 0; i < countTable.length; i++) {
        var freq = (countTable[i][1]/str.length).toFixed(4);
        frequencyMaxHeap.add([countTable[i][0], freq]);
    }

    return frequencyMaxHeap;

}