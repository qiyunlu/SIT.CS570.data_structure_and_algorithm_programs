// this is Lu's Reverse Polish Notation Calculator
const async = require('async');
const readline = require('readline');

const Calculator = require('./rpnCalculator.js');

var input = "";

// loop
async.whilst(
    function() {
        return true;
    },
    function(callback) {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('\n Please input an infix math problem.\n Support "+", "-", "*", "/", "%", "^" operators and parenthesis.\n Or imput "quit" to quit.\n\n ', (input) => {
            rl.close();
            if(input == "quit") {
                callback(true);
            } else {
                let calculator = new Calculator();
                calculator.calculate(input);
                callback(null);
            }
        });
    },
    function(err) {
        console.log("\n Quit RPN Calculator.\n");
        return 0;
    }
);
