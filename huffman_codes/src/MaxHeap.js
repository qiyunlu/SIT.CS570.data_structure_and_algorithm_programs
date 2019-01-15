module.exports = class MaxHeap {

    constructor() {
        this.arr = [['arr[0] is not used', 0]];
        this.lastNodeSpace = 0;
    }

    isEmpty() {
        if(this.arr.length > 1) {
            return false;
        }
        else {
            return true;
        }
    }

    add(value) {
        this.lastNodeSpace++;
        this.arr[this.lastNodeSpace] = value;
        this.addFix(this.lastNodeSpace);
    }

    // Pop the tree root.
    popMax() {
        var maxNode = this.arr[1];
        this.arr[1] = this.arr[this.lastNodeSpace];
        this.arr.splice(this.lastNodeSpace, 1);
        this.lastNodeSpace--;
        if(this.lastNodeSpace > 1) {
            this.popFix(1);
        }
        return maxNode;
    }

    // To make the arr[nodeNum] in a right place after add action.
    addFix(nodeNum) {
        var num = nodeNum;
        for(; this.arr[num][1] > this.arr[parseInt(num/2)][1];) {
            if(num == 1) {
                break;
            }
            let reverse = this.arr[parseInt(num/2)];
            this.arr[parseInt(num/2)] = this.arr[num];
            this.arr[num] = reverse;
            num = parseInt(num/2);
        }
    }

    // To make the arr[nodeNum] in a right place after pop action.
    popFix(nodeNum) {
        var num = nodeNum;
        if(this.arr[num*2] == undefined && this.arr[num*2+1] == undefined) {}
        else if(this.arr[num*2] != undefined && this.arr[num*2+1] == undefined) {
            if(this.arr[num*2][1] > this.arr[num][1]) {
                let reverse = this.arr[num*2];
                this.arr[num*2] = this.arr[num];
                this.arr[num] = reverse;
                this.popFix(num*2);
            }
        }
        else if(this.arr[num*2] == undefined && this.arr[num*2+1] != undefined) {
            if(this.arr[num*2+1][1] > this.arr[num][1]) {
                let reverse = this.arr[num*2+1];
                this.arr[num*2+1] = this.arr[num];
                this.arr[num] = reverse;
                this.popFix(num*2+1);
            }
        }
        else {
            if(this.arr[num*2][1] > this.arr[num][1]) {
                if(this.arr[num*2][1] > this.arr[num*2+1][1]) {
                    let reverse = this.arr[num*2];
                    this.arr[num*2] = this.arr[num];
                    this.arr[num] = reverse;
                    this.popFix(num*2);
                }
                else {
                    let reverse = this.arr[num*2+1];
                    this.arr[num*2+1] = this.arr[num];
                    this.arr[num] = reverse;
                    this.popFix(num*2+1);
                }
            }
            else if(this.arr[num*2+1][1] > this.arr[num][1]) {
                let reverse = this.arr[num*2+1];
                this.arr[num*2+1] = this.arr[num];
                this.arr[num] = reverse;
                this.popFix(num*2+1);
            }
        }
    }

    // Return a copy of the max-heap.
    copy() {
        var copyMH = new MaxHeap();
        for(var i = 0; i < this.arr.length; i++) {
            copyMH.arr[i] = [this.arr[i][0], this.arr[i][1]];
        }
        copyMH.lastNodeSpace = this.lastNodeSpace;
        return copyMH;
    }

}