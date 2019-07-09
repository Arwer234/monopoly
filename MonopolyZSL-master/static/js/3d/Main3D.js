class Main3D {
    constructor() {
        this.renderer = new Renderer({
            axes: true,
            orbit: true
        })

        this.renderer.scene.add(new DirectionalLight("x+", 0.4))
        this.renderer.scene.add(new DirectionalLight("y+", 0.8))
        this.renderer.scene.add(new DirectionalLight("z+", 0.6))

        this.renderer.scene.add(new DirectionalLight("x-", 0.3))
        this.renderer.scene.add(new DirectionalLight("y-", 0.15))
        this.renderer.scene.add(new DirectionalLight("z-", 0.2))

        var loader = new THREE.FontLoader();
        loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
            $.post("/getFields", {}, (fieldsData) => {

                this.board = new Board(font, fieldsData)
                this.renderer.scene.add(this.board)

                this.pawns = []

                // for (let i=0; i<4; i++) {
                //     var field = this.board.children[0]
                //     var pawn = new Pawn(field)

                //     var pos = field.getTargetPawnPos()
                //     pawn.setPos(pos)
                //     field.pawnCount++

                //     this.pawns.push(pawn)
                //     this.renderer.scene.add(pawn)
                // }

                this.game = new Game()              
            })
        })

        this.clock = new THREE.Clock();

        this.renderer.renderCbs.push(() => {
            var delta = this.clock.getDelta()

            // console.log(delta)

            if (this.pawns) {
                this.pawns.forEach((pawn => {

                    if (pawn.mixer)
                        pawn.mixer.update(delta)
                }))
            }
        })

        // ---------------------------------------------------------------------------
        this.renderer.renderCbs.push(() => {

            if (this.pawns) {
                this.pawns.forEach((pawn) => {
                    // if (pawn.mesh)
                    //     pawn.mesh.rotation.y += 0.01

                    if (pawn.movementVector) {

                        pawn.translateOnAxis(pawn.movementVector, -0.04)

                        var dist = pawn.position.clone().distanceTo(pawn.targetPos)
                        // console.log(pawn.position, pawn.targetPos, dist)

                        if (dist < 0.05) {
                            pawn.moveFinished()
                        }
                    }
                })
            }
        })


        
        // this.renderer.scene.add()

        // var filler = new THREE.Mesh(data.fillerGeometry, data.fillerMaterial)
        // filler.position.x = 5.4 + 1
        // filler.position.z = 5.4 + 1
        // this.renderer.scene.add(filler)
    }
}