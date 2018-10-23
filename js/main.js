var game = {
    width: 3,
    height: 3,
    amountOfPlayers: 2,
    playerTurn: 0,
    player: [
        {name: 'player 1', score: 0, ballsUsed: [] },
        {name: 'player 2',score: 0, ballsUsed: []}
    ],
    piece: {width: '150', height: '150'},
    poolBall: [
        {number: 0, color: 'white', value: 10},
        {number: 1, color: 'yellow', value: 1},
        {number: 2, color: 'blue', value: 1},
        {number: 3, color: 'red', value: 1},
        {number: 4, color: 'purple', value: 1},
        {number: 5, color: 'orange', value: 1},
        {number: 6, color: 'green', value: 1},
        {number: 7, color: 'maroon', value: 1},
        {number: 8, color: 'black', value: -10},
        {number: 9, color: 'yellow', value: 1},
        {number: 10, color: 'blue', value: 1},
        {number: 11, color: 'red', value: 1},
        {number: 12, color: 'purple', value: 1},
        {number: 13, color: 'orange', value: 1},
        {number: 14, color: 'green', value: 1},
        {number: 15, color: 'maroon', value: 1}
    ],
    gameover: false
}
/**
 * Action associated to 'Start Game 
 * Checks if gamespace exists before clearing field and inits game assets
 */
function startGame () {
    if( !document.getElementById('gameSpace') ) {
        document.getElementsByTagName('main')[0].innerHTML = '';

        initGameAssets();
    } else {
        location.reload();
    }
}

/**
 * Creates gamespace, inits player text and create playing field
 */
function initGameAssets() {
    var gameSpace = document.createElement('div');
    gameSpace.id = 'gameSpace';
    document.getElementsByTagName('main')[0].appendChild(gameSpace);

    initPlayerText();
    createPlayingField(); 
}

/**
 * Initializing variables related with information about player's name, score and turn
 */
function initPlayerText() {
    //Variable for player turn
    var playerTextTurnSpan  = document.createElement( 'span' );
    playerTextTurnSpan.appendChild(document.createTextNode(game.playerTurn));
    playerTextTurnSpan.id = 'playerTextTurnSpan';
    //Label for player turn
    var playerTextTurnParagraph  = document.createElement( 'p' );
    playerTextTurnParagraph.appendChild(document.createTextNode('Turn: player '));
    playerTextTurnParagraph.appendChild(playerTextTurnSpan);
    //Div with all player text
    var playerTextDivision = document.createElement('div');
    playerTextDivision.id = 'playerTextDivision';
    playerTextDivision.appendChild(playerTextTurnParagraph);

    for (var i = 0; i < game.amountOfPlayers; i++) {
        //Variable for player score
        var playerTextSpan  = document.createElement( 'span' );
        playerTextSpan.appendChild(document.createTextNode(game.player[i].score));
        playerTextSpan.id = 'playerText' + i;
        //Label for players name and score
        var playerTextParagraph  = document.createElement( 'p' );
        playerTextParagraph.appendChild(document.createTextNode('Player ' + i + ': '));
        playerTextParagraph.appendChild(playerTextSpan);
        playerTextParagraph.appendChild(document.createTextNode(' points'));
        
        playerTextDivision.appendChild(playerTextParagraph);
        playerTextDivision.style.float = 'right';
    }
    gameSpace.appendChild(playerTextDivision);
}
/**
 * Creates playing field and pieces
 */
function createPlayingField() {
    var playingField = document.createElement('div');
    playingField.id = 'playingField';
    createPieces(playingField);
    gameSpace.appendChild(playingField);
}

/**
 * Inits black and white balls locations and creates pieces
 * @param {HTMLElement} playingField 
 */
function createPieces( playingField ) {
    var blackX = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    var blackY = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    var whiteX = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    var whiteY = Math.floor(Math.random() * (2 - 0 + 1)) + 0;  

    while (blackX == whiteX && blackY == whiteY) {
        var whiteX = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        var whiteY = Math.floor(Math.random() * (2 - 0 + 1)) + 0;  
    }

    for (var i = 0; i < game.width; i++) 
        for (var j = 0; j < game.height; j++) 
            createPiece (playingField, i, j, blackX, blackY, whiteX, whiteY);
}
/**
 * Creates pieces based on coordinates and adds them to playing field
 * @param {HTMLElement} playingField 
 * @param {number} i 
 * @param {number} j 
 * @param {number} blackX 
 * @param {number} blackY 
 * @param {number} whiteX 
 * @param {number} whiteY 
 */
function createPiece (playingField, i, j, blackX, blackY, whiteX, whiteY) {
    var playingFieldPart = document.createElement('div');
    playingFieldPart.className = 'playingFieldPartClass';
    playingFieldPart.style.top = game.piece.height * i + 'px';
    playingFieldPart.style.left = game.piece.height * j + 'px';
    playingFieldPart.style.width = game.piece.height + 'px';
    playingFieldPart.style.height = game.piece.height + 'px';
    
    if ( i == whiteX && j == whiteY) {
        createWhiteBlackBall(playingFieldPart, 'White');
    } else if (i == blackX && j == blackY) {
        createWhiteBlackBall(playingFieldPart, 'Black');
    } else {
        playingFieldPart.ownedBy = 'blank';
    }

    playingFieldPart.addEventListener("click", function(e) {
        fieldPartAction(e);
    })

    playingField.appendChild(playingFieldPart);
}
/**
 * Creates white or black ball depending on color
 * @param {HTMLElement} playingFieldPart 
 * @param {String} backgroundColor 
 */
function createWhiteBlackBall(playingFieldPart,backgroundColor) {
    playingFieldPart.style['background-color'] = backgroundColor;
    playingFieldPart.ownedBy = game.playerTurn;
    playingFieldPart.id = backgroundColor;
}
/**
 * Actions based on piece selected
 * @param {EventListener} e 
 */
function fieldPartAction(e) {
    var fieldPiceSelected = e.target;
    if (game.gameover == false) {
        if (fieldPiceSelected.ownedBy == 'blank') {
            if (game.playerTurn == 0) {
                var pieceNumber = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
                while (game.player[game.playerTurn].ballsUsed.includes(pieceNumber)) {
                    pieceNumber = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
                }
                updatePlayingField(fieldPiceSelected, game.playerTurn, pieceNumber, game.poolBall[pieceNumber].color );  
                game.player[game.playerTurn].ballsUsed.push(pieceNumber);
                checkWinner();         
                game.playerTurn = 1 ;
            } else { 
                var pieceNumber = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
                while (game.player[game.playerTurn].ballsUsed.includes(pieceNumber)) {
                    pieceNumber = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
                }
                updatePlayingField(fieldPiceSelected, game.playerTurn, pieceNumber, 'repeating-linear-gradient( 0deg,#FFFFFF,#FFFFFF 40px,'+game.poolBall[pieceNumber].color+' 40px,'+game.poolBall[pieceNumber].color+' 110px)');   
                game.player[game.playerTurn].ballsUsed.push(pieceNumber);
                checkWinner();
                game.playerTurn = 0 ;
            }

            document.getElementById('playerTextTurnSpan').innerText = game.playerTurn;
            document.getElementById('playerText0').innerText = game.player[0].score;
            document.getElementById('playerText1').innerText = game.player[1].score;
            checkGameOver();

        } else {
            alert ('invalid move');
        }
    }
}
/**
 * Updates selected piece to have player owned by, ball number and background color
 * @param {HTMLElement} fieldPiceSelected 
 * @param {Number} player 
 * @param {Number} number 
 * @param {String} backgroundColor 
 */
function updatePlayingField(fieldPiceSelected, player, number, backgroundColor) {
    var fieldPieceSelectedNumber = document.createElement("div");
    fieldPieceSelectedNumber.className = 'fieldPieceSelectedNumber';
    var fieldPieceSelectedNumberParagraph = document.createElement("p");
    fieldPieceSelectedNumberParagraph.className = 'fieldPieceSelectedNumberParagraph';
    fieldPieceSelectedNumberParagraph.appendChild(document.createTextNode(number));
    fieldPieceSelectedNumber.appendChild(fieldPieceSelectedNumberParagraph);
    var whiteBall = document.getElementById('White');
    var blackBall = document.getElementById('Black');
    whiteBall.ownedBy = game.playerTurn;
    blackBall.ownedBy = game.playerTurn;

    fieldPiceSelected.appendChild(fieldPieceSelectedNumber);
    fieldPiceSelected.style['background'] = backgroundColor;
    fieldPiceSelected.ownedBy = player;
}
/**
 * Logic to check if player won
 */
function checkWinner() {
    var pieces = document.getElementsByClassName('playingFieldPartClass');
    var winningPieces = [];

    if (pieces[0].ownedBy == game.playerTurn && pieces[1].ownedBy == game.playerTurn && pieces[2].ownedBy == game.playerTurn ) {
        winningPieces.push(pieces[0], pieces[1], pieces[2]);
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }
    if ( pieces[0].ownedBy == game.playerTurn && pieces[3].ownedBy == game.playerTurn && pieces[6].ownedBy == game.playerTurn ) {
        winningPieces.push( pieces[0], pieces[3], pieces[6] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if ( pieces[0].ownedBy == game.playerTurn && pieces[4].ownedBy == game.playerTurn && pieces[8].ownedBy == game.playerTurn ) {
        winningPieces.push( pieces[0], pieces[4], pieces[8] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if ( pieces[1].ownedBy == game.playerTurn && pieces[4].ownedBy == game.playerTurn && pieces[7].ownedBy == game.playerTurn ) {
        winningPieces.push( pieces[1], pieces[4], pieces[7] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if ( pieces[2].ownedBy == game.playerTurn && pieces[5].ownedBy == game.playerTurn && pieces[8].ownedBy == game.playerTurn ) {
        winningPieces.push( pieces[2], pieces[5], pieces[8] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if ( pieces[2].ownedBy == game.playerTurn && pieces[4].ownedBy == game.playerTurn && pieces[6].ownedBy == game.playerTurn) {
        winningPieces.push( pieces[2], pieces[4], pieces[6] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if ( pieces[3].ownedBy == game.playerTurn && pieces[4].ownedBy == game.playerTurn && pieces[5].ownedBy == game.playerTurn ) {
        winningPieces.push( pieces[3], pieces[4], pieces[5] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }    

    if ( pieces[6].ownedBy == game.playerTurn && pieces[7].ownedBy == game.playerTurn && pieces[8].ownedBy == game.playerTurn) {
        winningPieces.push( pieces[6], pieces[7], pieces[8] ) ;
        game.player[game.playerTurn].score += calculateScore( winningPieces );
    }

    if (winningPieces.length == 3 && game.gameover == false) {
        clearFieldPieces( winningPieces);
    }
    
}
/**
 * Logic to check if game is over
 */
function checkGameOver() {
    if ( game.player[1].ballsUsed.length == (game.poolBall.length - 2) / 2) {
        if ( game.player[0].score > game.player[1] ) {
            alert ('player 0 won!');
        } else if ( game.player[0].score < game.player[1] ) {
            alert('player 1 won!')
        } else {
            alert('it\'s a draw');
        }
        game.gameover = true;
    }
}
/**
 * Pieces on the board that are a winning combination
 * @param {HTMLElement[]} winningPieces 
 */
function calculateScore (winningPieces) {
   var blackBallTrigger = false;
   var whiteBallTrigger = false;
   var score = 0;

   for ( var i = 0; i < winningPieces.length; i++) {
       //score += winningPieces[i].value;
       if ( winningPieces[i].id == 'Black' ) {
           blackBallTrigger = true;
       } else if ( winningPieces[i].id == 'White' ) {
            whiteBallTrigger = true;
       } 
   }
   if ( blackBallTrigger == true ) {
       alert ('player ' + game.playerTurn + ' lost');
       game.gameover = true;
       return -10;
   } else if ( whiteBallTrigger == true) {
        alert ('player ' + game.playerTurn + ' won');
       game.gameover = true;
       return 10;
   }
   
   return 3;
}
/**
 * Pieces to have their visual back to original
 * @param {HTMLElement} fieldPiceSelected 
 */
function clearFieldPieces(fieldPiceSelected) {
    for (var i = 0; i < fieldPiceSelected.length; i++) {
        updatePlayingField(fieldPiceSelected[i], null, null, 'grey');
        fieldPiceSelected[i].innerHTML = '';
        fieldPiceSelected[i].ownedBy = 'blank';
    }
   
}   