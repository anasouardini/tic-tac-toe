let TicTacToe = (()=>{
    
    _DOM = {
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
        gameBoard : [],
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
        if(Object.keys(_game.players.playersList).length < 2){
            if(type == "bot"){
                const botPlayer = Object.assign(_player(name, shape, color, type), _botPlay(0));
                _addPlayer(botPlayer);
            }else{
                const humanPlayer = Object.assign(_player(name, shape, color, type), _humanPlay());
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

    const playBot = ()=>{
        if(_game.status == 1 && _game.gameBoard.length <9){
            let currentPlayer = TicTacToe.whosTurn();
            if(Object.values(_game.players.playersList)[0].type == "bot" && Object.values(_game.players.playersList)[1].type == "bot"){
                TicTacToe.play(currentPlayer.name);
                playBot();
                return;
            }

            if(currentPlayer.type == "bot"){
                // console.log("bot is playing");
                TicTacToe.play(currentPlayer.name);
            }
        }
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
            _checkWin(this);
            return true;
        }
    });

    const _botPlay = (mod)=>{
        const _mods = {
            0:()=>{
                let rand = Math.floor(Math.random()*9+1);
                return rand;
            }
        }

        if(!_mods.hasOwnProperty(mod)){console.error("the specified bot mod doesn't exist!");}

        const play = function(){
            // if(_gameBoard.length>8){console.log("the end");return false;}
            
            rand = _mods[mod]();
            if(_isLegalPlay(this, rand) == "end"){return false;}
            while(_isLegalPlay(this, rand) == "duplicate"){rand = _mods[mod]();}
            
            const randomPos = rand;
            // console.log("random position: "+randomPos);
            _game.gameBoard.push([randomPos, this.shape]);
            _DOM.drawShape(randomPos, this.shape, this.color);

            _checkWin(this);

            return true;
        }
        return {play};
    };

    const _player = function(name, shape, color, type){
        return {name, shape, color, type, points:0};
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

    const _checkWin = (player)=>{
        let wininCombo = [];
        let filteredGameBoard = _game.gameBoard.filter((shape)=>shape[1] == player.shape);
        let won = _game.winingCombo.some(combo=>{
            if(combo.every(block=>(filteredGameBoard.find(gbBlok=>(gbBlok[0]==block))))){
                wininCombo = combo;
                return true;
            }
        })

        if(won){
            _processWining(player, wininCombo);
            return won;
        }
        
        //TODO: you know...
        if(_game.gameBoard.length == 9){
            _processWining();
            _game.status = 0;//stop the game
        }
        return won;
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
