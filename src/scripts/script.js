document.addEventListener("click", (e)=>{
    
    const player1Container = document.querySelectorAll(".player")[0];
    const player2Container = document.querySelectorAll(".player")[1];
    const player1Name = player1Container.querySelector(".player-name").value;
    const player2Name = player2Container.querySelector(".player-name").value;
    const player1Shape = player1Container.querySelector(".player-shape").value;
    const player2Shape = player2Container.querySelector(".player-shape").value;
    const player1Color = player1Container.querySelector(".player-color").value;
    const player2Color = player2Container.querySelector(".player-color").value;
    const player1Type = player1Container.querySelector(".player-type").value;
    const player2Type = player2Container.querySelector(".player-type").value;
    player1Container.setAttribute("data-player", player1Name)
    player2Container.setAttribute("data-player", player2Name)

    if(e.target.getAttribute("data-block")){
        if(player1Type == "human"){
            TicTacToe.play(player1Name, parseInt(e.target.getAttribute("data-block")));
        }else{
            TicTacToe.play(player1Name);
        }

        if(player2Type == "human"){
            TicTacToe.play(player2Name, parseInt(e.target.getAttribute("data-block")));
        }else{
            TicTacToe.play(player2Name);
        }
    }else if(e.target.hasAttribute("data-start")){
        
        TicTacToe.createPlayer(player1Name, player1Shape, player1Color, player1Type);
        TicTacToe.createPlayer(player2Name, player2Shape, player2Color, player2Type);
        TicTacToe.startGame();
    }else if(e.target.hasAttribute("data-restart")){
        

        TicTacToe.resetGame(true);
        TicTacToe.createPlayer(player1Name, player1Shape, player1Color, player1Type);
        TicTacToe.createPlayer(player2Name, player2Shape, player2Color, player2Type);
        TicTacToe.startGame();
    }else if(e.target.hasAttribute("data-another")){
        TicTacToe.resetGame();
        TicTacToe.startGame();
    }
})
