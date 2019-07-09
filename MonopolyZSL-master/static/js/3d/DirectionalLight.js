class DirectionalLight extends THREE.Object3D {
    constructor(axis, intensity) {
        super()

        var dir = new THREE.DirectionalLight(0xFFFFFF, intensity)
        // this.add(dir.target)

        var pos = axis[1] == "-" ? -1000 : 1000
        // var target = axis[1] == "-" ? 1000 : -1000

        if (axis[0] == "x") {
            dir.position.set(pos, 0, 0)
            // dir.target.position.set(target, 0, 0)
        }

        else if (axis[0] == "y") {
            dir.position.set(0, pos, 0)
            // dir.target.position.set(0, target, 0)
        }
        
        else {
            dir.position.set(0, 0, pos)
            // dir.target.position.set(0, 0, target)
        }

        this.add(dir)
        // this.add(new THREE.DirectionalLightHelper(dir, 5))
    }
}