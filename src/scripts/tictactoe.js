let TicTacToe = (()=>{
    
    let _DOM = {
        gameBoardParent : document.querySelector(".gameboard"),
        drawGameBoard : ()=>{
            for(let x=0;x<9;){
                const block_DOM = document.createElement("div");
                _DOM.gameBoardParent.appendChild(block_DOM);
                block_DOM.setAttribute("data-block", ++x);
                block_DOM.setAttribute("class", "block");
                block_DOM.style.cssText = `cursor:not-allowed;display:flex;align-items:center;justify-content:center;font-size: 60px;text-align:center;`;
            }
        },
        drawShape : (p, shape, color)=>{
            // console.log("drawing at :",p);
            const block_DOM = document.querySelector(`[data-block="${p}"]`);
            block_DOM.style.zIndex = "-1";
            
            const shape_DOM = document.createElement("div");
            block_DOM.appendChild(shape_DOM);
            block_DOM.style.color = color;
            shape_DOM.textContent = shape;
        },
        showWining : (combo, msg)=>{
            //update scores for players
            Object.values(_game.players.playersList).forEach(player => {
                const score_DOM = document.querySelector(`[data-player="${player.name}"]`).querySelector("[data-score]");
                score_DOM.textContent = player.points;
                score_DOM.parentNode.style.color = player.color;
            });

            combo.forEach(block=>{
                let block_DOM = document.querySelector(`[data-block="${block}"]`);
                if(block_DOM.children.length > 0){block_DOM = block_DOM.children[0];}
                // console.log(block_DOM);
                block_DOM.style.transform = "scale(2.4) translate(0, -6px)";
                block_DOM.style.transition = "all .3s";
                // console.log(block_DOM.style.cssText);
            });

            document.querySelector(".message").textContent = msg;
            
        },
        blockUI: ()=>{
            Array.from(_DOM.gameBoardParent.children).forEach(block_DOM=>{
                block_DOM.style.cursor = "not-allowed";
                block_DOM.style.backgroundColor = "rgba(150, 150, 150, .1)";
            });
        },
        unblockUI: ()=>{
            Array.from(_DOM.gameBoardParent.children).forEach(block_DOM=>{
                block_DOM.style.cursor = "pointer";
                block_DOM.style.backgroundColor = "transparent";
            });
        }
    };
    //automatically draw gameboard
    _DOM.drawGameBoard();

    let _game = {
        winingCombo : [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ],
        status : 0,
        gameBoard : [
                        // [1, "o"], [2, "x"], [3, "o"],
                        // [4, "x"], [5, "x"], [6, "o"]
                    ],
        players : {
            firstPlayer : "",
            playersList : {}
        }
    }
    
    const startGame = ()=>{
        document.querySelector(".message").textContent = "";
        _DOM.unblockUI();

        //start the game if it hasn't been started or has been stoped   
        if(_game.status == 0){
            
            //randomly choose the first player to start
            if(Object.keys(_game.players.playersList).length == 2){
                _game.status = 1;
                let rand = Math.floor(Math.random()*10)+1
                if(rand > 5){_game.players.firstPlayer = Object.keys(_game.players.playersList)[0];console.log(`fistplayer: ${Object.keys(_game.players.playersList)[0]}`)}
                else{_game.players.firstPlayer = Object.keys(_game.players.playersList)[1];console.log(`fistplayer: ${Object.keys(_game.players.playersList)[1]}`)}
            }else{console.error("you need to create players first!");return false;}
        }

    }

    const createPlayer = (name, shape, color, type)=>{
        //create players if there are no players
        const playersLength = Object.keys(_game.players.playersList).length;
        if(playersLength < 2){
            if(type == "bot"){
                const botPlayer = Object.assign(_player(name, shape, color, type, playersLength), _botPlay(1));
                _addPlayer(botPlayer);
            }else{
                const humanPlayer = Object.assign(_player(name, shape, color, type, playersLength), _humanPlay());
                _addPlayer(humanPlayer);
            }
        }else{console.error("there are already two players, try reseting the game first");}
    }

    const play = (playerName, p)=>{

        //check the game status
        if(_game.status == 0){console.log("the game is stoped");return false;}

        //check if the two players are set
        if(Object.keys(_game.players.playersList).length < 2){
            console.log("two players are required to start the game");return false;
        }

        //check if the first player is choosen
        if(_game.players.firstPlayer == ""){
            console.log("first player hasn't been choosen");return false;
        }

        //play
        // console.log(_game.players.playersList["b"]);
        if(_game.players.playersList.hasOwnProperty(playerName)){
            if(_game.players.playersList[playerName].type != "bot"){
                _game.players.playersList[playerName].play(p);
            }else{
                _game.players.playersList[playerName].play();
            }
        }else{
            console.error("the player is not found");
        }
    }

    const _addPlayer = (player)=>{
        //check for duplicate names
        if(Object.entries(_game.players.playersList).find(plyr=>(plyr[0] == player.name))){
            console.error("can't add players with the same name!");return false;
        }

        //check for duplicate shapes
        // console.log(Object.entries(_game.players.playersList));
        if(Object.entries(_game.players.playersList).find(plyr=>(plyr[1].shape == player.shape))){
            console.error("can't add players with the same shape!");return false;
        }

        //add player
        _game.players.playersList[player.name] = player;
    }

    const playBot = (delay)=>{
        if(_game.status == 1 && _game.gameBoard.length <9){
            let currentPlayer = TicTacToe.whosTurn();
            if(Object.values(_game.players.playersList)[0].type == "bot" && Object.values(_game.players.playersList)[1].type == "bot"){
                TicTacToe.play(currentPlayer.name);
                setTimeout(()=>playBot(delay), delay);
                // console.log("after timeout");
                // playBot();
                return;
            }

            if(currentPlayer.type == "bot"){
                // console.log("bot is playing");
                setTimeout(()=>TicTacToe.play(currentPlayer.name), delay);
            }
        }
        // else{
        //     console.info("the PlayBot didn't run because it's not the bot's turn!");
        // }
    };

    const whosTurn = ()=>{
        if(_game.status == 1){
            let obj = {};
            if(_game.gameBoard.length > 0){
                let firstPlayerShape = _game.gameBoard.filter(block=>(block[1] == Object.values(_game.players.playersList)[0].shape));
                let secondPlayerShape = _game.gameBoard.filter(block=>(block[1] == Object.values(_game.players.playersList)[1].shape));
                if(firstPlayerShape.length>secondPlayerShape.length){
                    obj.name = Object.values(_game.players.playersList)[1].name;
                    obj.type = Object.values(_game.players.playersList)[1].type;
                    return obj;
                }
                else if(firstPlayerShape.length<secondPlayerShape.length){
                    obj.name = Object.values(_game.players.playersList)[0].name;
                    obj.type = Object.values(_game.players.playersList)[0].type;
                    return obj;
                }
            }

            obj.name = _game.players.firstPlayer;
            obj.type = _game.players.playersList[_game.players.firstPlayer].type;
            return obj;
        }else{return null;}
    };

    const _isLegalPlay = (player, p)=>{
        if(_game.gameBoard.length>8){console.log("the end");return "end";}
        
        if(player.name != whosTurn().name){return "badturn"}
        
        if(_game.gameBoard.some(block=>block[0] == p)){return "duplicate";}
        
        return true;
    };

    const _humanPlay = ()=>({
        play : function(p){
            // if(_gameBoard.length>8){console.log("the end");return false;}
            if(!_isLegalPlay(this, p)){return false;}
            _game.gameBoard.push([p, this.shape]);
            _DOM.drawShape(p, this.shape, this.color);
            let tmpObj = _checkWin(_game.gameBoard, this);
            if(tmpObj.won == true){_processWining(this, tmpObj.combo);}
            else if(tmpObj.won == "tie"){_processWining();}
            return true;
        }
    });

    //MiniMax
    const bestPlay = (gameboard, player, evaluatedType, depth)=>{
        //0, 1, -1
        const scores = {
            bot : {tie:0, true:1},
            human : {tie:0, true:-1}
        };
        //TODO: SEPERATE SHOWWINING FUNCTION²
        let result = _checkWin(gameboard, player);
        // console.log("checkwin: ", result.won);
        // console.log("checkwin-player: ", player.type);
        if(result.won != false && result.won != "tie"){
            // console.log("checkwin score: ", scores[player.type][result.won]);
            return scores[player.type][result.won]
        }else{
            let pastPlayer = Object.values(_game.players.playersList)[Number(!player.index)];
            result = _checkWin(gameboard, pastPlayer);
            if(result.won != false){
                // console.log("checkwin score: ", scores[pastPlayer.type][result.won]);
                return scores[pastPlayer.type][result.won]
            }
        }
        
        let moves = {};
        let emptyCells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        gameboard.forEach(blocks=>emptyCells.splice(emptyCells.indexOf(blocks[0]), 1));
        emptyCells.forEach(position => {
            // console.log("position: ", position);
            // console.log("gameboard: ");
            // console.log([...gameboard, [position, player.shape]]);
            // console.log("player: ");
            // console.log(player);
            let score = bestPlay([...gameboard, [position, player.shape]], Object.values(_game.players.playersList)[Number(!player.index)], evaluatedType, depth);
            moves[position] = score;
            // console.log("score ",score);
        });
        
        if(gameboard == _game.gameBoard){
            emptyCells
            // console.log("emptyCells",emptyCells);
            // console.log("gameboard",gameboard);
            // console.log("moves",moves);
            let position = Object.keys(moves).find(key=>(moves[key]==Math.max(...Object.values(moves))));
            // console.log("the best play is: ", position);
            return position;
        }

        // if(depth){return Object.values(moves).reduce((t, move)=>(t += move), 0);}//sum the all the moves
        // else{
            
        // }
        if(player.type == evaluatedType){
            // console.log("type", player.type);
            // console.log("(max): ", Math.max(...Object.values(moves)));
            // console.log("moves: ", ...Object.values(moves));
            return Math.max(...Object.values(moves));
        }
        else{
            // console.log("type", player.type);
            // console.log("(min): ", Math.min(...Object.values(moves)));
            return Math.min(...Object.values(moves));
        }
    }

    const _botPlay = (mod)=>{
        const _mods = {
            0:()=>{
                return Math.floor(Math.random()*9+1);
            },
            1:(player)=>{
                let best = bestPlay(_game.gameBoard, player, player.type);
                // console.log(best);
                return best;//no depth
            },
            2:(player)=>{
                return bestPlay(_game.gameBoard, player, player.type, true);//with depth
            }
        }

        if(!_mods.hasOwnProperty(mod)){console.error("the specified bot mod doesn't exist!");}

        const play = function(){
            // if(_gameBoard.length>8){console.log("the end");return false;}
            let chosenPos = _mods[mod](this);
            if(_isLegalPlay(this, chosenPos) == "end"){return false;}
            while(_isLegalPlay(this, chosenPos) == "duplicate"){chosenPos =_mods[mod](this);}
            
            // console.log("random position: "+randomPos);
            _game.gameBoard.push([parseInt(chosenPos), this.shape]);
            _DOM.drawShape(chosenPos, this.shape, this.color);

            let tmpObj = _checkWin(_game.gameBoard, this);
            if(tmpObj.won == true){_processWining(this, tmpObj.combo);}
            else if(tmpObj.won == "tie"){_processWining();}

            return true;
        }
        return {play};
    };

    const _player = function(name, shape, color, type, index){
        return {name, shape, color, type, points:0, index};
    };

    const resetGame = (removePlyrs, resetScore)=>{
        for(let x=0;x<9;){
            const blockShape = document.querySelector(`[data-block="${++x}"]`);
            const shape = blockShape.children;
            if(shape.length != 0){
                shape[0].remove();
                blockShape.style.zIndex = "1";
            }
        }
        _game.gameBoard = [];
        _game.status = 0;
        _game.firstPlayer = "";
        if(removePlyrs){_removePlayers();}
        else if(resetScore){
            Object.values(_game.players.playersList).forEach(playerObj=>(playerObj.points = 0));
        }
    }

    const _removePlayers = ()=>{
        Object.values(_game.players.playersList).forEach(player=>{
            // console.log(player.name);
            document.querySelector(`[data-player="${player.name}"]`).querySelector("[data-score]").textContent = 0;
        });
        _game.players.firstPlayer = "";
        _game.players.playersList = {};
    }

    const _processWining = (player, combo)=>{
        _DOM.blockUI();
        if(player == undefined){
            document.querySelector(".message").textContent = "TIE";
            _game.status = 0;//stop the game
            return;
        }
        
        //TODO: show winning
        player.points++;
        _game.status = 0;//stop the game
        
        const playersList = Object.values(_game.players.playersList);
        let msg;
        if(playersList[0].type == "bot" && playersList[1].type == "bot"){
            msg = `PLAYER ${player.name} WON!`;
        }else{
            if(player.type == "bot"){msg = `YOU LOST!`;}
            else{msg = `YOU WON!`;}
        }
        _DOM.showWining(combo, msg);
    }

    const _checkWin = (gameboard, player)=>{

        let wininCombo = [];
        let filteredGameBoard = gameboard.filter((shape)=>shape[1] == player.shape);
        let won = _game.winingCombo.some(combo=>{
            if(combo.every(block=>(filteredGameBoard.find(gbBlok=>(gbBlok[0]==block))))){
                wininCombo = combo;
                return true;
            }
        })
        // console.log("checkwin won:", won);
        if(won){
            //* _processWining(player, wininCombo);//need to be seperated
            return {won, combo:wininCombo};
        }
        
        //TODO: you know...
        if(gameboard.length == 9){
            //* _processWining();//no args means TIE
            //* _game.status = 0;//stop the game
            return {won:"tie"};
        }

        return {won};;
    };
    
    return {
        createPlayer,
        play,
        whosTurn,
        playBot,
        startGame,
        resetGame
    };

})()

export default TicTacToe;