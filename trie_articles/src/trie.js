// trie class
module.exports = class Trie {

    constructor() {
        this.arr = [{
            value: null,
            parent: null,
            childA: [],
            pointer: null
        }];
    }

    insert(str, companyID) {
        // normalize the company name
        var filtered = "";
        var index = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for(var i = 0; i < str.length; i++) {
            if(index.indexOf(str[i]) != -1) {
                filtered += str[i];
            }
        }
        filtered = filtered.split(" ");
        for(var i = 0; i < filtered.length; i++) {
            // strip empty and articles in company name
            if(filtered[i] == "" ||
               filtered[i] == "a" ||
               filtered[i] == "an" ||
               filtered[i] == "the" ||
               filtered[i] == "and" ||
               filtered[i] == "or" ||
               filtered[i] == "but") {
                filtered.splice(i, 1);
                i--;
            }
        }
        // start insert
        var node = 0;
        for(var i = 0; i < filtered.length; i++) {
            var child = this.searchChild(node, filtered[i]);
            if(child != null) {
                node = child;
                continue;
            }
            // child == null
            this.arr.push({
                value: filtered[i],
                parent: node,
                childA: [],
                pointer: null
            });
            this.arr[node].childA.push(this.arr.length-1);
            node = this.arr.length-1;
        }
        this.arr[node].pointer = companyID;
        return;
    }

    searchChild(node, value) {
        var childA = this.arr[node].childA;
        for(var i = 0; i < childA.length; i++) {
            var v = this.arr[childA[i]].value;
            if(v == value) {
                return childA[i];
            }
        }
        return null;
    }

    countHit(str, record) {
        // normalize str
        var filtered = "";
        var index = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for(var i = 0; i < str.length; i++) {
            if(index.indexOf(str[i]) != -1) {
                filtered += str[i];
            }
        }
        filtered = filtered.split(" ");
        for(var i = 0; i < filtered.length; i++) {
            // strip empty and articles
            if(filtered[i] == "" ||
               filtered[i] == "a" ||
               filtered[i] == "an" ||
               filtered[i] == "the" ||
               filtered[i] == "and" ||
               filtered[i] == "or" ||
               filtered[i] == "but") {
                filtered.splice(i, 1);
                i--;
            }
        }
        record.totalWords += filtered.length;
        // start counting hit
        var spot = 0;
        var add = 0;
        var node = 0;
        for(;true;) {
            var child = this.searchChild(node, filtered[spot+add]);
            if(child != null) {
                node = child;
                add++;
            }
            else if(this.arr[node].pointer != null) {
                record.hitArray.push(this.arr[node].pointer);
                spot = spot+add;
                add = 0;
                node = 0;
            }
            else {
                spot++;
                add = 0;
                node = 0;
            }
            if(spot >= filtered.length) {
                break;
            }
        }
        return record;
    }







}