const containerGeometry = new THREE.BoxGeometry(0.5, 1, 0.5)
const containerMaterial = new THREE.MeshBasicMaterial({wireframe: true, visible: false})

class Pawn extends THREE.Mesh {
    constructor(field, id) {
        super(containerGeometry, containerMaterial)
        this.field = field
        this.playerID = id

        this.model = new Model("Klauz.js", "Klauz.png", (mesh) => {
            mesh.scale.set(0.02, 0.02, 0.02)
            
            mesh.rotation.y = Math.PI

            this.mesh = mesh
            this.add(mesh)

            this.mixer = new THREE.AnimationMixer(mesh)
        })

        this.position.y += 0.25/2
    }

    setPos(pos) {
        this.pos = pos
        this.position.set(pos.x, pos.y, pos.z)
    }

    moveToField(field) {
        console.log("moveToField", field.index)

        var targetCorner = Math.floor(field.index/10)
        if (field.index % 10 == 0) targetCorner--

        var rot = Math.PI/2 * targetCorner

        if (targetCorner % 2 == 0) rot += Math.PI
        this.mesh.rotation.y = rot
        console.log("sourceCorner: " + targetCorner, "rotation: " + (this.mesh.rotation.y * 180 / Math.PI))

        if (this.field) {
            this.field.pawnCount--
        }

        if (this.pos) {
            if (this.animation) this.animation.stop()
            this.animation = this.mixer.clipAction("run").play()
            
            this.targetPos = field.getTargetPawnPosOffsetted()
            this.movementVector = this.pos.clone().sub(this.targetPos.clone()).normalize()
        }

        this.field = field
        this.field.pawnCount++
    }

    /**
     * Moves the mesh by corner. Changes rotation and does two-step move. Prevents going through center of the board
     * 
     * @param {*} corner - BigField, corner to come
     * @param {*} field  - target field
     */
    moveToFieldCorner(corner, field) {
        this.moveToField(corner)

        this.field2move = true
        this.field2 = field
    }

    moveFinished() {
        this.movementVector = null

        if (this.animation) this.animation.stop()
            this.animation = this.mixer.clipAction("stand").play()

        this.pos = this.targetPos.clone()

        if (this.field2move) {
            this.moveToField(this.field2)

            this.field2move = false
        }

        else {
            if (main3d.game.player == this)
                this.field.playerInteract(this)
        }
    }

    advancePlayer(count) {
        var indx = this.field.index + count
        if (indx >= 40)
            indx -= 40

        var field = main3d.board.children[indx]
        var sourceCorner = Math.floor(this.field.index/10)
        var corner = Math.floor(indx/10)

        if (sourceCorner != corner) {
            this.moveToFieldCorner(main3d.board.children[corner * 10], field)
        }

        else 
            this.moveToField(field)
    }
}