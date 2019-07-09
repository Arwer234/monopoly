class Text extends THREE.Mesh {
    
    constructor(font, text) {
        var geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.1,
            height: 0.01,
            curveSegments: 4,
        })

        super(geometry, data.tileMaterial)

        var size = new THREE.Box3().setFromObject(this);

        this.position.y = data.tileHeight - 0.13
        this.position.x = size.max.x / 2
        this.rotation.x = Math.PI/2
        this.rotation.y = Math.PI
    }
}