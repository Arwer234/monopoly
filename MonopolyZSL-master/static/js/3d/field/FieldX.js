class FieldX extends FieldBase {
    constructor(font, index, board) {
        super(font, index, board)

        this.pawnPositionTable = [
            [-0.25, -0.5],
            [-0.25, 0.5],
            [0.25, 0.5],
            [0.25, -0.5]
        ]

        this.text.position.z = 0.2
        this.fieldMesh.scale.x = 0.6
    }
}