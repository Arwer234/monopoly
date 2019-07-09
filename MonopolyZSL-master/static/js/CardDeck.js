class CardDeck {
    constructor() {
        this.cardDeck = $("#cardDeck")
        this.colors = {}

        this.maxColors = {
            "3C990F": 3,
            "6BA1B3": 3,
            "00008B": 2,
            "964B00": 2,
            "A69321": 3,
            "DC5539": 3,
            "DF5286": 3,
            "FF8300": 3,
        }

        // console.log(this.maxColors["964B00"])
    }

    addCard(field) {
        var data = field.getFieldData()

        var color
        if (data.color == "000000")
            color = "#ffffff"
        else
            color = "#000000"

        var cont = $("<div>")
            .addClass("cardContainer")
            .append($("<div>")
                .addClass("cardName")
                .css("color", color)
                .css("background", "#" + data.color)
                .html(data.name))
            .click((ev) => {
                ui.cardOverlay.showInfo(
                    data.name, 
                    "#" + data.color, 
                    data.rent, 
                    data.rent + 20, 
                    data.houseCost, 
                    data.houseCost,
                    data.houses,
                    data.hasHouses,

                    // Buying house
                    
                    (btn) => {
                        if(this.colors[data.color]==this.maxColors[data.color]){
                            if(main3d.game.activePlayer==main3d.game.player.playerID) {
                                data.houses++
                                ui.cardOverlay.addHouse()

                                if (data.houses == 4)
                                    btn.disabled = true

                                ui.cardOverlay.btnDontBuy.disabled = false
                                $.post("/buyHouse", {
                                    fieldIndex:data.index,
                                    playerID: main3d.game.player.playerID
                                }, (comm) => {
                                    if (comm.nofunds)
                                        alert("Not enough funds")
                                    else
                                        net.setBudget(comm.budget)
                                })
                            }

                            else alert("Nie twoja tura!")
                        }
                        else alert("Nie masz wszystkich kart z tego koloru!")
                    },

                    (btn) => {
                        if(this.colors[data.color]==this.maxColors[data.color]){
                                if(main3d.game.activePlayer==main3d.game.player.playerID) {
                                data.houses--
                                ui.cardOverlay.removeHouse()

                                if (data.houses == 0)
                                    btn.disabled = true

                                ui.cardOverlay.btnBuy.disabled = false
                                $.post("/sellHouse", {
                                    fieldIndex:data.index,
                                    playerID: main3d.game.player.playerID
                                }, (comm) => {
                                    net.setBudget(comm.budget)
                                })
                            }

                            else alert("Nie twoja tura!")
                        }
                        else alert("Nie masz wszystkich kart z tego koloru!")
                    }
                )

                ev.stopPropagation()
            })

        if (!this.colors[data.color])
            this.colors[data.color] = 0

        this.colors[data.color]++
        

        this.cardDeck.append(cont)
    }
}