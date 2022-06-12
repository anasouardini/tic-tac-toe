let TicTacToe = (()=>{
    
    _DOM = {
        gameBoardParent : document.querySelector(".gameboard"),
        drawGameBoard : ()=>{
            for(let x=0;x<9;){
                const block_DOM = document.createElement("div");
                _DOM.gameBoardParent.appendChild(block_DOM);
                block_DOM.setAttribute("data-block", ++x);
                block_DOM.setAttribute("class", "block");
                block_DOM.style.cssText = `display:flex;align-items:center;justify-content:center;font-size: 30px;text-align:center;`;
            }
        },
        drawShape : (p, shape, color)=>{
            const block_DOM = document.querySelector(`[data-block="${p}"]`);
            block_DOM.style.zIndex = "-1";
            
            const shape_DOM = document.createElement("div");
            block_DOM.appendChild(shape_DOM);
            block_DOM.style.color = color;
            shape_DOM.textContent = shape;
        }
    };
    //automatically draw gameboard
    _DOM.drawGameBoard();

    let _game = {
        status : 0,
        gameBoard : [],
        players : {
            firstPlayer : "",
            playersList : {}
        }
    }
    
    const startGame = ()=>{
        //start the game if it hasn't been started or has been stoped        
        if(_game.status == 0){
            _game.status = 1;
            //randomly choose the first player to start
            if(_game.players.firstPlayer == ""){
                if(Object.keys(_game.players.playersList).length == 2){
                    let rand = Math.floor(Math.random()*10)+1
                    if(rand > 5){_game.players.firstPlayer = _game.players.playersList[Object.keys(_game.players.playersList)[0]].name;}
                    else{_game.players.firstPlayer = _game.players.playersList[Object.keys(_game.players.playersList)[1]].name;}
                }else{console.error("you need to create players first!");return false;}
            }
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

    const _isLegalPlay = (player, p)=>{
        if(_game.gameBoard.length>8){console.log("the end");return "end";}
        
        if(_game.gameBoard.length > 0){
            let diff = _game.gameBoard.reduce((count, block)=>{
                if (block[1] == player.shape){return ++count;}
                else{return --count;}
            });
            
            if(diff>0){return "badturn";}
            else if(diff==0){
                if(_game.players.firstPlayer != player.name){return "badturn";}
            }
        }
        

        if(_game.gameBoard.some(block=>block[0] == p)){console.log("duplicate position");return "duplicate";}
        
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

        if(!_mods.hasOwnProperty(mod)){console.error("the bot mod doesn't exist!");}

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

    const _player = function(name, shape, color){
        return {name, shape, color, points:0};
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
        else if(resetScore){Object.values(_game.players.playersList).forEach(playerObj=>playerObj.points = 0);}
    }

    const _removePlayers = ()=>{_game.players.firstPlayer = "";_game.players.playersList = {};}

    const _processWining = (player)=>{
        //TODO: show winning
        console.log(`player: ${player.name} WON!`);
        player.points++;
        _game.status = 0;//stop the game
        document.querySelector("[data-player]").querySelector("[data-score]").textContent = player.points;
    }

    const _checkWin = (player)=>{
        //try catch block is just to exit out of the forEach function
        try{
            _game.gameBoard.filter((shape)=>shape[1] == player.shape)
            .sort((f, s)=>f[0]-s[0])
            .forEach((blk1, x, arr1)=>{
                arr1.filter(blk=>Math.abs(blk[0]-blk1[0])>0).forEach((blk2,x,arr2)=>{
                    if(Math.abs(blk2[0]-blk1[0])<5){
                        arr2.filter(blk=>Math.abs(blk[0]-blk2[0])>0).forEach((blk3)=>{
                            if(Math.abs(blk3[0]-blk2[0]) == Math.abs(blk2[0]-blk1[0])){
                                // console.log(blk1, blk2, blk3);
                                throw true;
                            }
                        });
                    }
                });
            });
        }catch(E){
            if(E == true){
                _processWining(player);
                return true;
            }
        }
        
        //TODO: you know...
        if(_game.gameBoard.length == 9){
            console.log("tie");
            _game.status = 0;//stop the game
        }

        return false;
    };
    
    return {
        createPlayer,
        play,
        startGame,
        resetGame
    };

})()


//================= TEST ===============
// This is how I found the relation
// between factorial and the wining combinations

// let bigArr = [];
// let obb = {};
// let winFacts = [
//     1*2*3,
//     4*5*6,
//     7*8*9,
//     1*4*7,
//     2*5*8,
//     3*6*9,
//     1*5*9,
//     3*5*7
// ];
// for(let x=0; x<99999999; x++){
//     let arr = [];
//     for(let y=0; y<3; y++){
//         let rand = Math.floor(Math.random()*9+1);
//         while(arr.some(block=>block == rand)){rand = Math.floor(Math.random()*9+1);}
//         arr.push(rand);
//     }

//     let fact = arr.reduce((t, el)=>(t*el), 1);
//     if(winFacts.find(e=>e==fact)){
//         if(!bigArr.some(Sarr=>Sarr.every(el=>{
//             return arr.some(elel=>elel==el);
//         })))
//         {
//             bigArr.push(arr);
//             if(!obb.hasOwnProperty(fact)){obb[fact] = [];}
//             obb[fact].push(arr);
//         }
//     }
// }

// console.log(obb);