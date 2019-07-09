const far = 1.6 + (1.2 * 9) + 0.4

class Board extends THREE.Object3D {
    constructor(font, fieldsData) {
        super()
        this.fieldsData = fieldsData
        
        var index = 0

        for (let j=0; j<4; j++) {
            switch (j) {
                case 0: this.add(new FieldBig(font, index, this).setPos(0, 0)); break
                case 1: this.add(new FieldBig(font, index, this).setPos(far, 0)); break
                case 2: this.add(new FieldBig(font, index, this).setPos(far, far)); break
                case 3: this.add(new FieldBig(font, index, this).setPos(0, far)); break
            }

            index++

            for (let i=0; i<9; i++) {
                // var data = fieldsData.fields[j*9 + i]

                var pos = 1.6 + (1.2 * i)
                var field = null

                switch (j) {
                    case 0: field = new FieldX(font, index, this).setPos(pos, 0); break
                    case 1: field = new FieldZ(font, index, this).setPos(far, pos); break
                    case 2: field = new FieldX(font, index, this).setPos(far - pos, far); break
                    case 3: field = new FieldZ(font, index, this).setPos(0, far - pos); break
                }

                if (j == 2 || j == 3) {
                    field.rotation.y += Math.PI
                }

                // field.fieldMesh.material = field.fieldMesh.material.clone()
                // field.fieldMesh.material.color.setHex(data.color)
                // console.log(field.fieldMesh.material.color.r)

                // if (j==0 && i==0)
                this.add(field)

                index++
            }
            
        }
        // this.add(new FieldBig())

        // for (let i=0; i<9; i++) {
        //     var x = new FieldX().setX(1.6 + (1.2 * i))
        //     x.material = x.material.clone()
        //     x.material.color.r = i/9
        //     // console.log(x)
        //     this.add(x)
        // }

        // this.add(new FieldBig().setX(far))

        // for (let i=0; i<9; i++) {
        //     var x = new FieldZ().setX(far).setZ(1.6 + (1.2 * i))
        //     x.material = x.material.clone()
        //     x.material.color.r = i/9
        //     // console.log(x)
        //     this.add(x)
        // }

        // this.add(new FieldBig().setX(far).setZ(far))

        // for (let i=0; i<9; i++) {
        //     var x = new FieldX().setX(far - (1.6 + (1.2 * i))).setZ(far)
        //     x.material = x.material.clone()
        //     x.material.color.r = i/9
        //     // console.log(x)
        //     this.add(x)
        // }

        // this.add(new FieldBig().setZ(far))

        // for (let i=0; i<9; i++) {
        //     var x = new FieldZ().setZ(far - (1.6 + (1.2 * i)))
        //     x.material = x.material.clone()
        //     x.material.color.r = i/9
        //     // console.log(x)
        //     this.add(x)
        // }
    }
}