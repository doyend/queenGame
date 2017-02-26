function ScoreCompute(boardSize, lastWin){
    this.boardSize = boardSize;
    this.lastWin = lastWin;
    that = this;

    this.legalMoves = function(queens){
        var total = queens.length;
        var toberemoved = new Set();
        for(var i = 0 ; i < total; i++){
            var queen = queens[i];
            var x = Math.floor(queen/this.boardSize);
            var y = queen - x * this.boardSize;
            var c0 = y - x;
            var c1 = y + x;
            var beg0 = Math.max(0, -c0);
            var beg1 = Math.max(0, c1 - this.boardSize + 1);
            var end0 = Math.min(this.boardSize - c0, this.boardSize);
            var end1 = Math.min(this.boardSize, c1 + 1);
            for ( var j = 0 ; j < this.boardSize; j++){
                toberemoved.add(x * this.boardSize + j );
                toberemoved.add(j * this.boardSize + y );
            }
            for ( var j = beg0; j < end0; j++){
                toberemoved.add(j * this.boardSize + j + c0);
            }
            for ( var j = beg1; j < end1; j++){
                toberemoved.add(j * this.boardSize - j + c1);
            }
        } 
        var output = [];
        total = this.boardSize * this.boardSize;
        for(var i = 0 ; i < total; i++) {
            if (!toberemoved.has(i)){
                output.push(i);
            }
        }
        return output;
    }


    function print(queens){
        var str = '';
        for(var i = 0; i < that.boardSize ; i++){
            str += " |"
            for(var j = 0; j < that.boardSize; j++){
                var q = i * that.boardSize + j;
                if (queens.indexOf(q) >= 0){
                    str += "Q|";
                }
                else{
                    str += ".|";
                }

            }
            str += "\n";
        }
        console.log(str);
    }

    this.table9 = {"9,5":1,"12,5":1,"18,5":1,"24,5":1,"27,5":1,"30,5":1,"33,5":1,"36,5":1,"39,5":1,"42,5":1,"48,5":1,"51,5":1,"54,5":1,"57,5":1,"60,5":1,"63,5":1,"66,5":1,"69,5":1,"72,5":1,"75,5":1,"78,5":1};
    this.table10 = {"12,5":1,"18,5":1,"21,5":1,"24,5":1,"30,5":1,"33,5":1,"36,5":1,"39,5":1,"42,5":1,"48,5":1,"51,5":1,"54,5":1,"57,5":1,"60,5":1,"63,5":1,"66,5":1,"69,5":1,"72,5":1,"78,5":1,"81,5":1,"84,5":1,"87,5":1,"90,5":1,"93,5":1,"96,5":1,"99,5":1};
}

ScoreCompute.prototype.quickscore = function(queens, maxPlayer){
        if (this.boardSize == 9 && queens.length == 2 && !maxPlayer){
            if (queens in this.table9 && this.lastWin){
                return 1;
            }
            else if (!(queens in this.table9) && this.lastWin){
                return -1;
            }
            else if (!(queens in this.table9) && !this.lastWin){
                return 1;
            }
            else if ((queens in this.table9) && !this.lastWin){
                return -1;
            }
        }
        else if (this.boardSize == 10 && queens.length == 2 && !maxPlayer){
            if (queens in this.table10 && this.lastWin){
                return 1;
            }
            else if (!(queens in this.table10) && this.lastWin){
                return -1;
            }
            else if (!(queens in this.table10) && !this.lastWin){
                return 1;
            }
            else if ((queens in this.table10) && !this.lastWin){
                return -1;
            }
        }


        var legals = this.legalMoves(queens);
        return this.score2(legals, -1, maxPlayer);
}

ScoreCompute.prototype.threatenedBy = function(board, queen){
    var output = [];
    var total = board.length;

    var x = Math.floor(queen/this.boardSize);
    var y = queen - x * this.boardSize;
    var c0 = y - x;
    var c1 = y + x;
    for(var i = 0 ; i < total; i++) {
        var potential = board[i];
        var pX = Math.floor(potential/this.boardSize);
        var pY = potential - pX * this.boardSize;
        if ( pX == x ){
            output.push(potential);
            continue;
        } 
        if ( pY == y ){
            output.push(potential);
            continue;
        }
        if (pY - pX == c0){
            output.push(potential);
            continue;
        }
        if (pX + pY == c1) {
            output.push(potential);
            continue;
        }
    }
    return output;
}



ScoreCompute.prototype.legalMoves2 = function(oldLegals, queen){
    var output = [];
    var total = oldLegals.length;
    if (queen >= 0){
        var x = Math.floor(queen/this.boardSize);
        var y = queen - x * this.boardSize;
        var c0 = y - x;
        var c1 = y + x;
        for(var i = 0 ; i < total; i++) {
            var potential = oldLegals[i];
            var pX = Math.floor(potential/this.boardSize);
            var pY = potential - pX * this.boardSize;
            if ( pX == x ) continue; //removed, same line
            if ( pY == y ) continue; //removed, same line
            if (pY - pX == c0) continue; // same digonal
            if (pX + pY == c1) continue; // same digonal
            output.push(potential);
        }
    }
    else{
        for(var i = 0 ; i < total; i++) {
            var potential = oldLegals[i];
            output.push(potential);
        }
    }
    return output;
}


ScoreCompute.prototype.score2 = function(oldLegals, queen, maxPlayer){
    var legals = this.legalMoves2(oldLegals, queen);
    var total = legals.length;
    if (total == 0){
        if (maxPlayer){
            if (this.lastWin)
                return -1;
            else
                return 1;
        }
        else{
            if (this.lastWin)
                return 1;
            else
                return -1;
        }
    }
    if (maxPlayer){
        var best = -10000;
        for( var i = 0 ; i < total ; i++){
            queen = legals[i];
            //queens.push(queen);
            var v = this.score2(legals, queen, false);
            //queens.pop();
            best = Math.max(best, v);
        }
        return best;
    }
    else{
        var best = 10000;
        for( var i = 0 ; i < total ; i++){
            queen = legals[i];
            //queens.push(queen);
            var v = this.score2(legals, queen, true);
            //queens.pop();
            best = Math.min(best, v);
        }
        return best;
    }
}
//exports.ScoreCompute =ScoreCompute;
