// This is Lu's Huffman Codes.

const fs = require('fs');

const generateFMH = require('./generateFMH');
const generateHCT = require('./generateHCT');
const MaxHeap = require('./MaxHeap');

// Read contents from 'infile.dat'.
var data = fs.readFileSync('./infile.dat').toString();

// Ignore all blanks, all punctuation marks, all special symbols.
var filtered = '';
var index = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
for(var i = 0; i < data.length; i++) {
    if(index.indexOf(data[i]) != -1) {
        filtered += data[i];
    }
}

// Generate frequency max-heap.
var fmh = generateFMH(filtered);

// Generate frequency table (also as Alphabet table) using max-heap.
var alphabet = [];
for(var i = 0; !fmh.isEmpty(); i++) {
    var max = fmh.popMax();
    alphabet[i] = [max[0], max[1], i];
}

// Generate Huffman Codes table using Alphabet table.
var hct = generateHCT(alphabet);

// Calculate total bits
var bitString = '';
for(var i = 0; i < filtered.length; i++) {
    target = filtered[i];
    for(var j = 0; j < hct.length; j++) {
        if(target == hct[j][0]) {
            bitString += hct[j][1];
            break;
        }
    }
}
var totalBits = bitString.length;

// Write all in outfile.dat.
fs.writeFileSync('./outfile.dat', ' Symbol  |  Frequency\n', {flag:'w'});
fs.writeFileSync('./outfile.dat', ' --------------------\n', {flag:'a'});
for(var i = 0; i < alphabet.length; i++) {
    let str = '    '+alphabet[i][0]+'    |   '+(parseFloat(alphabet[i][1])*100).toFixed(2)+'%\n';
    fs.writeFileSync('./outfile.dat', str, {flag:'a'});
}

fs.writeFileSync('./outfile.dat', '\n\n Symbol  |  Huffman Codes\n', {flag:'a'});
fs.writeFileSync('./outfile.dat', ' ------------------------\n', {flag:'a'});
for(var i = 0; i < hct.length; i++) {
    let str = '    '+hct[i][0]+'    |   '+hct[i][1]+'\n';
    fs.writeFileSync('./outfile.dat', str, {flag:'a'});
}

fs.writeFileSync('./outfile.dat', '\n\n Total Bits: '+totalBits+'\n', {flag:'a'});

