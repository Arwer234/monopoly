class FieldBig extends FieldBase {
    constructor(font, index, board) {
        super(font, index, board)
        
        this.pawnPositionTable = [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5]
        ]

        // this.text.rotation.z = data.textRotation
    }

    setMeshScale() {}
}