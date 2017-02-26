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
        function recover(div){
            var position = parseInt(div.id);
            var x = parseInt(position / that.size);
            var y = position - x * that.size;
            div.style.backgroundColor = parseInt(x % 2 + y) % 2 == 0 ? '#ababab' : 'white';
        }
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
        else if (!this.computerTurn){
            var queen = parseInt(this.id);
            var threatens = that.scoreCompute.threatenedBy(that.board, queen);
            var numThreatens = threatens.length;
            for(var k = 0; k < numThreatens; k++){
                var tDiv = that.getDiv(threatens[k]);
                tDiv.style.backgroundColor = "red";
                setTimeout(recover, 500, tDiv);
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
    var div = document.getElementById("message");
    var boardDiv = document.getElementById("mainChessBoard");
    if (win){
        div.innerHTML="<img src='images/win.png'/>";
        boardDiv.style.borderColor = "green";
    }
    else{
        div.innerHTML="<img src='images/loss.png'/>";
        boardDiv.style.borderColor = "red";
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
    boardDiv.style.borderColor = "black";
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
var board;
function restart(){
    var boardSize = parseInt(document.getElementById("boardSize").value);
    board = new Board(boardSize);
}

function showHint(){
    function recover(div){
        var position = parseInt(div.id);
        var x = parseInt(position / that.size);
        var y = position - x * that.size;
        div.style.backgroundColor = parseInt(x % 2 + y) % 2 == 0 ? '#ababab' : 'white';
    }
    var numLegals = board.legal.length;
    for(var k = 0; k < numLegals; k++){
        var tDiv = that.getDiv(board.legal[k]);
        tDiv.style.backgroundColor = "#00BFFF";
        setTimeout(recover, 1000, tDiv);
    }
}

function translate(){
    var spans = document.getElementsByTagName("span");
    spans[0].innerText = "黑皇后先手";
    spans[1].innerText = "最后一个皇后赢";
    spans[2].innerText = "棋盘大小";
    var div = document.getElementById("button").innerText = "重新玩";
    document.getElementById("hint").innerText = "提示";
    document.getElementById("instruction").innerText = "说明";
    var lis = document.getElementsByTagName("li");
    lis[0].innerText = "玩家依次在棋盘放下女皇";
    lis[1].innerText = "国际象棋女皇可以吃水平，垂直和对角线上的棋子";
    lis[2].innerText = "所有在棋盘上面都女皇都不能互相威胁";
    lis[3].innerText = "能放下最后一个女皇的玩家胜或者输，取决游戏设置";
    document.getElementsByTagName("h2")[0].innerText = "说明";
}

function popup(){
    var modal = document.getElementById('popup1');
    modal.style.display = "block";
}

function closePopup(){
    var modal = document.getElementById('popup1');
    modal.style.display = "none";
}
document.getElementById("button").addEventListener("click", restart);
document.getElementById("hint").addEventListener("click", showHint);
restart();
