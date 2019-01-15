const MinHeap = require('./MinHeap');
const findParentInTree = require('./findParentInTree');

module.exports = function(alph) {

    // Generate Forest min-heap.
    var forest = new MinHeap();
    for(var i = 0; i < alph.length; i++) {
        forest.add([alph[i][2], alph[i][1]]);
    }

    // Generate the Tree.
    var tree = [];
    var newNodeNum = alph.length+1;
    var treeRootNum = '';
    for(;true;) {
        var least = forest.popMin();
        treeRootNum = least[0];
        if(forest.isEmpty()) {
            break;
        }
        var second = forest.popMin();
        tree.push([least[0], second[0], newNodeNum]);
        forest.add([newNodeNum, (parseFloat(least[1])+parseFloat(second[1])).toFixed(4)+'']);
        newNodeNum++;
    }

    // Generate Huffman Codes table using Tree and Alphabet table.
    var hct = [];
    for(var i = 0; i < alph.length; i++) {
        var target = alph[i][2];
        var huffmanCode = '';
        for(; target != treeRootNum;) {
            let result = findParentInTree(target, tree);
            target = result[0];
            huffmanCode = result[1] + huffmanCode;
        }
        hct.push([alph[i][0], huffmanCode]);
    }

    return hct;

}