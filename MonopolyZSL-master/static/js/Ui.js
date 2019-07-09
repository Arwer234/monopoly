class Ui{
    constructor(){
        $("#start").on("click",function(){
            net.start()
        })

        $("#throw").on("click",function(){
            main3d.game.roll()
        })
        
        $("#end").on("click",function(){
            main3d.game.endOfTurn()
        })

        $("#reset").on("click",function(){
            $.post("/reset", {}, (data) => {
                console.log(data)
                window.location.reload()
            })
        })

        this.cardOverlay = new CardOverlay()
        this.cardDeck = new CardDeck()
    }
    diceRoll(first,second){
        this.addCommMessage("Player " + main3d.game.activePlayer + " rolled " + first + " & " + second)
    }
    notYourTurn(){
        this.addCommMessage("It's not your turn!")
    }
    notStarted() {
        this.addCommMessage("Game not started by host")
    }
    notHost() {
        this.addCommMessage("You're not the host")
    }
    getTime(){
        var now = new Date(Date.now());
        var formatted = "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+"] ";
        return formatted
    }
    end(){
        this.addCommMessage("Player " + main3d.game.activePlayer + " ends turn!")
    }
    alreadyThrown(){
        this.addCommMessage("You have already thrown the dice!")
    }

    yourTurn() {
        this.addCommMessage("Your turn")
    }
    boughtCard(name){
        this.addCommMessage("Player " + main3d.game.activePlayer + " bought " + name + "!")
    }

    addCommMessage(msg) {
        msg = this.getTime() + msg

        var pre = $("<pre>").html(msg)
        var span = $("<span>").append(pre)

        $("#comms").append(span)
        pre.slideToggle()

        return pre
    }
}