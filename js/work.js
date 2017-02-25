function ScoreCompute(boardSize, lastWin){
    this.boardSize = boardSize;
    this.lastWin = lastWin;

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

    function legalMoves2(oldLegals, queen){
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

    function print(queens){
        var str = '';
        for(var i = 0; i < this.boardSize ; i++){
            str += " |"
            for(var j = 0; j < this.boardSize; j++){
                var q = i * this.boardSize + j;
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

    this.quickscore = function(queens, maxPlayer){
        var legals = this.legalMoves(queens);
        return score2(legals, -1, maxPlayer);
    }

    function score2(oldLegals, queen, maxPlayer){
        var legals = legalMoves2(oldLegals, queen);
        var total = legals.length;
        if (total == 0){
            if (maxPlayer){
                if (lastWin)
                    return -1;
                else
                    return 1;
            }
            else{
                if (lastWin)
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
                var v = score2(legals, queen, false);
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
                var v = score2(legals, queen, true);
                //queens.pop();
                best = Math.min(best, v);
            }
            return best;
        }
    }
}
