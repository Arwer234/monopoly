class CardOverlay {
    constructor() {
        this.overlay = $("#overlay")
        this.overlayCard = $("#overlayCard")
        this.overlayBankrupt = $("#overlayBankrupt")
        this.overlayWon = $("#overlayWon")

        this.cardHeader = $("#cardHeader")
        this.cardName = $("#cardName")
        this.rent = $("#rent")
        this.rentAll = $("#rentAll")
        this.rentHouses = [
            $("#house1"),
            $("#house2"),
            $("#house3"),
            $("#house4")
        ]

        this.housePrice = $("#housePrice")

        this.fundsInfo = $("#fundsInfo")
        this.youhave = $("#youhave")
        this.cardPrice = $("#cardPrice")
        this.left = $("#left")

        this.btnBuy = document.getElementById("btnBuy")
        this.btnDontBuy = document.getElementById("btnDontBuy")

        this.houseRow = $("#houseRow")
    }

    show(name, background, rent, rentAll, rentHouseBase, housePrice, balance, price, buyCb, dontBuyCb) {
        var color
        if (background == "#000000")
            color = "#ffffff"
        else
            color = "#000000"

        this.cardHeader.css("color", color)
        this.cardHeader.css("background", background)
        this.cardName.html(name)
        this.rent.html(rent)
        this.rentAll.html(rentAll)

        for (let i=0; i<4; i++)
            this.rentHouses[i].html(rentHouseBase*2 *i*1.5 + rentHouseBase*2)

        this.housePrice.html(housePrice)

        this.fundsInfo.css("display", "block")
        this.youhave.html(balance)
        this.cardPrice.html("-" + price)

        this.left.html(balance - price)
        if (balance < price)
            this.left.css("color", "red")
        else
            this.left.css("color", "white")

        this.btnBuy.innerHTML = "Buy"
        this.btnDontBuy.innerHTML = "Don't buy"

        this.btnBuy.disabled = balance < price
        this.btnDontBuy.disabled = false
        this.setHouse(0)

        this.btnBuy.onclick = () => { 
            this.overlay.fadeToggle()
            buyCb()
            // ui.boughtCard(name)
        }

        this.btnDontBuy.onclick = () => {
            this.overlay.fadeToggle()
            dontBuyCb()
        }

        this.overlayCard.css("display", "flex")
        this.overlay.fadeToggle()
    }

    showInfo(name, background, rent, rentAll, rentHouseBase, housePrice, houses, hasHouses, buyCb, dontBuyCb) {
        var color
        if (background == "#000000")
            color = "#ffffff"
        else
            color = "#000000"

        this.cardHeader.css("color", color)
        this.cardHeader.css("background", background)
        this.cardName.html(name)
        this.rent.html(rent)
        this.rentAll.html(rentAll)

        for (let i=0; i<4; i++)
            this.rentHouses[i].html(rentHouseBase*2 *i*1.5 + rentHouseBase*2)


        this.housePrice.html(housePrice)
        this.fundsInfo.css("display", "none")

        this.btnBuy.innerHTML = "Buy house"
        this.btnDontBuy.innerHTML = "Sell house"

        this.btnBuy.disabled = (houses == 4) || !hasHouses
        this.btnDontBuy.disabled = (houses == 0) || !hasHouses
        this.setHouse(houses)

        this.btnBuy.onclick = (ev) => { 
            buyCb(btnBuy)

            ev.stopPropagation()
        }

        this.btnDontBuy.onclick = (ev) => {
            dontBuyCb(btnDontBuy)

            ev.stopPropagation()
        }

        this.overlayCard.css("display", "flex")
        this.overlay.fadeToggle()
        window.onclick = () => {
            this.overlay.fadeToggle()
            window.onclick = null
        }
    }

    showBankrupt() {
        this.overlayCard.css("display", "none")
        this.overlayBankrupt.css("display", "block")
        this.overlay.fadeToggle()
    }

    showWon() {
        this.overlayCard.css("display", "none")
        this.overlayWon.css("display", "block")
        this.overlay.fadeToggle()
    }

    addHouse() {
        this.houseRow.append(
            $("<div>").addClass("cardHouse")
        )
    }

    removeHouse() {
        this.houseRow.children().last().remove()
    }

    setHouse(houses) {
        this.houseRow.empty()
        
        for (let i=0; i<houses; i++)
            this.addHouse()
    }
}