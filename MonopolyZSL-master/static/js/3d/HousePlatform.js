const housePlatformGeometries = [
    new THREE.BoxGeometry(0.25, 0.05, 0.30),
    new THREE.BoxGeometry(0.25, 0.09, 0.30),
    new THREE.BoxGeometry(0.25, 0.11, 0.30),
    new THREE.BoxGeometry(0.25, 0.07, 0.30)
]

const heights = [
    0.05, 0.09, 0.11, 0.07
]

const mergedPlatformGeometry = new THREE.Geometry()
for (let i=0; i<4; i++) {
    var mesh = new THREE.Mesh(housePlatformGeometries[i])
    mesh.position.set(0.3 * i, heights[i]/2, 0)
    mesh.updateMatrix()

    mergedPlatformGeometry.merge(mesh.geometry, mesh.matrix)
}

class HousePlatform extends THREE.Mesh {
    constructor(color) {
        var material = data.housePlatformMaterial.clone()
        material.color.setHex(parseInt(color, 16))

        super(mergedPlatformGeometry, material)

        this.position.y = data.tileHeight/2
        this.position.x = -0.45 
        this.position.z = 0.85

        this.houses = 0
    }

    addHouse() {
        var house = new House()
        this.add(house)

        house.position.x = 0.3 * this.houses
        house.position.y = heights[this.houses] + 0.07

        this.houses++
    }

    removeHouse() {
        this.remove(this.children[this.children.length - 1])
        
        this.houses--
    }
}