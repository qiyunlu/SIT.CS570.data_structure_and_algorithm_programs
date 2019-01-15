module.exports = class Calculator {
    constructor() {
        this.priority = {
            "+" : 1,
            "-" : 1,
            "*" : 2,
            "/" : 2,
            "%" : 2,
            "^" : 3,
        }
    }

    // input string to infix queue
    string2Infix(ques) {
        var inQ = [];
        var spot = 0;

        for(let i = 0; i < ques.length; i++) {
            if(ques[i] == " ") {}
            else if(ques[i]=='+'||ques[i]=='-'||ques[i]=='*'||ques[i]=='/'||
                    ques[i]=='%'||ques[i]=='^'||ques[i]=='('||ques[i]==')') {
                inQ.push(ques[i]);
                spot++;
                if(inQ[spot] != undefined) {
                    spot++;
                }
            } else {
                if(inQ[spot] == undefined) {
                    inQ[spot] = "";
                }
                inQ[spot] += ques[i];
            }
        }

        return inQ;
    }

    // infix queue to postfix queue
    infix2Postfix(infixQ) {
        var postfixQ = [];
        var opStack = [];
        var t;

        while(infixQ.length != 0) {
            t = infixQ[0];
            infixQ.shift();

            if(!(t=='+'||t=='-'||t=='*'||t=='/'||
                 t=='%'||t=='^'||t=='('||t==')')) {
                postfixQ.push(t);
            }
            else if(opStack.length == 0) {
                opStack.push(t);
            }
            else if(t == "(") {
                opStack.push(t);
            }
            else if(t == ")") {
                while(opStack[opStack.length-1] != "(") {
                    postfixQ.push(opStack.pop());
                }
                opStack.pop();
            }
            else {
                while(opStack.length != 0 && opStack[opStack.length-1] != "(" &&
                      this.priority[t] <= this.priority[opStack[opStack.length-1]]) {
                    postfixQ.push(opStack.pop());
                }
                opStack.push(t);
            }
        }
        while(!(opStack.length == 0)) {
            postfixQ.push(opStack.pop());
        }

        return postfixQ;
    }

    // calculate postfix queue
    calculatePostfix(postfixQ) {
        var evStack = [];
        var t, topNum, nextNum, answer;

        while(postfixQ.length != 0) {
            t = postfixQ[0];
            postfixQ.shift();
            if(!(t=='+'||t=='-'||t=='*'||t=='/'||
                 t=='%'||t=='^'||t=='('||t==')')) {
                evStack.push(t);
            }
            else {
                topNum = evStack.pop();
                nextNum = evStack.pop();
                switch(t) {
                    case '+': answer = Number(nextNum) + Number(topNum);
                              break;
                    case '-': answer = Number(nextNum) - Number(topNum);
                              break;
                    case '*': answer = Number(nextNum) * Number(topNum);
                              break;
                    case '/': answer = Number(nextNum) / Number(topNum);
                              break;
                    case '%': answer = Number(nextNum) % Number(topNum);
                              break;
                    case '^': answer = Math.pow(Number(nextNum), Number(topNum));
                              break;
                }
                evStack.push(answer.toFixed(10));
            }
        }
        
        return evStack.pop();
    }

    // specific calculating processes
    calculate(question) {
        let infixQ = this.string2Infix(question);
        console.log(`\n Problem in infix is "${infixQ.join(" ")}"`);
        let postfixQ = this.infix2Postfix(infixQ);
        console.log(`\n Problem in postfix is "${postfixQ.join(" ")}"`);
        let answer = Number(this.calculatePostfix(postfixQ));
        console.log(`\n The answer is ${answer}\n\n\n`);
    }
}
