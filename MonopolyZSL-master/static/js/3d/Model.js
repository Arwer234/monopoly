const loader = new THREE.JSONLoader()

class Model {
    constructor(model, texture, cb) {
        var mat = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load("assets/textures/" + texture),
            morphTargets: true
        })

        loader.load("assets/models/" + model, (geo) => {
            this.mesh = new THREE.Mesh(geo, mat)

            cb(this.mesh)
        })
    }
}