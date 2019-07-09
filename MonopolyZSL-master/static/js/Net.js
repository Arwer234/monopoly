class Net{
    constructor(){
    }
    init(){
        this.client = io();
        this.client.on("onconnect", function (data) {
            console.log("klient podłączony")
        })
        this.client.on("nextTurn",function(data){
            ui.end()
            console.log(data)
            main3d.game.activePlayer = data

            if (data == main3d.game.player.playerID) {
                ui.yourTurn()
                $("#throw").fadeIn()
            }
        })
        this.client.on("getDice",function(data){
            main3d.game.movePawn(data)
        })
        this.client.on("id",function(data){
            console.log("data", data)

            if(data=="full") {ui.addCommMessage("Game is full!")} // TODO: OVERLAY or sth
            else {
                ui.addCommMessage("You have logged in!<br>You are player " + data)

                var playerID = parseInt(data)
                if (playerID == 0) {
                    ui.addCommMessage("You're the host")
                    main3d.game.host = true
                    $("#start").fadeIn()
                }
                else {
                    main3d.game.host = false
                }
                // for(let i=0; i<=playerID; i++)
                // main3d.game.addPawn()

                // if (main3d.game.player == null) {
                for(let i=0; i<=playerID; i++)
                    main3d.game.addPawn()

                main3d.game.player = main3d.pawns[main3d.pawns.length - 1]
                // }

                // else {
                //     main3d.game.addPawn()
                // }
                
                // if(main3d.game.player.playerID==1){
                //     net.client.emit("start")
                // }
            }
        })

        this.client.on("joined",function(data){
            main3d.game.addPawn()
        })

        this.client.on("started",()=>{
            this.updateBudget()
            main3d.game.start()
        })
        this.client.on("alreadyThrown",function(){
            ui.alreadyThrown()
        })

        this.client.on("bought",(data)=>{
            console.log(data)
            var has = data.notBougth ? "didn't" : "did"

            ui.addCommMessage("Player "+data.owner+" "+has+" buy "+main3d.board.fieldsData[parseInt(data.fieldIndex)].name)

            if (!data.notBougth)
                this.updateBudget()
        })
        this.client.on("houseBought",function(data){
            main3d.board.children[data.fieldIndex].platform.addHouse()
        })
        this.client.on("houseSold",function(data){
            main3d.board.children[data.fieldIndex].platform.removeHouse()
        })

        this.client.on("bankrupt",function(data){
            if (data.playerID == main3d.game.player.playerID) {
                ui.addCommMessage("You're a bankrupt")
                ui.cardOverlay.showBankrupt()
            }

            else {
                ui.addCommMessage("Player " + data.playerID + " is bankrupt")
                ui.addCommMessage("You won")
                ui.cardOverlay.showWon()
            }
        })

        this.client.on("updateBudget",(data)=>{
            if (data.target == main3d.game.player.playerID) {
                if (data.paid)
                    ui.addCommMessage("You paid " + data.rent + ", balance: " + data.left)
                else
                    ui.addCommMessage("You received " + data.rent + ", balance: " + data.left)

                this.setBudget(data.left)
            }
        })
    }

    updateBudget() {
        $.post("/getBudget", { playerID: main3d.game.player.playerID }, (data) => {
            this.setBudget(data.budget)
        })
    }

    setBudget(budget) {
        $("#balance").html("Balance: $" + budget)
    }

    start() {
        if (main3d.game.host) {
            this.client.emit("start")
            $("#start").fadeOut()
        }

        else {
            ui.notHost()
        }
    }

    sendDice(data){
        this.client.emit("sendDice", data)
        $("#throw").fadeOut()
    }
    endTurn(){
        this.client.emit("endTurn")
    }
    
}