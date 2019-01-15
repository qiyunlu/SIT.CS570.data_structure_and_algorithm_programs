module.exports = function(target, tree) {
    
    for(var i = 0; i < tree.length; i++) {
        if(tree[i][0] == target) {
            // Parent's left child.
            return [tree[i][2], '0'];
        }
        if(tree[i][1] == target) {
            // Parent's right child.
            return [tree[i][2], '1'];
        }
    }

}