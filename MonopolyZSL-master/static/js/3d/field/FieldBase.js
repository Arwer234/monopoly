class FieldBase extends THREE.Object3D {
    constructor(font, index, board) {
        super()

        this.index = index
        this.board = board
        this.getFieldData().houses = 0
        
        var material =  data.tileMaterial.clone()
        material.color.setHex(parseInt(this.getFieldData().color, 16))
        
        this.fieldMesh = new THREE.Mesh(data.tileGeometry, material)
        this.add(this.fieldMesh)

        this.pawnCount = 0
        this.name = this.getFieldData().name

        this.text = new Text(font, this.getFieldData().name.replace(" ", "\n"))
        this.add(this.text)

        if (this.getFieldData().hasHouses) {
            this.platform = new HousePlatform(this.getFieldData().color)
            this.add(this.platform)
        }
    }

    getFieldData() {
        return this.board.fieldsData[this.index]
    }

    // --------------------------------------------------------------------------
    getTargetPawnPos() {
        return new THREE.Vector3(this.pawnPositionTable[this.pawnCount][0], data.tileHeight + 1/3, this.pawnPositionTable[this.pawnCount][1])
    }

    getTargetPawnPosOffsetted() {
        return this.getTargetPawnPos().add(this.position.clone())
    }

    // --------------------------------------------------------------------------
    setPos(x, z) {
        this.position.x = x
        this.position.z = z

        return this
    }

    setX(x) {
        this.position.x = x

        return this
    }

    setZ(z) {
        this.position.z = z

        return this
    }

    // --------------------------------------------------------------------------
    playerInteract(player) {
        if (this.name == "Start" || this.name == "Wiezienie" || this.name == "Parking" || this.name == "Szansa" || this.name == "Idz do wiezienia" || this.name.includes("Podatek")) {
            console.log("i'm special!")
        }

        else {
            $.post("/getPlayer",{
                playerID: player.playerID
            },(playerData)=>{
                console.log("playerData", playerData)

                $.post("/getFieldData", {
                    index: this.index
                }, (data) => {
                    console.log("getFieldData", data)
                    if (data.owner == null) {
                        ui.cardOverlay.show(
                            this.getFieldData().name, 
                            "#" + this.getFieldData().color, 
                            this.getFieldData().rent, 
                            this.getFieldData().rent + 20, 
                            this.getFieldData().houseCost, 
                            this.getFieldData().houseCost, 
                            playerData.budget, 
                            this.getFieldData().cost,
                            () => {
                                $.post("/buyField", {
                                    bought: true,
                                    fieldIndex: this.index,
                                    playerID: player.playerID,
                                    cost: this.getFieldData().cost
                                }, (comm) => {
                                    console.log("kupiono")
                                    ui.cardDeck.addCard(this)
                                })
                            },

                            () => {
                                $.post("/buyField", {
                                    bought: false,
                                    fieldIndex: this.index,
                                    playerID: player.playerID
                                }, (comm) => {
                                    console.log("Nie kupiono")
                                })
                            },
                        )
                    }    

                    else {
                        $.post("/pay", {
                            playerID: main3d.game.player.playerID,
                            fieldIndex: this.index
                        })
                    }
                })
            })
        }        
    }
}