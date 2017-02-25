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

    this.table = {"0,25":1,"0,65":1,"2,13":1,"2,27":1,"2,41":1,"3,18":1,"3,41":1,"3,56":1,"3,76":1,"4,21":1,"4,23":1,"4,75":1,"4,77":1,"5,26":1,"5,39":1,"5,60":1,"5,76":1,"6,13":1,"6,35":1,"6,39":1,"8,19":1,"8,69":1,"10,32":1,"10,48":1,"11,50":1,"11,72":1,"13,2":1,"13,6":1,"13,47":1,"13,48":1,"13,50":1,"13,51":1,"15,48":1,"15,80":1,"16,30":1,"16,50":1,"18,3":1,"18,37":1,"18,49":1,"19,8":1,"19,50":1,"20,35":1,"20,75":1,"21,4":1,"21,43":1,"23,4":1,"23,37":1,"24,27":1,"24,77":1,"25,0":1,"25,48":1,"26,5":1,"26,43":1,"26,49":1,"27,2":1,"27,24":1,"27,44":1,"27,49":1,"29,36":1,"29,67":1,"30,16":1,"30,43":1,"30,61":1,"30,64":1,"30,67":1,"30,69":1,"31,45":1,"31,53":1,"31,54":1,"31,62":1,"32,10":1,"32,37":1,"32,55":1,"32,65":1,"32,67":1,"32,70":1,"33,44":1,"33,67":1,"35,6":1,"35,20":1,"35,36":1,"35,49":1,"36,29":1,"36,35":1,"36,47":1,"36,53":1,"37,18":1,"37,23":1,"37,32":1,"37,50":1,"37,54":1,"37,59":1,"39,5":1,"39,6":1,"39,77":1,"39,78":1,"41,2":1,"41,3":1,"41,74":1,"41,75":1,"43,21":1,"43,26":1,"43,30":1,"43,48":1,"43,57":1,"43,62":1,"44,27":1,"44,33":1,"44,45":1,"44,51":1,"45,31":1,"45,44":1,"45,60":1,"45,74":1,"47,13":1,"47,36":1,"48,10":1,"48,13":1,"48,15":1,"48,25":1,"48,43":1,"48,70":1,"49,18":1,"49,26":1,"49,27":1,"49,35":1,"50,11":1,"50,13":1,"50,16":1,"50,19":1,"50,37":1,"50,64":1,"51,13":1,"51,44":1,"53,31":1,"53,36":1,"53,56":1,"53,78":1,"54,31":1,"54,37":1,"54,75":1,"55,32":1,"55,80":1,"56,3":1,"56,53":1,"57,43":1,"57,76":1,"59,37":1,"59,76":1,"60,5":1,"60,45":1,"61,30":1,"61,72":1,"62,31":1,"62,43":1,"62,77":1,"64,30":1,"64,50":1,"65,0":1,"65,32":1,"67,29":1,"67,30":1,"67,32":1,"67,33":1,"67,74":1,"67,78":1,"69,8":1,"69,30":1,"70,32":1,"70,48":1,"72,11":1,"72,61":1,"74,41":1,"74,45":1,"74,67":1,"75,4":1,"75,20":1,"75,41":1,"75,54":1,"76,3":1,"76,5":1,"76,57":1,"76,59":1,"77,4":1,"77,24":1,"77,39":1,"77,62":1,"78,39":1,"78,53":1,"78,67":1,"80,15":1,"80,55":1};

    this.quickscore = function(queens, maxPlayer){
        if (this.boardSize == 9 && queens.length == 2 && !maxPlayer){
            if (queens in this.table && this.lastWin){
                return 1;
            }
            else if (!(queens in this.table) && this.lastWin){
                return -1;
            }
            else if (!(queens in this.table) && !this.lastWin){
                return 1;
            }
            else if ((queens in this.table) && !this.lastWin){
                return -1;
            }
        }
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
