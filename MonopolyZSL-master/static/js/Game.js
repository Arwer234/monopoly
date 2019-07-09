class Game {
    constructor() {
        this.totalPlayers = 0
        this.player = null

        this.gameStarted = false
    }
    start(){
        // this.ui = new Ui()
        ui.addCommMessage("Game started by host")
        this.activePlayer = 0
        this.gameStarted = true

        this.commActivePlayer()
    }

    commActivePlayer() {
        ui.addCommMessage("Player " + this.activePlayer + "'s move")
    }

    getActivePlayer() {
        return main3d.pawns[this.activePlayer]
    }

    roll() {
        console.log(this.activePlayer, this.player)

        if (!this.gameStarted) ui.notStarted()
        else if(this.activePlayer==this.player.playerID) net.sendDice()
        else ui.notYourTurn()
    }
    movePawn(rolled){
        $("#dice1").attr("src", "dice/"+rolled[0]+".jpg")
        $("#dice2").attr("src", "dice/"+rolled[1]+".jpg")

        // if (oczka[0] == 6 && oczka[1] == 6) {

        // }
        main3d.pawns[this.activePlayer].advancePlayer(rolled[0] + rolled[1])
        ui.diceRoll(rolled[0],rolled[1])
    }
    endOfTurn(){
        if (!this.gameStarted) ui.notStarted()
        else if(this.activePlayer==this.player.playerID) net.endTurn()
        else ui.notYourTurn()
    }

    addPawn() {
        this.totalPlayers++

        var field = main3d.board.children[0]
        var pawn = new Pawn(field, main3d.pawns.length)

        var pos = field.getTargetPawnPos()
        pawn.setPos(pos)
        field.pawnCount++

        main3d.pawns.push(pawn)
        main3d.renderer.scene.add(pawn)
    }

    // --------------------------------------------------------------------------------------------
}