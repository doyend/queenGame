function shuffleArray(array)
{
    for (var i = array.length - 1; i > 0; i--)
    {
        var index = parseInt(Math.random() * (i + 1));
        var temp = array[index];
        array[index] = array[i];
        array[i] = temp;
    }
}

function Board(size){
    var lastQueenWin = document.getElementById("lastWin").checked;

    this.scoreCompute = new ScoreCompute(size, lastQueenWin);
    this.size = size;
    this.board = [];
    this.legal = this.scoreCompute.legalMoves(this.board);
    this.computerTurn = false;

    that = this;
    this.clickHandler =  function(e){
        var position = parseInt(this.id);
        if (!this.computerTurn && that.legal.indexOf(position) >= 0) {
            that.placeQueen(this, false);
            that.updateBoardStatus();
            if (that.legal.length == 0){
                if (that.scoreCompute.lastWin){
                that.showMessage(true);
                }
                else{
                that.showMessage(false);
                }
            }
            else{
                that.computerMove(false);
            }
        }
    };

    this.onMouseOverHandler = function(e){
        var position = parseInt(this.id);
        if (that.board.indexOf(position) >= 0) {
            return;
        }
        if (that.legal.indexOf(position) >= 0) {
           this.style.backgroundColor = "green";
        } else{
           this.style.backgroundColor = "red";
        }

    };

    this.onMouseOutHandler = function(e){
        var position = parseInt(this.id);
        var x = parseInt(position / that.size);
        var y = position - x * that.size;
        this.style.backgroundColor = parseInt(x % 2 + y) % 2 == 0 ? '#ababab' : 'white';
    };

    this.setup();

    if (!document.getElementById("firstMove").checked){
      that.computerMove(true);
    }

}

Board.prototype.getDiv = function(i){
    var root = document.getElementById("mainChessBoard");
    var children = root.children;
    return children[i];
}

Board.prototype.placeQueen = function(div, computer){
    if (computer){
           div.innerHTML="<img src='images/white.png'/>";
    }
    else{
           div.innerHTML="<img src='images/black.png'/>";
    }
}

Board.prototype.showMessage = function(win){
    div = document.getElementById("message");
    if (win){
        div.innerHTML="<img src='images/win.png'/>";

    }
    else{
        div.innerHTML="<img src='images/loss.png'/>";
    }
}

Board.prototype.updateBoardStatus = function(){
    this.board = [];
    var root = document.getElementById("mainChessBoard");
    var children = root.children;
    var length = children.length;
    for  (var i=0; i< length; i++){
        if (children[i].innerHTML != ""){
            this.board.push(parseInt(children[i].id));
        }
    }
    this.legal = this.scoreCompute.legalMoves(this.board);
}

Board.prototype.computerMove = function(random){
    if (!random){
        this.computerTurn = true;
        var length = this.legal.length;
        var best = -1000;
        var position = null;
        shuffleArray(this.legal);
        for(var i=0; i < length; i++){
            var pos = this.legal[i];
            this.board.push(pos);
            var score = this.scoreCompute.quickscore(this.board, false);
            if (score > best){
                best = score;
                position = pos;
            }
            this.board.pop();
        }
        this.placeQueen(this.getDiv(position), true);
        this.updateBoardStatus();
        this.computerTurn = false;
        if (this.legal.length == 0){
            if(this.scoreCompute.lastWin){
                this.showMessage(false);
            }
            else{
                this.showMessage(true);
            }
        }
    }
    else{
        this.computerTurn = true;
        var length = this.legal.length;
        var randomId = parseInt(Math.random() * length);
        position = this.legal[randomId];
        this.placeQueen(this.getDiv(position), true);
        this.updateBoardStatus();
        this.computerTurn = false;
        if (this.legal.length == 0){
            if(this.scoreCompute.lastWin){
                this.showMessage(false);
            }
            else{
                this.showMessage(true);
            }
        }
    }
}

Board.prototype.setup = function(){
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var pixel = Math.min(w, h)- 50;
    pixel = Math.min(pixel, 900);
    var boardDiv = document.getElementById("mainChessBoard");
    boardDiv.style.height = pixel+"px";
    boardDiv.style.width = pixel+"px";
    var boxSize = parseInt(pixel / this.size);
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
    }
    var messageDiv = document.getElementById("message");
    while (messageDiv.firstChild) {
        messageDiv.removeChild(messageDiv.firstChild);
    }
    for (var i=0; i< this.size * this.size; i++){
        var divEle = (document.createElement("div"));
        divEle.className += "box";
        var x = parseInt(i / this.size);
        var y = i - x * this.size;
        divEle.style.backgroundColor = parseInt(x % 2 + y) % 2 == 0 ? '#ababab' : 'white';
        divEle.style.height = boxSize+"px";
        divEle.style.width = boxSize+"px";
        divEle.id = i;
        divEle.addEventListener("click", this.clickHandler);
        divEle.addEventListener("mouseover", this.onMouseOverHandler);
        divEle.addEventListener("mouseout", this.onMouseOutHandler);
        boardDiv.appendChild(divEle);    
    }
}

//var boardSize = parseInt(document.getElementById("boardSize").value);
//var board = new Board(boardSize);
function restart(){
    var boardSize = parseInt(document.getElementById("boardSize").value);
    board = new Board(boardSize);
}
document.getElementById("button").addEventListener("click", restart);
restart();
