/* place the content at center */

adjustWidth();

window.onresize = function(e) {
    setTimeout(adjustWidth, 500);
}

/*---------------x---------------*/

function adjustWidth() {

    let winWidth = window.innerWidth;
    let tictactoeWidth = document.getElementById("tic-tac-toe").offsetWidth;
    let reqWidth = (winWidth - tictactoeWidth) / 2;
    document.getElementById("tic-tac-toe").style.left = reqWidth + "px";
    
    let winHeight = window.innerHeight;
    let tictactoeHeight = document.getElementById("tic-tac-toe").offsetHeight;
    let reqHeight = (winHeight - tictactoeHeight) / 2;
    if(reqHeight < 0) reqHeight = 0;
    document.getElementById("tic-tac-toe").style.top = reqHeight + "px";
}

var ph = 'O';
var pb = 'X';

var restart = false;

/* terminal states */

const tStates = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");

cells.forEach(elt => elt.onclick = function() {
    if(!(hasClass("#ph", 'active') || hasClass("#pb", 'active'))) {
        addClass("#span-text", 'show');
        addClass("#who-first", 'error-msg');
    }
});

var board = Array.from(Array(9).keys());

function getEmptyCells () {
    return board.filter(c => typeof c == 'number');
}

function checkWin(b, p) {
    let plays = b.reduce((a, e, i) => (e === p) ? a.concat(i): a, []);
	for (let [index, win] of tStates.entries()) {
		if (win.every(elt => plays.indexOf(elt) > -1)) {
			return true;
		}
	}
	return false;
}

function minimax(b, p) {
    
    let ec = getEmptyCells();
    
    if(checkWin(b, ph)) return {score: -10};
    else if(checkWin(b, pb)) return {score: 10};
    else if(ec.length === 0) return {score: 0};
    
    let moves = [];
    
    for(let i = 0; i < ec.length; i++) {
        let move = {};
        move.index = b[ec[i]];
        b[ec[i]] = p;
        
        if(p === pb) {
            let result = minimax(b, ph);
            move.score = result.score;
        } else {
            let result = minimax(b, pb);
            move.score = result.score;
        }
        
        b[ec[i]] = move.index;
        
        moves.push(move);
    }
    
    let bestmove;
    
    if(p === pb) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestmove = i;
            }
        }
        
    } else {
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestmove = i;
            }
        }
    }
    
    return moves[bestmove];
    
}

function findBestMove(fturn) {
    if(fturn) {
        let cellIndex = Math.floor(Math.random() * 9);
        return cellIndex;
    } else {
        return minimax(board, pb).index;
    }
}

function play(cellIndex, p) {
    
    let cellId = "#cell-" + cellIndex;

    addClass(cellId, "active");
    addClass(cellId + " div.content", "active");
    if(p === pb) addClass(cellId + " div.content", "activeb");
    document.querySelector(cellId + " div.content").innerHTML = p;
    document.querySelector(cellId).removeEventListener('click', s, false);
    board[cellIndex] = p;
    
}
    
function declareResult() {
    
    let p = null;
    
    if (checkWin(board, pb)) {
        p = pb;
    } else if (checkWin(board, ph)) {
        p = ph;
    }
    
    let text = null;
    
    if(p === pb) {
    
        let plays = board.reduce((a, e, i) => (e === p) ? a.concat(i): a, []);
        for (let [index, win] of tStates.entries()) {
            if (win.every(elt => plays.indexOf(elt) > -1)) {
                win.forEach(elt => {
                    addClass("#cell-" + elt, "win-moves");
                });
            }
        }
        text = 'I Won!!;)';
        
    } else {
        text = "It's a Draw!!";
    }
    setTimeout(function () {
        addClass("#bot", "over");
        document.getElementById("show-result").innerHTML = text;
    }, 500);
    
}

function isGameOver() {
    if(checkWin(board, ph)) console.log("human wins!!");
    else if(checkWin(board, pb)) console.log("bot wins!!");
    else if(getEmptyCells().length === 0) console.log("draww!!");
    return (checkWin(board, ph) || checkWin(board, pb) || getEmptyCells().length === 0);
}

function hasClass(selector, classname) {
    
    var elt = document.querySelector(selector);
    //cNames containes class names
    var cNames = elt.className.split(" ");
    if (cNames.indexOf(classname) < 0) {
        return false;
    }
    return true;
    
}

function addClass(selector, classname) {
    
    var elt = document.querySelector(selector);
    //cNames containes class names
    var cNames = elt.className.split(" ");
    if (cNames.indexOf(classname) < 0) {
        elt.className += " " + classname;
    }
}

function removeClass(selector, classname) {
    
    var elt = document.querySelector(selector);
    var reg = new RegExp('(^| )'+classname+'($| )', 'g');
    
    elt.className = elt.className.replace(reg, " ").trim();
}

function over() {
    
    board = Array.from(Array(9).keys());
    
    cells.forEach(elt => {
        
        let cellId = "#" + elt.id;
        
        if(!hasClass(cellId, "active")) {
            document.getElementById(elt.id).removeEventListener('click', s, false);
        }
        
    });
}

function startOver() {
    
    if(hasClass("#bot", "over")) {
        removeClass("#bot", "over");
        document.getElementById("show-result").innerHTML = "";
    }
    
    if(hasClass("#bot", "thinking")) {
        removeClass(".bot-thinking", "thinking");
        removeClass("#bot", "thinking");
    }
    
    //reset the "who'll start?" section
    
    if(hasClass("#span-text", 'show')) {
        removeClass("#span-text", 'show');
    } else {
    
        if(hasClass("#ph", 'active')) {
            removeClass("#ph", 'active');
            removeClass("#pb", 'inactive');
        }

        if(hasClass("#pb", 'active')) {
            removeClass("#pb", 'active');
            removeClass("#ph", 'inactive');
        }
    }
    
    //reset board
    
    board = Array.from(Array(9).keys());
    
    //reset each cell
    
    cells.forEach(elt => {
        
        let cellId = "#" + elt.id;
        
        if(hasClass(cellId, "active")) {
            
            removeClass(cellId, "active");
            removeClass(cellId + " div.content", "active");
            
            if(hasClass(cellId + " div.content", "activeb")) {
                document.querySelector(cellId + " div.content").innerHTML = 'O';
                removeClass(cellId + " div.content", "activeb");
            }
            
            if(hasClass(cellId, "win-moves")) {
                removeClass(cellId, "win-moves");
            }
            
        } else {
            document.getElementById(elt.id).removeEventListener('click', s, false);
        }
        
    });
}

function start() {
    
    for(let cell of cells) { cell.addEventListener('click', s, false); }
    
}

function s(e) {
        
    if(isGameOver()) {
        declareResult();
        over();
        return;
    }
    
    let ci = this.id.charAt(5);
    play(ci, ph);
    
    if(!isGameOver()) {
        
        setTimeout(function() {
            
            addClass("#bot", "thinking");

            setTimeout(function() {
                addClass(".bot-thinking", "thinking");
            }, 100);
            
        }, 500);

        setTimeout(function() {

            if(hasClass("#bot", "thinking")) {
            
                removeClass(".bot-thinking", "thinking");

                setTimeout(function() {
                    removeClass("#bot", "thinking");
                }, 100);

                if(isGameOver()) {
                    declareResult();
                    over();
                    return;
                }

                let c = findBestMove(false);
                play(c, pb);

                if(isGameOver()) {
                    declareResult();
                    over();
                    return;
                }
                
            }

        }, 2500);
        
    } else {
        declareResult();
        over();
        return;
    }

}

document.getElementById("ph").onclick = function (e) {
    
    let eltId = "#ph";
    
    if(hasClass("#span-text", 'show')) {
        removeClass("#span-text", 'show');
    }
    
    if(!hasClass(eltId, 'active') && !hasClass(eltId, 'inactive')) {
        addClass(eltId, 'active');
        addClass("#pb", 'inactive');
        
        start();
        
    } else {
        e.preventDefault();
    }
}

document.getElementById("pb").onclick = function (e) {
    
    let eltId = "#pb";
    
    if(hasClass("#span-text", 'show')) {
        removeClass("#span-text", 'show');
    }
    
    if(!hasClass(eltId, 'active') && !hasClass(eltId, 'inactive')) {
        
        start();
        
        addClass(eltId, 'active');
        addClass("#ph", 'inactive');
        
        addClass("#bot", "thinking");

        setTimeout(function() {
            addClass(".bot-thinking", "thinking");
        }, 100);

        setTimeout(function() {
            
            if(hasClass("#bot", "thinking")) {

                removeClass(".bot-thinking", "thinking");

                setTimeout(function() {
                    removeClass("#bot", "thinking");
                }, 100);

                let c = findBestMove(true);
                play(c, pb);
            }

        }, 2000);
        
    } else {
        e.preventDefault();
    }
}

document.getElementById("btnStartOver").onclick = function (e) {
    startOver();
}